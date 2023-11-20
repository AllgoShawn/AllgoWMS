import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';

import { TransferOrderDetailListDto, GetTransferOrderDetailInput, TransferOrderServiceProxy } from '@shared/service-proxies/apis/transfer-order-service-proxy';
import { InventoryItemDto, InventoryItemListDto, InventoryServiceProxy } from '@shared/service-proxies/apis/inventory-service-proxy';
import { result } from 'lodash';

import * as moment from 'moment';

@Component({
    selector: 'addItemModal',
    templateUrl: './add-Item-modal.component.html'
})
export class AddItemModalComponent extends AppComponentBase {

    @ViewChild('addItemModal', {static: true}) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() callModal: EventEmitter<{moduleId: number}> = new EventEmitter<{moduleId: number}>();

    active = false;
    saving = false;

    id: number;
    orderId: number;
    organizationId: string;
    transferTo: string;
    transferFrom: string;
    detailList: TransferOrderDetailListDto = new TransferOrderDetailListDto();
    inventoryList: InventoryItemListDto = new InventoryItemListDto();
    itemDataInput: GetTransferOrderDetailInput = new GetTransferOrderDetailInput();

    itemNumbers: SelectItem[] = [];
    selectedItem: string;

    transferToQty: number;
    transferFromQty: number;
    plannedQty: number;

    expiryDate: Date;

    constructor(
        injector: Injector,
        private _orderService: TransferOrderServiceProxy,
        private _inventoryService: InventoryServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }
    
    show(id, orderId, organizationId, warehouseId, shopId, detailList): void {

        this.id = id;
        this.orderId = orderId;
        this.organizationId = organizationId;
        this.transferFrom = warehouseId;
        this.transferTo = shopId;

        this.itemNumbers = [];
        this.selectedItem = null;

        this.itemDataInput = new GetTransferOrderDetailInput();

        this.transferFromQty = 0;
        this.transferToQty = 0;
        this.plannedQty = 0;
        this.itemDataInput.qtyOrdered = 0;

        this.expiryDate = null;

        this.detailList.items = detailList;

        this.getInventories()

        this.active = true;
        this.modal.show();
    }

    getInventories(): void{
        
        this._inventoryService.getAvailableQtyFromWarehouses(this.organizationId, this.transferFrom, this.transferTo).subscribe(
            (results) => {
            
                this.inventoryList = results;
                
                let itemNames: SelectItem[] = [];

                itemNames.push({
                    value: '',
                    label: "-- Please Select --" 
                });

                for(let result of this.inventoryList.items){

                    if(!itemNames.some((item) => item.value == result.sku)){
                        
                        itemNames.push({
                            value: result.sku,
                            label: result.sku
                        });
                    }
                }
                
                this.itemNumbers = itemNames;

                if(this.id){
                    this.getDetailById(this.id);
                }
        });
    }

    searchAvailableQty(): void{

        this.transferFromQty = 0;
        this.transferToQty = 0;
        this.plannedQty = 0;

        for(let item of this.inventoryList.items){

            if(item.sku == this.selectedItem && item.warehouseId == this.transferFrom){

                this.transferFromQty = item.qty
            }
            
            if(item.sku == this.selectedItem && item.warehouseId == this.transferTo){

                this.transferToQty = item.qty
            }
        }

        for(let item of this.detailList.items){

            if(item.sku == this.selectedItem){

                //this.transferFromQty = this.transferFromQty - item.qtyOrdered
                //this.transferToQty = this.transferToQty + item.qtyOrdered
                this.plannedQty = this.plannedQty + item.qtyOrdered;
            }
        }
    }

    getDetailById(Id: number): void{

        this._orderService.getTransferOrderDetailById(
            Id
        ).subscribe((result) => {

            this.itemDataInput.id = result.id
            this.itemDataInput.sku = result.sku
            this.selectedItem = result.sku
            this.itemDataInput.qtyOrdered = result.qtyOrdered
            this.itemDataInput.lotNum = result.lotNum

            if (result.expiryDate){
                
                this.itemDataInput.expiryDate = result.expiryDate
                this.expiryDate = result.expiryDate.toDate();
            }

            this.searchAvailableQty();
        });
    }
    
    save(): void {

        this.saving = true;

        this.itemDataInput.orderId = this.orderId;
        this.itemDataInput.sku = this.selectedItem;

        if (this.expiryDate instanceof Date && !isNaN(this.expiryDate.valueOf())){
            
            this.itemDataInput.expiryDate = moment(this.expiryDate);
        }
        else{

            this.itemDataInput.expiryDate = null;
        }
    
        this._orderService.addItemForTransferOrder(this.itemDataInput)
        .pipe(finalize(() => this.saving = false))
        .toPromise()
        .then(() => {
            this.notify.info('New Item is added succesfully.');
            this.close();
            this.modalSave.emit(null);
        });  
    }
    
    update(): void {

        this.saving = true;

        this.itemDataInput.id = this.id;
        this.itemDataInput.sku = this.selectedItem;

        if (this.expiryDate instanceof Date && !isNaN(this.expiryDate.valueOf())){
            
            this.itemDataInput.expiryDate = moment(this.expiryDate);
        }
        else{

            this.itemDataInput.expiryDate = null;
        }
    
        this._orderService.editItemForTransferOrder(this.itemDataInput)
        .pipe(finalize(() => this.saving = false))
        .toPromise()
        .then(() => {
            this.notify.info('New Item is edited succesfully.');
            this.close();
            this.modalSave.emit(null);
        });  
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}

