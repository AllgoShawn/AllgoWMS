import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OrganizationTreeComponent } from './organization-tree.component';
import { OrganizationListComponent } from './organization-list.component';
import { OrganizationUnitWarehousesComponent } from './organization-unit-warehouses.component';
import { OrganizationUnitWorkZonesComponent } from './organization-unit-workzones.component';
import { OrganizationUnitMembersComponent } from './organization-unit-members.component';
import { OrganizationUnitRolesComponent } from './organization-unit-roles.component';
import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';

@Component({
    templateUrl: './organization-units.component.html',
    animations: [appModuleAnimation()]
})
export class OrganizationUnitsComponent extends AppComponentBase {
    
    @ViewChild('ouWarehouses', {static: true}) ouWarehouses: OrganizationUnitWarehousesComponent;
    @ViewChild('ouWorkZones', {static: true}) ouWorkZones: OrganizationUnitWorkZonesComponent;
    //@ViewChild('ouMembers', {static: true}) ouMembers: OrganizationUnitMembersComponent;
    //@ViewChild('ouRoles', {static: true}) ouRoles: OrganizationUnitRolesComponent;
    //@ViewChild('ouTree', {static: true}) ouTree: OrganizationTreeComponent;
    @ViewChild('ouList', {static: true}) ouList: OrganizationListComponent;
    organizationUnit: IBasicOrganizationUnitInfo = null;

    warehouseActive = true;
    workZoneActive = false;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ouSelected(event: any): void {
        this.organizationUnit = event;
        this.ouWorkZones.organizationUnit = event;
        this.ouWarehouses.organizationUnit = event;
        //this.ouMembers.organizationUnit = event;
        //this.ouRoles.organizationUnit = event;

        this.resetTab()
    }
    
    switchTab(event: any): void{

        this.workZoneActive = true;
        this.warehouseActive = false;

        this.ouWorkZones.filterWarehouseId = event;
        this.ouWorkZones.type = '';

        this.ouWorkZones.getOrganizationUnitWorkZones();
    }

    resetTab(): void{

        this.workZoneActive = false;
        this.warehouseActive = true;

        this.ouWorkZones.filterWarehouseId = -1;
        this.ouWorkZones.type = '';

        this.ouWorkZones.getOrganizationUnitWorkZones();
    }
}
