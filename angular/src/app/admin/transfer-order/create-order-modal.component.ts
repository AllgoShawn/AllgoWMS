import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { formatDate } from '@angular/common';

import * as moment from 'moment';

import { ASNServiceProxy } from '@shared/service-proxies/apis/asn-service-proxy';
import { InventoryServiceProxy } from '@shared/service-proxies/apis/inventory-service-proxy';
import { GetTransferOrderMasterInput, TransferOrderServiceProxy } from '@shared/service-proxies/apis/transfer-order-service-proxy';

@Component({
    selector: 'createOrderModal',
    templateUrl: './create-order-modal.component.html'
})
export class CreateOrderModalComponent extends AppComponentBase {

    @ViewChild('createOrderModal', {static: true}) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() callModal: EventEmitter<{moduleId: number}> = new EventEmitter<{moduleId: number}>();

    active = false;
    saving = false;
    transferFromSelect = false;
    transferToSelect = false;
    carrierSelect = false;

    orderDataInput: GetTransferOrderMasterInput = new GetTransferOrderMasterInput();
    transferFromList: SelectItem[] = [];
    transferToList: SelectItem[] = [];
    carrierList: SelectItem[] = [];

    deliveryDate: Date;

    constructor(
        injector: Injector,
        private _asnService: ASNServiceProxy,
        private _inventoryService: InventoryServiceProxy,
        private _orderService: TransferOrderServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }
    
    show(): void {

        this.orderDataInput = new GetTransferOrderMasterInput();
        this.deliveryDate = null;

        this.getWarehouses()
        this.getCarriers()

        this.active = true;
        this.modal.show();
    }
    
    getWarehouses(): void{

        this._inventoryService.getWarehousesFromHost().subscribe(
            dropDownResults => {
            
                let itemNames: SelectItem[] = [];

                if(dropDownResults.items.length <= 0){

                    itemNames.push({
                        value: null,
                        label: "-- No Warehouse --" 
                    });
                }
                else{
                
                    itemNames.push({
                        value: null,
                        label: "-- Please Select --" 
                    });

                    for(let result of dropDownResults.items){
    
                        itemNames.push({
                            value: result.value + " | " + result.name,
                            label: result.value + " | " + result.name
                        })
                    }
                }
                    
                this.transferFromList = itemNames;
                this.transferToList = itemNames;
            }
        );
    }
    
    getCarriers(): void{

        this._asnService.getCarriers().subscribe(
            dropDownResults => {
            
                let itemNames: SelectItem[] = [];

                if(dropDownResults.items.length <= 0){

                    itemNames.push({
                        value: null,
                        label: "-- No Carrier --" 
                    });
                }
                else {
                
                    itemNames.push({
                        value: null,
                        label: "-- Please Select --" 
                    });

                    for(let result of dropDownResults.items){

                        itemNames.push({
                            value: result.value,
                            label: result.name
                        });
                    }
                }
                    
                this.carrierList = itemNames;
            }
        );
    }

    TransferFromSelect(): void{

        this.transferFromSelect = true;
    }

    TransferToSelect(): void{

        this.transferToSelect = true;
    }

    CarrierSelect(): void{

        this.carrierSelect = true;
    }

    save(): void {

        this.saving = true;
        
        this.orderDataInput.requiredDeliveryTime = moment(this.deliveryDate);

        let organizationId = this.orderDataInput.warehouseId.split("|")[0].trim();
        let warehouseId = this.orderDataInput.warehouseId.split("|")[1].trim();
        let consigneeId = this.orderDataInput.consigneeId.split("|")[1].trim();

        this.orderDataInput.organizationId = organizationId;
        this.orderDataInput.warehouseId = warehouseId;  
        this.orderDataInput.consigneeId = consigneeId;

        this._orderService.createTransferOrder(this.orderDataInput)
        .pipe(finalize(() => this.saving = false))
        .toPromise()
        .then(() => {
            this.notify.info('New order is created succesfully.');
            this.close();
            this.modalSave.emit(null);
        });    
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}

