import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { WorkZoneServiceProxy, WorkZoneListDto, UpdateWorkZoneInput } from '@shared/service-proxies/apis/workzone-service-proxy';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';
import { finalize } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';

import { CreateOrEditWorkZoneModalComponent } from './create-or-edit-workzone-modal.component';
import { AddMemberToWorkZoneModalComponent } from './add-member-to-workzone-modal.component';
import { update } from 'lodash';

@Component({
    selector: 'organization-unit-workzones',
    templateUrl: './organization-unit-workzones.component.html'
})
export class OrganizationUnitWorkZonesComponent extends AppComponentBase implements OnInit {

    @Output() workZoneRemoved = new EventEmitter<void>();
    @Output() workZoneAdded = new EventEmitter<void>();
    @Output() workZoneEdited = new EventEmitter<void>();

    @ViewChild('addWorkZoneModal', {static: true}) addWorkZoneModal: CreateOrEditWorkZoneModalComponent;
    @ViewChild('addMemberToWorkZoneModal', {static: true}) addMemberToWorkZoneModal: AddMemberToWorkZoneModalComponent;
    @ViewChild('dataTable', {static: true}) dataTable: Table;
    @ViewChild('paginator', {static: true}) paginator: Paginator;

    private _organizationUnit: IBasicOrganizationUnitInfo = null;

    filterText: string = '';
    type: string = '';
    filterWarehouseId?: number;

    workZoneTypeList: SelectItem[];
    warehouseList: SelectItem[];

    constructor(
        injector: Injector,
        private _workZoneService: WorkZoneServiceProxy
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

        this.addWorkZoneModal.workZone.organizationUnitId = ou.id;
        
        if (ou) {
            this.refreshWorkZones();
            this.getWarehouses();
        }
    }

    ngOnInit(): void {

        this.getFilterDropDown();
    }

    getFilterDropDown(): void{
        
        this.workZoneTypeList = [];

        this.workZoneTypeList.push({
            value: "",
            label: "All Workzone"
        });

        this.workZoneTypeList.push({
            value: "Store",
            label: "Store"
        });

        this.workZoneTypeList.push({
            value: "Customer",
            label: "Customer"
        });

        this.workZoneTypeList.push({
            value: "Supplier",
            label: "Supplier"
        });

        this.workZoneTypeList.push({
            value: "Transporter",
            label: "Transporter"
        });
    }

    getWarehouses(): void{

        this._workZoneService.getWarehouses(this._organizationUnit.id)
        .subscribe(results => {

            this.warehouseList = [];

            this.warehouseList.push({
                value: -1,
                label: "All Warehouse"
            });

            for(let result of results.items){
    
                this.warehouseList.push({
                    value: result.id,
                    label: result.code
                });
            }
        });
    }

    getOrganizationUnitWorkZones(event?: LazyLoadEvent) {
        if (!this._organizationUnit) {
            return;
        }

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();
        this._workZoneService.getWorkZones(
            this._organizationUnit.id,
            this.filterText,
            this.type,
            this.filterWarehouseId,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    refreshWorkZones(): void {
        this.reloadPage();
    }

    addWorkZone(): void {
        this.addWorkZoneModal.show({}, this.organizationUnit.id, null, this.filterWarehouseId);
    }

    editWorkZone(workZone: WorkZoneListDto): void{
        
        this.addWorkZoneModal.show({
            id: workZone.id,
            code: workZone.code
        }, this.organizationUnit.id, workZone.warehouseCode, workZone.warehouseId);
    }

    removeWorkZone(workZone: WorkZoneListDto): void {
        this.message.confirm(
            this.l('RemoveWorkZoneFromOuWarningMessage', workZone.code, this.organizationUnit.displayName),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {

                    const updateInput = new UpdateWorkZoneInput();
                    updateInput.id = workZone.id;
                    updateInput.organizationUnitId = this._organizationUnit.id;
                    updateInput.code = workZone.code;
                    updateInput.type = workZone.type;
                    updateInput.warehouseId = workZone.warehouseId;

                    this._workZoneService.deleteWorkZone(updateInput).subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.workZoneRemoved.emit(null);
                        this.refreshWorkZones();
                    });
                }
            }
        );
    }
    
    workZoneCreated(): void{
        this.workZoneAdded.emit(null);
        this.reloadPage();
    }

    workZoneUpdated(): void{      
        this.workZoneEdited.emit(null);
        this.reloadPage();
    }

    openAddMemberModal(workZoneId: number, type: string): void {
        this.addMemberToWorkZoneModal.show(workZoneId, type);
    }

    addMembersToWorkZone(): void{
        
        this.reloadPage();
    }
}
