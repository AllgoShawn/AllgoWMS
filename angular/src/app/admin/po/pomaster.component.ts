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

import { PagedResultDtoOfPOListDto,  POServiceProxy } from '@shared/service-proxies/apis/po-service-proxy';

import { CreateASNModalComponent } from '@app/admin/asn/create-asn-modal.component';

@Component({
    templateUrl: './pomaster.component.html',
    styleUrls: ['./pomaster.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class POMasterComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createASNModal', { static: true }) createASNModal: CreateASNModalComponent;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    //Filters
    
    public filterText: string = '';
    public poFilter: string = '';
    public customerFilter: string = '';
    public warehouseFilter: string = '';
    public deliverToFilter: string = '';
    public statusFilter: string = '';
    public dateFilter?: moment.Moment[];

    statusTypes: SelectItem[] = [];

    primengTableHelper = new PrimengTableHelper();
    advancedFiltersAreShown = false;

    constructor(
        injector: Injector,
        private _poService: POServiceProxy,
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

    //showAuditLogDetails(record: AuditLogListDto): void {
    //    this.auditLogDetailModal.show(record);
    //}
    
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
            value: "S",
            label: "Shipped" 
        });
    }

    getSupplements(event?: LazyLoadEvent) {
        
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
        
        this._poService.getPOMasters(
            this.filterText,
            this.poFilter,
            this.customerFilter,
            this.warehouseFilter,
            this.deliverToFilter,
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

            this._router.navigate(['app/admin/podetail'],
            { queryParams: {id:event.data.id}});
        }
        else{
            
            this.notify.error("Id not found. Please check the SQL query.")
        }
    }

    resetFilter(){

        this.filterText = '';
        this.poFilter = '';
        this.customerFilter = '';
        this.warehouseFilter = '';
        this.deliverToFilter = '';
        this.statusFilter = '';
        this.dateFilter = [];

        this.getSupplements();
    }

    createASN(poNo: string){

        this.createASNModal.show(poNo);
    }

    navigateToASNMaster(){
        this._router.navigate(['app/admin/asn']);
    }

    truncateStringWithPostfix(text: string, length: number): string {
        return abp.utils.truncateStringWithPostfix(text, length);
    }
}
