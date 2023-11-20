import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateWarehouseMasterComponent } from './create-warehouse-master.component';
import { Router } from '@angular/router';

@Component({
    templateUrl: './warehouse-master.component.html',
    styleUrls: ['./warehouse-master.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class WarehouseMasterComponent extends AppComponentBase {
    
    @ViewChild('createWarehouseMaster', { static: true }) createWarehouseMaster: CreateWarehouseMasterComponent;

    constructor(
        injector: Injector,
        private _router: Router
    ) {
        super(injector);
    }

    createWarehouse() {
        this.createWarehouseMaster.show();
    }

    createWarehouseTab() {
        this._router.navigate(['app/admin/warehouse/warehouse-detail'])
    }
}