import { Component, Injector, ViewChild } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { ModalDirective } from "ngx-bootstrap";

@Component({
    selector: 'createWarehouseMaster',
    templateUrl: './create-warehouse-master.component.html'
})
export class CreateWarehouseMasterComponent extends AppComponentBase {

    @ViewChild('createWarehouseMaster', {static: true}) modal: ModalDirective;

    active = false;

    //warehouseDataInput: GetWarehouseMasterInput = new GetWarehouseMasterInput();
    
    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    show() {
        this.active = true;
        this.modal.show();
    }

    save(): void {
        
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}