import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { formatDate } from '@angular/common';

import * as moment from 'moment';

import { GetASNMasterInput, ASNServiceProxy } from '@shared/service-proxies/apis/asn-service-proxy';

@Component({
    selector: 'createASNModal',
    templateUrl: './create-asn-modal.component.html'
})
export class CreateASNModalComponent extends AppComponentBase {

    @ViewChild('createASNModal', {static: true}) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() callModal: EventEmitter<{moduleId: number}> = new EventEmitter<{moduleId: number}>();

    active = false;
    saving = false;
    haspono = false;

    asnDataInput: GetASNMasterInput = new GetASNMasterInput();
    poNoList: SelectItem[] = [];
    formatList: SelectItem[] = [];
    carrierList: SelectItem[] = [];

    deliveryDate: Date;

    constructor(
        injector: Injector,
        private _asnService: ASNServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }
    
    show(poNo?: string, itemId?: number): void {

        this.asnDataInput = new GetASNMasterInput();
        this.deliveryDate = null;

        if(poNo != null){
            this.asnDataInput.poNo = poNo;
            this.haspono = true;
        }
        else{
            this.getPONoList()
            this.haspono = false;
        }

        this.getCarriers()

        if(itemId != null){
            
            this._asnService.getASNMasterInfoById(
                itemId
            ).subscribe((result) => {
                
                this.asnDataInput.id = itemId
                this.asnDataInput.asnNo = result.asnNo
                this.asnDataInput.poNo = result.poNo
                this.asnDataInput.expectedArriveTime1 = result.expectedArriveTime1;
                this.deliveryDate = result.expectedArriveTime1.toDate();
                this.asnDataInput.carrierName = result.carrierName

                this.haspono = true;
                
            });
        }
        else{
            
            this.getASNFormats()
        }

        this.active = true;
        this.modal.show();
    }
    
    getPONoList(): void{

        this._asnService.getPONoList().subscribe(
            dropDownResults => {
            
                let itemNames: SelectItem[] = [];

                itemNames.push({
                    value: null,
                    label: "-- Please Select --" 
                });
                
                for(let result of dropDownResults.items){

                    itemNames.push({
                        value: result.poNo,
                        label: result.poNo
                    });
                }
                
                this.poNoList = itemNames;
            }
        );
    }

    getASNFormats(): void{
        
        this._asnService.getASNFormats(
            '',
            '',
            1000,
            0
        ).subscribe(
            (results) => {
            
                let itemNames: SelectItem[] = [];

                for(let result of results.items){

                    let DateString = ''

                    if(result.hasDate == 1){
                        DateString = formatDate(new Date(), 'yyyyMMdd', 'en')
                    }

                    itemNames.push({
                        value: result.id,
                        label: result.prefix + DateString + '-000X'
                    });
                }
                
                this.formatList = itemNames;
                this.asnDataInput.formatId = this.formatList[0].value;
        });
    }
    
    getCarriers(): void{

        this._asnService.getCarriers().subscribe(
            dropDownResults => {
            
                let itemNames: SelectItem[] = [];

                itemNames.push({
                    value: null,
                    label: "-- No Carrier --" 
                });
                
                for(let result of dropDownResults.items){

                    itemNames.push({
                        value: result.value,
                        label: result.name
                    });
                }
                
                this.carrierList = itemNames;
            }
        );
    }

    save(): void {

        this.saving = true;

        this.asnDataInput.expectedArriveTime1 = moment(this.deliveryDate);

        this._asnService.createASN(this.asnDataInput)
        .pipe(finalize(() => this.saving = false))
        .toPromise()
        .then(() => {
            this.notify.info('New ASN is created succesfully.');
            this.close();
            this.modalSave.emit(null);
        });    
    }

    update(): void {

        this.saving = true;

        this.asnDataInput.expectedArriveTime1 = moment(this.deliveryDate);

        this._asnService.editASN(this.asnDataInput)
        .pipe(finalize(() => this.saving = false))
        .toPromise()
        .then(() => {
            this.notify.info('The ASN is edited succesfully.');
            this.close();
            this.modalSave.emit(null);
        });    
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}

