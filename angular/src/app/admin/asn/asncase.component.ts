import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild, ViewChildren, ViewEncapsulation, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { PrimengTableHelper } from 'shared/helpers/PrimengTableHelper';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { HttpClient } from '@angular/common/http';
import { FileUpload } from 'primeng/fileupload';
import { Location } from "@angular/common";

import { ASNMasterDto, GetASNMasterInput, GetASNCaseInput, PagedResultDtoOfASNCasesDto, ASNServiceProxy } from '@shared/service-proxies/apis/asn-service-proxy';

import { AddCaseModalComponent } from './add-case-modal.component';
import { AddLineItemModalComponent } from './add-lineitem-modal.component';

@Component({
    templateUrl: './asncase.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class ASNCaseComponent extends AppComponentBase {

    @ViewChild('addCaseModal', { static: true }) addCaseModal: AddCaseModalComponent;
    @ViewChild('addLineItemModal', { static: true }) addLineItemModal: AddLineItemModalComponent;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    primengTableHelper = new PrimengTableHelper();

    uploadUrl: string;
    saving = false;
    busy = false;

    asnId: number;
    
    itemInfo: ASNMasterDto = new ASNMasterDto();

    // Public Value

    public filter: string;

    // Result Object
    constructor(
        injector: Injector,
        private _httpClient: HttpClient,
        private _asnService: ASNServiceProxy,
        private _sanitizer: DomSanitizer,
        private _permissionCheckerService: PermissionCheckerService,
        private _fileDownloadService: FileDownloadService,
        private _location: Location,
        private _router: Router,
        private _activatedrouter: ActivatedRoute
    ) {
        super(injector);
        //this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Assets/UpdateRFIDFromExcel';
    }

    ngOnInit(): void{

        this._activatedrouter.queryParams.subscribe(
            params => { 
                this.asnId = params.id;

                this._asnService.getASNMasterInfoById(
                    this.asnId
                ).subscribe((result) => {
        
                    this.itemInfo = result;
                });
            }
        );
        console.log(this.dataTable)
    }

    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    getCaseDatas(event?: LazyLoadEvent): void{
        
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._asnService.getASNCases(
            this.asnId,
            this.filter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).subscribe((result) => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    nodeSelect(event) {

        if(event.data.id){

            this._router.navigate(['app/admin/asndetail'],
            { queryParams: {id:event.data.id, poNo:this.itemInfo.poNo}});
        }
        else{
            
            this.notify.error("Id not found. Please check the SQL query.")
        }
    }

    checkType(caseType: string, caseId: number){

        if(caseType == "Big Box" || caseType == "Small Box"){
            
            this.addLooseCase(caseId)
        }
        else{

            this.addCase(caseId)
        }
    }

    addCase(caseId?: number){
        this.addLineItemModal.show(this.itemInfo.asnNo, this.itemInfo.poNo, caseId);
    }

    addLooseCase(caseId?: number){
        this.addCaseModal.show(this.asnId, this.itemInfo.asnNo, this.itemInfo.poNo, caseId);
    }

    deleteCase(caseNo?: string, itemId?: number){

        this.message.confirm(
            this.l('Confirmation to delete this Case Number : ' + caseNo),
            this.l('Are you confirm?'),
            (isConfirmed) => {
                if (isConfirmed) {

                    let asnCaseInput: GetASNCaseInput = new GetASNCaseInput();
                    asnCaseInput.id = itemId;

                    this._asnService.deleteCase(asnCaseInput)
                        .subscribe(() => {
                            this.refreshData();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    refreshData(): void{

        this.getCaseDatas();
    }

    shipASN(asnNo?: string, itemId?: number){

        this.message.confirm(
            this.l('Confirmation to ship this ASN Number : ' + asnNo),
            this.l('Are you confirm?'),
            (isConfirmed) => {
                if (isConfirmed) {

                    this._asnService.getShippingValidationById(itemId)
                    .subscribe((result) => {

                        if(result.udf01 == "1"){

                            let asnDataInput: GetASNMasterInput = new GetASNMasterInput();
                            asnDataInput.id = itemId;
        
                            this._asnService.shipASN(asnDataInput)
                                .subscribe(() => {
                                    this.refreshData();
                                    if(this.itemInfo.asnStatus != "Shipped"){
                                        this.itemInfo.asnStatus = "Shipped";
                                    }
                                    this.notify.success(this.l('SuccessfullyShipped'));
                                });
                        }
                        else{
                            this.notify.warn(result.udf01);
                        }
                    });
                }
            }
        );
    }
    
    back(): void {
        this._location.back();
    }

    print(caseNo: string): void{
        window.open("http://47.250.46.2/ReportServer_SQLEXPRESS/Pages/ReportViewer.aspx?%2fCaseLabelByCase&rs:Command=Render&rc:toolbar=true&rc:parameters=false&asn="+this.itemInfo.asnNo+"&organisation="+this.itemInfo.organizationId+"&ctnNo="+caseNo);
    }

    navigateToReport(): void{
        window.open("http://47.250.46.2/ReportServer_SQLEXPRESS/Pages/ReportViewer.aspx?%2fCaseLabel&rs:Command=Render&rc:toolbar=true&rc:parameters=false&asn="+this.itemInfo.asnNo+"&organisation="+this.itemInfo.organizationId);
    }
}