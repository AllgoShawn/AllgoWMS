import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { SelectItem } from 'primeng/api';
import { PrimengTableHelper } from 'shared/helpers/PrimengTableHelper';

import { PagedResultDtoOfTransferOrderListDto, GetTransferOrderMasterInput,  TransferOrderServiceProxy } from '@shared/service-proxies/apis/transfer-order-service-proxy';

import { CreateOrderModalComponent } from './create-order-modal.component';

@Component({
    templateUrl: './transfer-order-master.component.html',
    styleUrls: ['./transfer-order-master.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class TransferOrderMasterComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createOrderModal', { static: true }) createOrderModal: CreateOrderModalComponent;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    //Filters
    public dateRange: moment.Moment[] = [moment().startOf('day'), moment().endOf('day')];

    public filterText: string = '';
    public orderNoFilter: string = '';
    public transferFromFilter: string = '';
    public transferToFilter: string = '';
    public statusFilter: string = '';
    public dateFilter?: moment.Moment[];

    statusTypes: SelectItem[] = [];

    primengTableHelper = new PrimengTableHelper();
    advancedFiltersAreShown = false;

    constructor(
        injector: Injector,
        private _orderService: TransferOrderServiceProxy,
        private _router: Router,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    ngOnInit(): void{

        this.getStatusTypes();
    }

    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }
    
    getStatusTypes(): void{

        this.statusTypes = [];

        this.statusTypes.push({
            value: '',
            label: "All" 
        });
        
        this.statusTypes.push({
            value: "N",
            label: "Pending" 
        });
        
        this.statusTypes.push({
            value: "T",
            label: "Transferred" 
        });
    }

    getOrderDatas(event?: LazyLoadEvent) {
        
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        let startTime: string;
        let endTime: string;

        if(this.dateFilter != null){

            startTime = this.dateFilter[0].format('YYYY-MM-DD HH:mm:ss').toString();
            endTime = this.dateFilter[1].format('YYYY-MM-DD HH:mm:ss').toString();
        }

        this._orderService.getOrderMasters(
            this.filterText,
            this.orderNoFilter,
            this.transferFromFilter,
            this.transferToFilter,
            this.statusFilter,
            startTime,
            endTime,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).subscribe((result) => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    exportToExcel(): void {
        const self = this;
        /*
        self._transportService.getTransports(
            this.filter,
            undefined,
            1,
            0)
            .subscribe(result => {
                self._fileDownloadService.downloadTempFile(result);
            });
        */
    }

    nodeSelect(event) {

        if(event.data.id){

            this._router.navigate(['app/admin/transfer-order-detail'],
            { queryParams: {id:event.data.id}});
        }
        else{
            
            this.notify.error("Id not found. Please check the SQL query.")
        }
    }

    createOrder(){

        this.createOrderModal.show();
    }

    transferItem(itemId, orderNo){

        this.message.confirm(
            this.l('Confirmation to transfer this order : ' + orderNo),
            this.l('Are you confirm?'),
            (isConfirmed) => {
                if (isConfirmed) {

                    let orderDataInput: GetTransferOrderMasterInput = new GetTransferOrderMasterInput();
                    orderDataInput.id = itemId;

                    this._orderService.transferItemForTransferOrder(orderDataInput)
                        .subscribe(() => {
                            this.refreshData();
                            this.notify.success(this.l('SuccessfullyTransferred'));
                        });
                }
            }
        );
    }

    refreshData(): void{

        this.getOrderDatas();
    }

    truncateStringWithPostfix(text: string, length: number): string {
        return abp.utils.truncateStringWithPostfix(text, length);
    }
}
