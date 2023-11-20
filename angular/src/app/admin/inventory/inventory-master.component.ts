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

import { PagedResultDtoOfInventoryListDto, InventoryServiceProxy } from '@shared/service-proxies/apis/inventory-service-proxy';

@Component({
    templateUrl: './inventory-master.component.html',
    styleUrls: ['./inventory-master.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class InventoryMasterComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    //Filters
    public dateRange: moment.Moment[] = [moment().startOf('day'), moment().endOf('day')];

    public filterText: string = '';
    public organizationFilter: string = '';
    public warehouseFilter: string = '';
    public skuFilter: string = '';
    // public lotNumFilter: string = '';
    public descrFilter: string = '';
    public minQtyFilter?: number = null;
    public maxQtyFilter?: number = null;
    public minQtyAllocatedFilter?: number = null;
    public maxQtyAllocatedFilter?: number = null;
    public minQtyDamagedFilter?: number = null;
    public maxQtyDamagedFilter?: number = null;
    public minQtyInTransitFilter?: number = null;
    public maxQtyInTransitFilter?: number = null;

    primengTableHelper = new PrimengTableHelper();
    advancedFiltersAreShown = false;

    constructor(
        injector: Injector,
        private _inventoryService: InventoryServiceProxy,
        private _router: Router,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    ngOnInit(): void{

    }

    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    getInventoryDatas(event?: LazyLoadEvent) {
        
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._inventoryService.getInventoryMasters(
            this.filterText,
            this.organizationFilter,
            this.warehouseFilter,
            this.skuFilter,
            // this.lotNumFilter,
            this.descrFilter,
            this.minQtyFilter,
            this.maxQtyFilter,
            this.minQtyAllocatedFilter,
            this.maxQtyAllocatedFilter,
            this.minQtyDamagedFilter,
            this.maxQtyDamagedFilter,
            this.minQtyInTransitFilter,
            this.maxQtyInTransitFilter,
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

        this._inventoryService.exportInventoryMasters(
            this.filterText,
            this.organizationFilter,
            this.warehouseFilter,
            this.skuFilter,
            // this.lotNumFilter,
            this.descrFilter,
            this.minQtyFilter,
            this.maxQtyFilter,
            this.minQtyAllocatedFilter,
            this.maxQtyAllocatedFilter,
            this.minQtyDamagedFilter,
            this.maxQtyDamagedFilter,
            this.minQtyInTransitFilter,
            this.maxQtyInTransitFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event))
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
    
    navigateToInventoryBySKU(): void{

        this._router.navigate(['app/admin/inventory-sku']);
    }

    refreshData(): void{

        this.getInventoryDatas();
    }

    truncateStringWithPostfix(text: string, length: number): string {
        return abp.utils.truncateStringWithPostfix(text, length);
    }
}
