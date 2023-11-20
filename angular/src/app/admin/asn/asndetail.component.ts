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

import { ASNCaseDto, GetASNMasterInput, PagedResultDtoOfASNDetailsDto, ASNServiceProxy } from '@shared/service-proxies/apis/asn-service-proxy';

import { AddLineItemModalComponent } from './add-lineitem-modal.component';

@Component({
    templateUrl: './asndetail.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class ASNDetailComponent extends AppComponentBase {

    @ViewChild('addLineItemModal', { static: true }) addLineItemModal: AddLineItemModalComponent;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    primengTableHelper = new PrimengTableHelper();

    uploadUrl: string;
    saving = false;
    busy = false;

    caseId: number;
    
    itemInfo: ASNCaseDto = new ASNCaseDto();
    poNo: string;

    // Public Value

    public filter: string;

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

                this.caseId = params.id;
                this.poNo = params.poNo;

                this._asnService.getASNCaseById(
                    this.caseId
                ).subscribe((result) => {
        
                    this.itemInfo = result;
                });
            }
        );
    }

    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    getLineItemDatas(event?: LazyLoadEvent): void{
        
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._asnService.getASNDetails(
            this.caseId,
            this.filter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).subscribe((result) => {
            console.log(result.items)
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    addLineItem(detailId?: number){

        this.addLineItemModal.show(this.itemInfo.asnNo, this.poNo, detailId);
    }

    refreshData(): void{

        this.getLineItemDatas();
    }
    
    back(): void {
        this._location.back();
    }
}