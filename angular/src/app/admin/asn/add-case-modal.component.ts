import { AfterViewChecked, Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table, TableHeaderCheckbox } from 'primeng/components/table/table';
import { PrimengTableHelper } from 'shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { IPODetailListComponentData, AddCasePODetailListComponent } from '../shared/add-case-po-detail-list.component';
import * as _ from 'lodash';
import { AppConsts } from '@shared/AppConsts';

import { POMasterDto, PagedResultDtoOfPODetailsDto, POServiceProxy, PODetailDto } from '@shared/service-proxies/apis/po-service-proxy';

import { GetASNCaseInput, GetASNDetailInput, ASNServiceProxy } from '@shared/service-proxies/apis/asn-service-proxy';

@Component({
    selector: 'addCaseModal',
    templateUrl: './add-case-modal.component.html'
})
export class AddCaseModalComponent extends AppComponentBase {

    @ViewChild('addCaseModal', {static: true}) modal: ModalDirective;
    @ViewChild('addCasePoDetailList', {static: false}) addCasePoDetailList: AddCasePODetailListComponent;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() callModal: EventEmitter<{moduleId: number}> = new EventEmitter<{moduleId: number}>();

    active = false;
    saving = false;
    editing = false;
    primengTableHelper = new PrimengTableHelper();

    caseDataInput: GetASNCaseInput = new GetASNCaseInput();
    caseTypes: SelectItem[] = [];

    caseVolume: number;

    asnId: number;
    caseId: number;
    asnNo: string;
    poNo: string;

    issueItem: string;

    constructor(
        injector: Injector,
        private _poService: POServiceProxy,
        private _asnService: ASNServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }
    
    show(asnId, asnNo, poNo, caseId): void {
        
        this.asnId = asnId;
        this.caseId = caseId;
        
        this.poNo = poNo;
        this.asnNo = asnNo;

        this.caseDataInput = new GetASNCaseInput();
        this.caseVolume = 0;
        this.caseDataInput.ctnGrossWeight = 0;

        this.issueItem = null;
        
        this.getCaseTypes();

        if(this.caseId){
            
            this.getCaseDetail(this.caseId)
            this.editing = true;
        }
        
        this.active = true;
        this.modal.show();
    }
    
    getCaseTypes(): void{

        this.caseTypes = [];

        this.caseTypes.push({
            value: "BG",
            label: "Big Box" 
        });
        
        this.caseTypes.push({
            value: "SM",
            label: "Small Box" 
        });

        this.caseDataInput.ctnType = "BG";
    }

    getCaseDetail(caseId: number): void{

        this._asnService.getASNCaseById(
            caseId
        ).subscribe((result) => {

            this.caseDataInput.id = caseId;
            this.caseDataInput.ctnNo = result.ctnNo;
            this.caseDataInput.ctnType = result.ctnType;
            this.caseDataInput.ctnSize = result.ctnSize;
            this.caseVolume = Number(result.ctnSize);
            this.caseDataInput.ctnGrossWeight = result.ctnGrossWeight;
            this.caseDataInput.ctnSealNo1 = result.ctnSealNo1;
        });
    }

    onShown(): void {
       
        this.addCasePoDetailList.data = <IPODetailListComponentData>{
            poNo: this.poNo,
            asnNo: this.asnNo,
            caseId: this.caseId
        };

        //document.getElementById('Name').focus();
    }
    
    validateSave(): boolean {

        let selectedPODetail: PODetailDto[] = [];
        selectedPODetail = this.addCasePoDetailList.getSelectedPODetails()

        console.log(selectedPODetail)

        for(let selectedItem of selectedPODetail){

            if(selectedItem.originalReceivedQty == null || selectedItem.originalReceivedQty == 0){

                if(selectedItem.receivedQty > selectedItem.orderedQty - (selectedItem.openedQty + selectedItem.shippedQty)){
    
                    this.issueItem = selectedItem.sku;
                    return false;
                }
            }
            else{

                if(selectedItem.receivedQty - selectedItem.originalReceivedQty > selectedItem.orderedQty - (selectedItem.openedQty + selectedItem.shippedQty)){
    
                    this.issueItem = selectedItem.sku;
                    return false;
                }
            }
        }

        return true;
    }

