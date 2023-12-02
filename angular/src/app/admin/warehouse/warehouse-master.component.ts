import { AfterViewInit, Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateWarehouseMasterComponent } from './create-warehouse-master.component';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { SelectItem } from 'primeng/api';
import { GetWarehouseMasterInput, WarehouseServiceProxy } from '@shared/service-proxies/apis/warehouse-service-proxy';
import { CustomLookupServiceProxy } from '@shared/service-proxies/service-proxies';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/components/table/table';

@Component({
    templateUrl: './warehouse-master.component.html',
    styleUrls: ['./warehouse-master.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class WarehouseMasterComponent extends AppComponentBase {
    
    @ViewChild('createWarehouseMaster', { static: true }) createWarehouseMaster: CreateWarehouseMasterComponent;
    @ViewChild('dataTable', { static: true}) dataTable: Table;
    @ViewChild('paginator', { static: true}) paginator: Paginator;

    public filterText: string = '';
    public whseCodeFilter: string = '';
    public whseNameFilter: string = '';
    public statusFilter: string = '';

    statusType: SelectItem[] = [];

    source = "t_warehouse";
    lookup_type = "STATUS"


    constructor(
        injector: Injector,
        private _customLookupService: CustomLookupServiceProxy,
        private _warehouseService: WarehouseServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }
    
    ngOnInit(): void {
        this.getLookup();
    }

    createWarehouse(itemId?: number) {
        this.createWarehouseMaster.show(itemId);
    }

    deleteWarehouse(whseCode?: string, whseName?: string, itemId?: number) {

        this.message.confirm(
            this.l('Confirmation to delete this warehouse: ' + whseCode + ': ' +whseName),
            this.l('Are you confirm?'),
            (isConfirmed) => {
                if (isConfirmed) {
                    let warehouseDataInput: GetWarehouseMasterInput = new GetWarehouseMasterInput();
                    warehouseDataInput.id = itemId;

                    this._warehouseService.deleteWarehouseMaster(warehouseDataInput)
                        .subscribe(() => {
                            this.getWarehouseMasterData();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        })
                }
            }
        )
    }

    getLookup() {
        this._customLookupService.getLookup(this.source,this.lookup_type).subscribe(
            dropDownResults => {
                let itemNames: SelectItem[] = [];

                itemNames.push({
                    value: null,
                    label: "All" 
                });
                
                for(let result of dropDownResults.items){

                    itemNames.push({
                        value: result.value,
                        label: result.name
                    });
                }
                
                this.statusType = itemNames;
            }
        )

    }

    getWarehouseMasterData(event?: LazyLoadEvent) {

        if(this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();
        
        this._warehouseService.getWarehouseMasters(
            this.filterText,
            this.whseCodeFilter,
            this.whseNameFilter,
            this.statusFilter,
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
        
        if (event.data.id) {
            this._router.navigate(['app/admin/warehouse-detail'],
            { queryParams:{id:event.data.id}});
        }
        else {
            this.notify.error("Id not found. Please check the SQL query.")
        }
    }
}