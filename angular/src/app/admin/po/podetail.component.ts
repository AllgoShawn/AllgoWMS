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

import { POMasterDto, PagedResultDtoOfPODetailsDto, POServiceProxy } from '@shared/service-proxies/apis/po-service-proxy';

import { CreateASNModalComponent } from '@app/admin/asn/create-asn-modal.component';

@Component({
    templateUrl: './podetail.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class PODetailComponent extends AppComponentBase {

    @ViewChild('createASNModal', { static: true }) createASNModal: CreateASNModalComponent;

    @ViewChild('ExcelFileUpload', { static: true }) excelFileUpload: FileUpload;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    primengTableHelper = new PrimengTableHelper();

    uploadUrl: string;
    saving = false;
    busy = false;

    itemId: number;
    
    itemInfo: POMasterDto = new POMasterDto();

    // Public Value

    public filter: string;

    // Result Object
    constructor(
        injector: Injector,
        private _httpClient: HttpClient,
        private _poService: POServiceProxy,
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

                this.itemId = params.id;

                this._poService.getPOMasterInfoById(
                    this.itemId
                ).subscribe((result) => {
        
                    this.itemInfo = result;
                });
            }
        );
    }

    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    getData(itemId?:number, event?: LazyLoadEvent): void{
        
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._poService.getPODetails(
            itemId,
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

    createASN(poNo: string){

        this.createASNModal.show(poNo);
    }

    refreshData(): void{

        this.getData(this.itemId);
    }
    
    back(): void {
        this._location.back();
    }
}