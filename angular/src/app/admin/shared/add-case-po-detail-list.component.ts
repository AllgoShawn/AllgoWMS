import { Component, Injector, Input, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table, TableHeaderCheckbox } from 'primeng/components/table/table';
import { finalize } from 'rxjs/operators';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import * as _ from 'lodash';

import { PODetailDto, POServiceProxy } from '@shared/service-proxies/apis/po-service-proxy';
import { GetASNDetailInput, ASNServiceProxy } from '@shared/service-proxies/apis/asn-service-proxy';

export interface IPODetailListComponentData {
    poNo:  string;
    asnNo: string;
    caseId: number;
}

@Component({
    selector: 'add-case-po-detail-list',
    template:
        `

        <div class="col-12 primeng-datatable-container" [busyIf]="primengTableHelper.isLoading">
            <p-table #dataTable
                (onLazyLoad)="getData(poNo, $event)"
                [value]="primengTableHelper.records"
                selectionMode="multiple"
                [(selection)]="selectedPDs"
                rows="{{primengTableHelper.defaultRecordsCountPerPage}}" 
                [paginator]="false" 
                dataKey="sku"
                [lazy]="true"
                [responsive]="primengTableHelper.isResponsive">
                
                <ng-template pTemplate="header">
                    <tr>
                        <th style="width:38px">
                            <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
                        </th>
                        <th style="width:80px" [pSortableColumn]="poLineNo">
                            {{'Line No' | localize}}
                            <p-sortIcon [field]="poLineNo"></p-sortIcon>
                        </th>
                        <th style="width:100px" [pSortableColumn]="sku">
                            {{'Item Number' | localize}}
                            <p-sortIcon [field]="sku"></p-sortIcon>
                        </th>
                        <th style="width:130px" [pSortableColumn]="skuDescr">
                            {{'Description' | localize}}
                            <p-sortIcon [field]="skuDescr"></p-sortIcon>
                        </th>
                        <th style="width:100px" [pSortableColumn]="orderedQty">
                            {{'PO Quantity' | localize}}
                            <p-sortIcon [field]="orderedQty"></p-sortIcon>
                        </th>   
                        <th style="width:100px" [pSortableColumn]="openedQty">
                            {{'ASN Open Quantity' | localize}}
                            <p-sortIcon [field]="openedQty"></p-sortIcon>
                        </th> 
                        <th style="width:100px" [pSortableColumn]="shippedQty">
                            {{'Shipped Quantity' | localize}}
                            <p-sortIcon [field]="shippedQty"></p-sortIcon>
                        </th> 
                        <th [pSortableColumn]="receivedQty">
                            {{'ASN Quantity' | localize}}
                            <p-sortIcon [field]="receivedQty"></p-sortIcon>
                        </th>   
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-record="$implicit">
                    <tr [pSelectableRow]="record">
                        <td style="width: 38px">
                            <p-tableCheckbox [value]="record"></p-tableCheckbox>
                        </td>
                        <td>     
                            {{ record.poLineNo }}
                        </td>
                        <td>     
                            {{ record.sku }}
                        </td>
                        <td>     
                            {{ record.skuDescr }}
                        </td>
                        <td>     
                            {{ record.orderedQty }}
                        </td>
                        <td>     
                            {{ record.openedQty }}
                        </td>
                        <td>     
                            {{ record.shippedQty }}
                        </td>
                        <td>     
                            <input pInputText style="width: 75px" type="number" min="0" [(ngModel)]="record.receivedQty">
                        </td>
                    </tr>
                </ng-template>
            </p-table>
            <div class="primeng-no-data" *ngIf="primengTableHelper.totalRecordsCount == 0">
                {{'NoData' | localize }}
            </div>
            <div class="primeng-paging-container">
                <p-paginator [rows]="primengTableHelper.defaultRecordsCountPerPage"
                    #paginator (onPageChange)="getData(poNo, $event)"
                    [totalRecords]="primengTableHelper.totalRecordsCount"
                    [rowsPerPageOptions]="primengTableHelper.predefinedRecordsCountPerPage">
                </p-paginator>
                <span class="total-records-count">
                    {{'TotalRecordsCount' | localize:primengTableHelper.totalRecordsCount}}
                </span>
            </div>
        </div>
    `
})
export class AddCasePODetailListComponent extends AppComponentBase {

    @Input() cascadeSelectEnabled = true;

    @ViewChild('dataTable', {static: true}) dataTable: Table;
    @ViewChild('paginator', {static: true}) paginator: Paginator;

    set data(data: IPODetailListComponentData) {

        this.poNo = data.poNo;
        this.caseId = data.caseId;

        this.getData(this.poNo);
    }
    
    poNo: string = '';
    caseId: number
    allPODetails: PODetailDto[] = [];
    selectedPDs: PODetailDto[] = [];

    filter = '';

    constructor(
        private _poService: POServiceProxy,
        private _asnService: ASNServiceProxy,
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit(): void{
    }

    getData(poNo: string, event?: LazyLoadEvent): void{
        
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._poService.getPODetailListByPONo(
            poNo,
            '',
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).subscribe((result) => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;

            //console.log("PO Detail List")
            //console.log(result.items);

            this._asnService.getASNDetailListByCaseId(
                this.caseId
            ).subscribe((selectedResult) => {

                let tempSelectedPDs: PODetailDto[] = []
    
                //console.log("Selected Details")
                //console.log(selectedResult.items);

                for(let item of result.items){
    
                    for(let selectedItem of selectedResult.items){
                        
                        if(selectedItem.sku == item.sku){
                            
                            item.receivedQty = selectedItem.receivedQty
                            item.originalReceivedQty = selectedItem.receivedQty
                            tempSelectedPDs.push(item)
                        }
                    }
                }

                //console.log("Matched Details")
                //console.log(this.selectedPDs);

                this.selectedPDs = tempSelectedPDs;
            });

            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    getSelectedPODetails(): PODetailDto[] {

        if (!this.selectedPDs) {
            return [];
        }

        let selectedPODetails : PODetailDto[] = [];

        _.forEach(this.selectedPDs, pd => {
            selectedPODetails.push(pd);
        });

        return selectedPODetails;
    }
}
