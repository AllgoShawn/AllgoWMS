import { Component, Injector, ViewChild, Output, EventEmitter } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { CustomLookupServiceProxy } from "@shared/service-proxies/service-proxies";
import { ModalDirective } from "ngx-bootstrap";
import { SelectItem } from 'primeng/api';
import { GetWarehouseMasterInput,WarehouseServiceProxy } from "@shared/service-proxies/apis/warehouse-service-proxy";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'createWarehouseMaster',
    templateUrl: './create-warehouse-master.component.html'
})
export class CreateWarehouseMasterComponent extends AppComponentBase {

    @ViewChild('createWarehouseMaster', {static: true}) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    statusType: SelectItem[] = [];

    saving = false;
    source = "t_warehouse";
    lookup_type = "STATUS"
    active = false;

    warehouseDataInput: GetWarehouseMasterInput = new GetWarehouseMasterInput();
    
    constructor(
        injector: Injector,
        private _customLookupService: CustomLookupServiceProxy,
        private _warehouseService: WarehouseServiceProxy
    ) {
        super(injector);
    }

    show(itemId?: number):void {
        this.warehouseDataInput = new GetWarehouseMasterInput();
        
        if(itemId != null) {
            this._warehouseService.getWarehouseMastersById(
                itemId
            ).subscribe((result) => {
                this.warehouseDataInput = result;
            })
        } 
        
        this.getLookup();
        this.active = true;
        this.modal.show();
    }

    getLookup() {
        this._customLookupService.getLookup(this.source,this.lookup_type).subscribe(
            dropDownResults => {
                let itemNames: SelectItem[] = [];
                
                for(let result of dropDownResults.items){

                    itemNames.push({
                        value: result.value,
                        label: result.name
                    });
                }

                this.statusType = itemNames;

                if(!this.warehouseDataInput.id) {
                    this.warehouseDataInput.status =  this.statusType[0].value ;
                }

            }
        )
    }

    save(): void {
        
        this.saving = true;
        this._warehouseService.createWarehouseMaster(this.warehouseDataInput)
        .pipe(finalize(() => this.saving = false))
        .toPromise()
        .then(() => {
            this.notify.info('New Warehouse is created successfully.')
            this.close();
            this.modalSave.emit(null);
        })
    }

    update(): void {
        
        this.saving = true;
       
        this._warehouseService.editWarehouseMaster(this.warehouseDataInput)
        .pipe(finalize(() => this.saving = false))
        .toPromise()
        .then(() => {
            this.notify.info('Warehouse is edited successfully.');
            this.close();
            this.modalSave.emit(null);
        })

        
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}