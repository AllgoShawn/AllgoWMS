import { Component, Injector, Input, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OrganizationUnitDto, OrganizationUnitServiceProxy } from '@shared/service-proxies/service-proxies';
import { OrganizationUnitCustomServiceProxy, PagedResultDtoOfOrganizationUnitListDto } from '@shared/service-proxies/apis/organization-service-proxy';
import { TreeNode } from 'primeng/api';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table, TableHeaderCheckbox } from 'primeng/components/table/table';
import { finalize } from 'rxjs/operators';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import * as _ from 'lodash';

export interface IOrganizationUnitsTreeComponentData {
    allOrganizationUnits: OrganizationUnitDto[];
    selectedOrganizationUnits: string[];
}

@Component({
    selector: 'organization-unit-list',
    template:
        `<div class='form-group'>
            <input id='OrganizationUnitsTreeFilter' type='text' (input)="filterOrganizationUnits(filter)" [(ngModel)]="filter" class='form-control' placeholder='{{"SearchWithThreeDot" | localize}}' >
        </div>
        
        <div class="primeng-datatable-container" [busyIf]="primengTableHelper.isLoading">
            <p-table #dataTable
                     (onLazyLoad)="getOrganizationUnits(filter, $event)"
                     [value]="primengTableHelper.records"
                     selectionMode="multiple"
                     [(selection)]="selectedOus"
                     rows="{{primengTableHelper.defaultRecordsCountPerPage}}"
                     [paginator]="false"
                     dataKey="code"
                     [lazy]="true"
                     [responsive]="primengTableHelper.isResponsive">
                <ng-template pTemplate="header">
                    <tr>
                        <th style="width:38px">
                            <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
                        </th>
                        <th pSortableColumn="code">
                            {{'Code' | localize}}
                            <p-sortIcon field="code"></p-sortIcon>
                        </th>
                        <th pSortableColumn="displayName">
                            {{'DisplayName' | localize}}
                            <p-sortIcon field="displayName"></p-sortIcon>
                        </th>
                        <th>
                            {{'warehouseCount' | localize}}
                        </th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-record="$implicit">
                    <tr [pSelectableRow]="record">
                        <td style="width: 38px">
                            <p-tableCheckbox [value]="record"></p-tableCheckbox>
                        </td>
                        <td>
                            <span class="ui-column-title">{{'Code' | localize}}</span>
                            {{record.code}}
                        </td>
                        <td>
                            <span class="ui-column-title">{{'DisplayName' | localize}}</span>
                            {{record.displayName}}
                        </td>
                        <td>
                            <span class="ui-column-title">{{'WarehouseCount' | localize}}</span>
                            {{record.warehouseCount}}
                        </td>
                    </tr>
                </ng-template>
            </p-table>
            <div class="primeng-no-data" *ngIf="primengTableHelper.totalRecordsCount == 0">
                {{'NoData' | localize}}
            </div>
            <div class="primeng-paging-container">
                <p-paginator [rows]="primengTableHelper.defaultRecordsCountPerPage"
                             #paginator
                             (onPageChange)="getOrganizationUnits(filter, $event)"
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
export class OrganizationUnitsListComponent extends AppComponentBase {

    @Input() cascadeSelectEnabled = true;

    @ViewChild('dataTable', {static: true}) dataTable: Table;
    @ViewChild('paginator', {static: true}) paginator: Paginator;

    set data(data: IOrganizationUnitsTreeComponentData) {

        this.getOrganizationUnits();

        this.selectedOus = [];
        
        for(let record of this.allOrganizationUnits){

            if(data.selectedOrganizationUnits.includes(record.code)){

                let selectedRow = new OrganizationUnitDto ()
                selectedRow.parentId = record.parentId;
                selectedRow.code = record.code;
                selectedRow.displayName = record.displayName;
                selectedRow.warehouseCount = record.warehouseCount;
                //selectedRow.memberCount = record.memberCount;
                //selectedRow.roleCount = record.roleCount;
                selectedRow.lastModificationTime = record.lastModificationTime;
                selectedRow.lastModifierUserId = record.lastModifierUserId;
                selectedRow.creationTime = record.creationTime;
                selectedRow.creatorUserId = record.creatorUserId;
                selectedRow.id = record.id;

                this.selectedOus.push(selectedRow);
            }
        }
    }
    
    allOrganizationUnits: OrganizationUnitDto[];
    selectedOus: OrganizationUnitDto[];

    filter = '';

    constructor(
        private _organizationUnitService: OrganizationUnitServiceProxy,
        private _organizationUnitCustomService: OrganizationUnitCustomServiceProxy,
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit(): void{
        
        TableHeaderCheckbox.prototype.updateCheckedState = function () {
            const currentRows = _.map(this.dt.value, this.dt.dataKey);
            const selectedRows = _.map(this.dt.selection, this.dt.dataKey);
            this.rowsPerPageValue = this.dt.rows;
            const commonRows = _.intersection(currentRows, selectedRows);
            return commonRows.length === currentRows.length;
          };
      
          Table.prototype.toggleRowsWithCheckbox = function (event, check) {
            let _selection;
            if (!check) {
              _selection = this.value.slice();
              _.each(_selection, (row) => {
                const match = {}; match[this.dataKey] = row[this.dataKey];
                _.remove(this._selection, match);
              });
            } else {
              _selection = check ? this.filteredValue ? this.filteredValue.slice() : this.value.slice() : [];
              _.each(this._selection, (row) => {
                const match = {}; match[this.dataKey] = row[this.dataKey];
                _.remove(_selection, match);
              });
              this._selection = this._selection.concat(_selection);
            }
      
            this.preventSelectionSetterPropagation = true;
            this.updateSelectionKeys();
            this.selectionChange.emit(this._selection);
            this.tableService.onSelectionChange();
            this.onHeaderCheckboxToggle.emit({
              originalEvent: event,
              affectedRows: _selection,
              checked: check
            });
          };
    }

    getOrganizationUnits(storeCode?: string, event?: LazyLoadEvent) {
        

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();
        this._organizationUnitCustomService.getOrganizationUnits(
            storeCode,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.hideLoadingIndicator();
        });
        
        this._organizationUnitCustomService.getOrganizationUnits(
            '',
            this.primengTableHelper.getSorting(this.dataTable),
            1000,
            0
        ).subscribe(result => {
            
            this.allOrganizationUnits = result.items;
        });
    }

    getSelectedOrganizations(): number[] {

        if (!this.selectedOus) {
            return [];
        }

        let organizationIds = [];

        _.forEach(this.selectedOus, ou => {
            organizationIds.push(ou.id);
        });

        return organizationIds;

        return [];
    }

    filterOrganizationUnits(filterText): any {

        this.getOrganizationUnits(filterText);
    }
}
