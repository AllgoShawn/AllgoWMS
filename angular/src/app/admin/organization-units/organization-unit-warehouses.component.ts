import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { WarehouseServiceProxy, WarehouseListDto, UpdateWarehouseInput } from '@shared/service-proxies/apis/warehouse-service-proxy';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';
import { finalize } from 'rxjs/operators';

import { CreateOrEditWarehouseModalComponent } from './create-or-edit-warehouse-modal.component';
import { AddMemberToWorkZoneModalComponent } from './add-member-to-workzone-modal.component';

@Component({
    selector: 'organization-unit-warehouses',
    templateUrl: './organization-unit-warehouses.component.html'
})
export class OrganizationUnitWarehousesComponent extends AppComponentBase implements OnInit {

    @Output() warehouseRemoved = new EventEmitter<void>();
    @Output() warehouseAdded = new EventEmitter<void>();
    @Output() warehouseEdited = new EventEmitter<void>();

    @Output() navigatedToWorkZone: EventEmitter<number> = new EventEmitter<number>();

    @ViewChild('addWarehouseModal', {static: true}) addWarehouseModal: CreateOrEditWarehouseModalComponent;
    @ViewChild('addMemberToWorkZoneModal', {static: true}) addMemberToWorkZoneModal: AddMemberToWorkZoneModalComponent;
    @ViewChild('dataTable', {static: true}) dataTable: Table;
    @ViewChild('paginator', {static: true}) paginator: Paginator;

    private _organizationUnit: IBasicOrganizationUnitInfo = null;
    
    filterText = '';

    constructor(
        injector: Injector,
        private _warehouseService: WarehouseServiceProxy
    ) {
        super(injector);
    }

    get organizationUnit(): IBasicOrganizationUnitInfo {
        return this._organizationUnit;
    }

    set organizationUnit(ou: IBasicOrganizationUnitInfo) {
        if (this._organizationUnit === ou) {
            return;
        }

        this._organizationUnit = ou;

        this.addWarehouseModal.warehouse.organizationUnitId = ou.id;
        
        if (ou) {
            this.refreshWarehouses();
        }
    }

    ngOnInit(): void {

    }

    getOrganizationUnitWarehouses(event?: LazyLoadEvent) {
        if (!this._organizationUnit) {
            return;
        }

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();
        this._warehouseService.getWarehouses(
            this._organizationUnit.id,
            this.filterText,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    nodeSelect(event) {

        this.navigatedToWorkZone.emit(event.data.id);
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    refreshWarehouses(): void {
        this.reloadPage();
    }

    addWarehouse(): void {
        this.addWarehouseModal.show({}, this.organizationUnit.id);
    }

    editWarehouse(warehouse: WarehouseListDto): void{
        
        this.addWarehouseModal.show({
            id: warehouse.id,
            code: warehouse.code
        }, this.organizationUnit.id);
    }

    removeWarehouse(warehouse: WarehouseListDto): void {
        this.message.confirm(
            this.l('RemoveWarehouseFromOuWarningMessage', warehouse.code, this.organizationUnit.displayName),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {

                    const updateInput = new UpdateWarehouseInput();
                    updateInput.id = warehouse.id;
                    updateInput.organizationUnitId = this._organizationUnit.id;
                    updateInput.code = warehouse.code;

                    this._warehouseService.deleteWarehouse(updateInput).subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.warehouseRemoved.emit(null);
                        this.refreshWarehouses();
                    });
                }
            }
        );
    }

    openAddMemberModal(workZoneId: number): void {
        this.addMemberToWorkZoneModal.show(workZoneId, 'Warehouse');
    }
    
    warehouseCreated(): void{
        this.warehouseAdded.emit(null);
        this.reloadPage();
    }

    warehouseUpdated(): void{      
        this.warehouseEdited.emit(null);
        this.reloadPage();
    }

    addMembersToWorkZone(): void{
        
        this.reloadPage();
    }
}
