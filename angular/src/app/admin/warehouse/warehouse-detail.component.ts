import { Component, Injector, ViewEncapsulation, ViewChild } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";
import { Location } from "@angular/common";
import { WarehouseMasterDto, WarehouseServiceProxy } from "@shared/service-proxies/apis/warehouse-service-proxy";
import { ActivatedRoute } from "@angular/router";
import { Table } from 'primeng/components/table/table';

@Component({
    templateUrl: './warehouse-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class WarehouseDetailsComponent extends AppComponentBase {

    @ViewChild('dataTable', {static: true}) dataTable: Table;

    warehouseId: number;

    itemInfo: WarehouseMasterDto = new WarehouseMasterDto();
    
    constructor(
        injector: Injector,
        private _location: Location,
        private _activatedrouter: ActivatedRoute,
        private _warehouseMasterService: WarehouseServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._activatedrouter.queryParams.subscribe(
            params => { 
                this.warehouseId = params.id;
                
                this._warehouseMasterService.getWarehouseMastersById(
                    this.warehouseId
                ).subscribe((result) => {
        
                    this.itemInfo = result;
                });
            }
        );
    }

    

    back(): void {
        this._location.back();
    }

}