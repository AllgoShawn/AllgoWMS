import { Component, Injector, ViewEncapsulation } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";
import { Location } from "@angular/common";

@Component({
    templateUrl: './warehouse-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class WarehouseDetailsComponent extends AppComponentBase {
    
    constructor(
        injector: Injector,
        private _location: Location
    ) {
        super(injector);
    }

    back(): void {
        this._location.back();
    }
}