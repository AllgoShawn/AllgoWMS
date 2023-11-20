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

import { GetTransferOrderMasterInput, TransferOrderMasterDto, GetTransferOrderDetailInput, PagedResultDtoOfTransferOrderDetailsDto, TransferOrderServiceProxy } from '@shared/service-proxies/apis/transfer-order-service-proxy';

import { AddItemModalComponent } from './add-item-modal.component';

@Component({
    templateUrl: './transfer-order-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class TransferOrderDetailComponent extends AppComponentBase {

    @ViewChild('addItemModal', { static: true }) addItemModal: AddItemModalComponent;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    primengTableHelper = new PrimengTableHelper();

    uploadUrl: string;
    saving = false;
    busy = false;

    orderId: number;
    
    itemInfo: TransferOrderMasterDto = new TransferOrderMasterDto();

    // Public Value

    public filter: string;

    // Result Object
    constructor(
        injector: Injector,
        private _httpClient: HttpClient,
        private _transferOrderService: TransferOrderServiceProxy,
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
                this.orderId = params.id;

                this._transferOrderService.getTransferOrderMasterInfoById(
                    this.orderId
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

    getDetailDatas(event?: LazyLoadEvent): void{
        
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._transferOrderService.getTransferOrderDetails(
            this.orderId,
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

    addItem(){
        this.addItemModal.show(null, this.itemInfo.id, this.itemInfo.organizationId, this.itemInfo.warehouseId, this.itemInfo.consigneeId, this.primengTableHelper.records);
    }

    editItem(id){
        this.addItemModal.show(id, this.itemInfo.id, this.itemInfo.organizationId, this.itemInfo.warehouseId, this.itemInfo.consigneeId, this.primengTableHelper.records);
    }

    deleteItem(id, itemNumber){

        this.message.confirm(
            this.l('Confirmation to delete this item : ' + itemNumber),
            this.l('Are you confirm?'),
            (isConfirmed) => {
                if (isConfirmed) {

                    let orderDataInput: GetTransferOrderDetailInput = new GetTransferOrderDetailInput();
                    orderDataInput.id = id;

                    this._transferOrderService.deleteItemForTransferOrder(orderDataInput)
                        .subscribe(() => {
                            this.refreshData();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    transferOrder(itemId, orderNo){

        this.message.confirm(
            this.l('Confirmation to transfer this order : ' + orderNo),
            this.l('Are you confirm?'),
            (isConfirmed) => {
                if (isConfirmed) {

                    let orderDataInput: GetTransferOrderMasterInput = new GetTransferOrderMasterInput();
                    orderDataInput.id = itemId;

                    this._transferOrderService.transferItemForTransferOrder(orderDataInput)
                        .subscribe(() => {
                            this.refreshData();
                            if(this.itemInfo.soStatus != "Transferred"){
                                this.itemInfo.soStatus = "Transferred";
                            }
                            this.notify.success(this.l('SuccessfullyTransferred'));
                        });
                }
            }
        );
    }

    refreshData(): void{

        this.getDetailDatas();
    }
    
    back(): void {
        this._location.back();
    }
}