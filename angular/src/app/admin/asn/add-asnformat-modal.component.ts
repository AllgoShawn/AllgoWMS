import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { formatDate } from '@angular/common';

import { GetASNFormatInput, ASNServiceProxy } from '@shared/service-proxies/apis/asn-service-proxy';

@Component({
    selector: 'addASNFormatModal',
    templateUrl: './add-asnformat-modal.component.html'
})
export class AddASNFormatModalComponent extends AppComponentBase {

    @ViewChild('addASNFormatModal', {static: true}) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() callModal: EventEmitter<{moduleId: number}> = new EventEmitter<{moduleId: number}>();

    active = false;
    saving = false;

    asnFormatInput: GetASNFormatInput = new GetASNFormatInput();
    formattedASNNo: string;

    hasDate: number;
    lookups : SelectItem[] = [];

    constructor(
        injector: Injector,
        private _asnService: ASNServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }
    
    show(itemId?: number): void {

        this.asnFormatInput = new GetASNFormatInput();

        if(itemId != null){
            
            this._asnService.getASNFormatById(
                itemId
            ).subscribe((result) => {
                
                this.asnFormatInput.id = itemId
                this.asnFormatInput.prefix = result.prefix
                this.asnFormatInput.hasDate = result.hasDate
                this.hasDate = result.hasDate

                let DateString = ''
        
                if(this.hasDate == 1){
                    DateString = formatDate(new Date(), 'yyyyMMdd', 'en')
                }
                
                this.formattedASNNo = this.asnFormatInput.prefix + DateString + '-000X';
            });
        }

        this.active = true;
        this.modal.show();
    }
    
    generateExample(): void {

        let DateString = ''

        if(this.hasDate == 1){
            DateString = formatDate(new Date(), 'yyyyMMdd', 'en')
        }
        
        this.formattedASNNo = this.asnFormatInput.prefix + DateString + '-000X';
    }

    save(): void {

        this.saving = true;

        if(this.hasDate){
            this.asnFormatInput.hasDate = 1
        }
        else{
            this.asnFormatInput.hasDate = 0
        }

        this._asnService.addASNFormat(this.asnFormatInput)
        .pipe(finalize(() => this.saving = false))
        .toPromise()
        .then(() => {
            this.notify.info('New ASN Format is added succesfully.');
            this.close();
            this.modalSave.emit(null);
        });    
    }

    update(): void {

        this.saving = true;

        if(this.hasDate){
            this.asnFormatInput.hasDate = 1
        }
        else{
            this.asnFormatInput.hasDate = 0
        }

        this._asnService.editASNFormat(this.asnFormatInput)
        .pipe(finalize(() => this.saving = false))
        .toPromise()
        .then(() => {
            this.notify.info('The ASN Format is edited succesfully.');
            this.close();
            this.modalSave.emit(null);
        });    
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}

