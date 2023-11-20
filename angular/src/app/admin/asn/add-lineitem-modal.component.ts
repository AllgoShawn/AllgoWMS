import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';

import { GetASNDetailInput, ASNServiceProxy } from '@shared/service-proxies/apis/asn-service-proxy';
import { PODetailDto, PODetailListDto, POServiceProxy } from '@shared/service-proxies/apis/po-service-proxy';
import { result } from 'lodash';

import * as moment from 'moment';

@Component({
    selector: 'addLineItemModal',
    templateUrl: './add-LineItem-modal.component.html'
})
export class AddLineItemModalComponent extends AppComponentBase {

    @ViewChild('addLineItemModal', {static: true}) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() callModal: EventEmitter<{moduleId: number}> = new EventEmitter<{moduleId: number}>();

    active = false;
    saving = false;

    lineItemDataInput: GetASNDetailInput = new GetASNDetailInput();

    itemList: PODetailListDto = new PODetailListDto();
    itemNumbers: SelectItem[] = [];
    selectedItem: number;

    originalOrderedQty: number;

    asnNo: string;
    poNo: string;
    caseNo: string;

    expiryDate: Date;

    constructor(
        injector: Injector,
        private _asnService: ASNServiceProxy,
        private _poService: POServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }
    
    show(asnNo, poNo, caseId?): void {
        
        this.asnNo = asnNo;
        this.poNo = poNo;

        this.itemNumbers = [];
        this.selectedItem = null;

        this.lineItemDataInput = new GetASNDetailInput();

        this.lineItemDataInput.orderedQty = 0;
        this.lineItemDataInput.expectedQty = 0;
        this.lineItemDataInput.openedQty = 0;
        this.lineItemDataInput.shippedQty = 0;
        this.lineItemDataInput.containerQty = 1;

        this.originalOrderedQty = 0;
        this.expiryDate = null;

        if(caseId){
            this.getDetailByCaseId(caseId);
        }
        else{
            this.getDetail()
        }

        this.active = true;
        this.modal.show();
    }

    getDetail(): void{
        
        this._poService.getPODetailsByPoNo(
            this.poNo
        ).subscribe(
            (result) => {
            
                this.itemList = result;
                
                let itemNames: SelectItem[] = [];

                itemNames.push({
                    value: '',
                    label: "-- Please Select --" 
                });

                for(let result of this.itemList.items){

                    let remainedQty = (result.orderedQty - result.openedQty - result.shippedQty)

                    if(remainedQty < 0){

                        remainedQty = 0;
                    }

                    itemNames.push({
                        value: result.id,
                        label: result.sku + 
                        " | " + result.skuDescr + 
                        " | Qty : " + result.orderedQty.toString() + 
                        " | Remaining : " + remainedQty.toString()
                    });
                }
                
                this.itemNumbers = itemNames;
        });
    }

    getDetailByCaseId(caseId: number): void{

        this._asnService.getASNDetailByCaseId(
            caseId
        ).subscribe((result) => {

            this.lineItemDataInput.id = result.id
            this.selectedItem = result.id
            this.lineItemDataInput.sku = result.sku
            this.lineItemDataInput.skuDescr = result.skuDescr
            this.lineItemDataInput.expectedQty = result.expectedQty
            this.lineItemDataInput.orderedQty = result.receivedQty
            this.originalOrderedQty = result.receivedQty
            this.lineItemDataInput.openedQty = result.openedQty
            this.lineItemDataInput.shippedQty = result.shippedQty
            this.lineItemDataInput.containerId = result.containerId
            this.lineItemDataInput.containerQty = result.containerQty
            this.lineItemDataInput.lotAtt01 = result.lotAtt01

            if (result.expiryDate){
                
                this.lineItemDataInput.expiryDate = result.expiryDate
                this.expiryDate = result.expiryDate.toDate();
            }
        });
    }

    fillItemInfo(): void{

        for(let item of this.itemList.items){

            if(item.id == this.selectedItem){

                this.lineItemDataInput.sku = item.sku
                this.lineItemDataInput.skuDescr = item.skuDescr
                this.lineItemDataInput.expectedQty = item.orderedQty
                this.lineItemDataInput.openedQty = item.openedQty
                this.lineItemDataInput.shippedQty = item.shippedQty
                this.lineItemDataInput.lotAtt01 = item.lotAtt01
            }
        }
    }
    
    save(): void {

        this.saving = true;

        if(this.lineItemDataInput.containerQty * this.lineItemDataInput.orderedQty <= this.lineItemDataInput.expectedQty - (this.lineItemDataInput.openedQty + this.lineItemDataInput.shippedQty) ){

            this.lineItemDataInput.asnNo = this.asnNo;
            
            if (this.lineItemDataInput.expiryDate instanceof Date && !isNaN(this.lineItemDataInput.expiryDate.valueOf())){
                
                this.lineItemDataInput.expiryDate = moment(this.expiryDate);
            }
            else{
    
                this.lineItemDataInput.expiryDate = null;
            }
    
            this._asnService.addLineItem(this.lineItemDataInput)
            .pipe(finalize(() => this.saving = false))
            .toPromise()
            .then(() => {
                this.notify.info('New Case is added succesfully.');
                this.close();
                this.modalSave.emit(null);
            });    
        }
        else{

            this.message.warn('Input quantity is out of required PO quantity.');
            this.saving = false;
        }
    }
    
    update(): void {

        this.saving = true;

        if(this.lineItemDataInput.orderedQty - this.originalOrderedQty <= this.lineItemDataInput.expectedQty - (this.lineItemDataInput.openedQty + this.lineItemDataInput.shippedQty) ){

            if (this.expiryDate instanceof Date && !isNaN(this.expiryDate.valueOf())){
                
                this.lineItemDataInput.expiryDate = moment(this.expiryDate);
            }
            else{
    
                this.lineItemDataInput.expiryDate = null;
            }
    
            this._asnService.editLineItem(this.lineItemDataInput)
            .pipe(finalize(() => this.saving = false))
            .toPromise()
            .then(() => {
                this.notify.info('The Case is edited succesfully.');
                this.close();
                this.modalSave.emit(null);
            });      
        }
        else{

            this.message.warn('Input quantity is out of required PO quantity.');
            this.saving = false;
        }
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}