    save(): void {

        this.saving = true;

        if(this.validateSave()){

            if(this.addCasePoDetailList.getSelectedPODetails().length <= 0){

                this.message.confirm(
                    this.l('The list of selected PO is empty, are you sure to add case?'),
                    this.l('Are you confirm?'),
                    (isConfirmed) => {
                        if (isConfirmed) {

                            this.confirmSave();
                        }
                        else{
                            
                            this.saving = false;
                        }
                    }
                );
            }
            else{
                
                this.confirmSave();
            }
        }
        else{

            this.message.warn('Quantity of ' + this.issueItem +' is out of required PO quantity.');
            this.saving = false;
        }
    }

    confirmSave() {
        
        this.caseDataInput.id = this.asnId;
        this.caseDataInput.ctnSize = this.caseVolume.toString()

        this._asnService.addCase(this.caseDataInput)
        .pipe(finalize(() => this.saving = false))
        .subscribe(async (result) => {

            let selectedPODetail: PODetailDto[] = [];

            selectedPODetail = this.addCasePoDetailList.getSelectedPODetails()
            
            this.close();

            for(let selectedItem of selectedPODetail){

                await timeout(1000);

                let lineItemDataInput: GetASNDetailInput = new GetASNDetailInput(); 

                lineItemDataInput.ctnId = result;
                lineItemDataInput.asnNo = this.asnNo;
                lineItemDataInput.sku = selectedItem.sku;
                lineItemDataInput.skuDescr = selectedItem.skuDescr;
                lineItemDataInput.expectedQty = selectedItem.orderedQty;
                lineItemDataInput.orderedQty = selectedItem.receivedQty;

                this._asnService.addLineItemForCase(lineItemDataInput)
                .pipe(finalize(() => this.saving = false))
                .toPromise()
            }
            
            this.notify.info('New Case is added succesfully.');
            this.modalSave.emit(null);
        })
    }

    update(): void {

        this.saving = true;

        if(this.validateSave()){

            if(this.addCasePoDetailList.getSelectedPODetails().length <= 0){

                this.message.confirm(
                    this.l('The list of selected PO is empty, are you sure to update case?'),
                    this.l('Are you confirm?'),
                    (isConfirmed) => {
                        if (isConfirmed) {

                            this.confirmUpdate()
                        }
                        else{
                            
                            this.saving = false;
                        }
                    }
                );
            }
            else{
                
                this.confirmUpdate()
            }
        }
        else{

            this.message.warn('Quantity of ' + this.issueItem +' is out of required PO quantity.');
            this.saving = false;
        }
    }

    confirmUpdate(): void{
        
        this.caseDataInput.ctnSize = this.caseVolume.toString()
        
        this._asnService.editCase(this.caseDataInput)
        .pipe(finalize(() => this.saving = false))
        .toPromise()
        .then(() => {

            let selectedPODetail: PODetailDto[] = [];

            selectedPODetail = this.addCasePoDetailList.getSelectedPODetails()

            for(let selectedItem of selectedPODetail){

                let lineItemDataInput: GetASNDetailInput = new GetASNDetailInput(); 

                lineItemDataInput.ctnId = this.caseDataInput.id;
                lineItemDataInput.asnNo = this.asnNo;
                lineItemDataInput.sku = selectedItem.sku;
                lineItemDataInput.skuDescr = selectedItem.skuDescr;
                lineItemDataInput.expectedQty = selectedItem.orderedQty;
                lineItemDataInput.orderedQty = selectedItem.receivedQty;

                this._asnService.addLineItemForCase(lineItemDataInput)
                .pipe(finalize(() => this.saving = false))
                .toPromise()
            }
            
            this.notify.info('The Case is edited succesfully.');
            this.close();
            this.modalSave.emit(null);
        });   
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

