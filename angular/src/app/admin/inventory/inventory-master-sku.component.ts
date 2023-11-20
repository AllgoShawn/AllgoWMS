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
import { Location } from "@angular/common";

import { PagedResultDtoOfInventoryListDto, InventoryServiceProxy } from '@shared/service-proxies/apis/inventory-service-proxy';

@Component({
    templateUrl: './inventory-master-sku.component.html',
    styleUrls: ['./inventory-master-sku.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class InventoryBySkuMasterComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    //Filters
    public dateRange: moment.Moment[] = [moment().startOf('day'), moment().endOf('day')];

    public filterText: string = '';
    public skuFilter: string = '';
    public warehouseFilter: string = '';
    public statusFilter: string = '';
    public minQtyFilter: number;
    public maxQtyFilter: number;

    statusTypes: SelectItem[] = [];

    primengTableHelper = new PrimengTableHelper();
    advancedFiltersAreShown = false;

    constructor(
        injector: Injector,
        private _inventoryService: InventoryServiceProxy,
        private _location: Location,
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
            value: "AV",
            label: "Available" 
        });
        
        this.statusTypes.push({
            value: "DG",
            label: "Damaged" 
        });
        
        this.statusTypes.push({
            value: "PT",
            label: "Pending Transfer In" 
        });
    }

    getInventoryDatas(event?: LazyLoadEvent) {
        
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._inventoryService.getInventoryBySKUMasters(
            this.filterText,
            this.skuFilter,
            this.warehouseFilter,
            this.statusFilter,
            this.minQtyFilter,
            this.maxQtyFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).subscribe((result) => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    exportToExcel(event?: LazyLoadEvent) {
        const self = this;

        this._inventoryService.exportInventoryBySKUMasters(
            this.filterText,
            this.skuFilter,
            this.warehouseFilter,
            this.statusFilter,
            this.minQtyFilter,
            this.maxQtyFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).subscribe(result => {
            self._fileDownloadService.downloadTempFile(result);
        });
    }
    
    back(): void {
        this._location.back();
    }

    refreshData(): void{

        this.getInventoryDatas();
    }

    truncateStringWithPostfix(text: string, length: number): string {
        return abp.utils.truncateStringWithPostfix(text, length);
    }
}
