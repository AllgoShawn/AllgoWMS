import { OnInit, Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HtmlHelper } from '@shared/helpers/HtmlHelper';
import { ListResultDtoOfOrganizationUnitDto, MoveOrganizationUnitInput, OrganizationUnitDto,  OrganizationUnitServiceProxy } from '@shared/service-proxies/service-proxies';
import { PagedResultDtoOfOrganizationUnitListDto,  OrganizationUnitCustomServiceProxy } from '@shared/service-proxies/apis/organization-service-proxy';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';
import { CreateOrEditUnitModalComponent } from './create-or-edit-unit-modal.component';
import { IUserWithOrganizationUnit } from './user-with-organization-unit';
import { IUsersWithOrganizationUnit } from './users-with-organization-unit';
import { IRoleWithOrganizationUnit } from './role-with-organization-unit';
import { IRolesWithOrganizationUnit } from './roles-with-organization-unit';
import { finalize } from 'rxjs/operators';

import { TreeNode, MenuItem } from 'primeng/api';

import { ArrayToTreeConverterService } from '@shared/utils/array-to-tree-converter.service';
import { TreeDataHelperService } from '@shared/utils/tree-data-helper.service';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';

@Component({
    selector: 'organization-list',
    templateUrl: './organization-list.component.html'
})
export class OrganizationListComponent extends AppComponentBase implements OnInit {

    @Output() ouSelected: EventEmitter<IBasicOrganizationUnitInfo> = new EventEmitter<IBasicOrganizationUnitInfo>();

    @ViewChild('createOrEditOrganizationUnitModal', { static: true }) createOrEditOrganizationUnitModal: CreateOrEditUnitModalComponent;
    @ViewChild('entityTypeHistoryModal', { static: true }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;

    @ViewChild('dataTable', {static: true}) dataTable: Table;
    @ViewChild('paginator', {static: true}) paginator: Paginator;

    treeData: any;
    selectedOu: OrganizationUnitDto;
    ouContextMenuItems: MenuItem[];
    canManageOrganizationUnits = false;

    filterText: string;

    _entityTypeFullName = 'Abp.Organizations.OrganizationUnit';

    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy,
        private _organizationUnitCustomService: OrganizationUnitCustomServiceProxy
    ) {
        super(injector);
    }

    totalUnitCount = 0;

    ngOnInit(): void {
    }

    reload(): void {
        this.canManageOrganizationUnits = this.isGranted('Pages.Administration.OrganizationUnits.ManageOrganizationTree');
        this.getOrganizationUnits();
    }

    getOrganizationUnits(workZone?: string, event?: LazyLoadEvent) {
        

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();
        this._organizationUnitCustomService.getOrganizationUnits(
            workZone,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.totalRecordsCount = result.totalCount;

            //this.primengTableHelper.records
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    private isEntityHistoryEnabled(): boolean {
        let customSettings = (abp as any).custom;
        return customSettings.EntityHistory && customSettings.EntityHistory.isEnabled && _.filter(customSettings.EntityHistory.enabledEntities, entityType => entityType === this._entityTypeFullName).length === 1;
    }

    nodeSelect(event) {

        this.ouSelected.emit(<IBasicOrganizationUnitInfo>{
            id: event.data.id,
            displayName: event.data.displayName,
            type: event.data.type
        });
    }

    addUnit(): void {
        this.createOrEditOrganizationUnitModal.show({});
    }

    editUnit(selectedOu: OrganizationUnitDto): void{
        
        this.createOrEditOrganizationUnitModal.show({
            id: selectedOu.id,
            displayName: selectedOu.displayName,
            code: selectedOu.code
        });
    }

    deleteUnit(selectedOu: OrganizationUnitDto): void{

        this.message.confirm(
            this.l('WorkzoneDeleteWarningMessage', selectedOu.displayName),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this._organizationUnitService.deleteOrganizationUnit(selectedOu.id).subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.selectedOu = null;
                        this.reload();
                    });
                }
            }
        );
    }

    unitCreated(): void {
        this.reload();
    }

    unitUpdated(): void {
        this.reload();
    }

    /*

    membersAdded(data: IUsersWithOrganizationUnit): void {
        this.incrementMemberCount(data.ouId, data.userIds.length);
    }

    memberRemoved(data: IUserWithOrganizationUnit): void {
        this.incrementMemberCount(data.ouId, -1);
    }

    incrementMemberCount(ouId: number, incrementAmount: number): void {
        this.reload();
    }

    */
}