import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import {  NameValueDto } from '@shared/service-proxies/service-proxies';
import { WorkZoneServiceProxy, FindWorkZoneUsersInput,UsersToWorkZoneInput } from '@shared/service-proxies/apis/workzone-service-proxy';
import * as _ from 'lodash';
import { ModalDirective } from 'ngx-bootstrap';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'addMemberToWorkZoneModal',
    templateUrl: './add-member-to-workzone-modal.component.html'
})
export class AddMemberToWorkZoneModalComponent extends AppComponentBase {

    workZoneId: number;
    type: string | undefined;

    @Output() membersAdded: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('modal', {static: true}) modal: ModalDirective;
    @ViewChild('dataTable', {static: true}) dataTable: Table;
    @ViewChild('paginator', {static: true}) paginator: Paginator;

    isShown = false;
    filterText = '';
    tenantId?: number;
    saving = false;
    selectedMembers: NameValueDto[];

    constructor(
        injector: Injector,
        private _workZoneService: WorkZoneServiceProxy
    ) {
        super(injector);
    }

    show(workZoneId?: number, type?: string): void {

        this.workZoneId = workZoneId;
        this.type = type;
        this.modal.show();
    }

    refreshTable(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    close(): void {
        this.modal.hide();
    }

    shown(): void {
        this.isShown = true;
        this.getRecordsIfNeeds(null);
    }

    getRecordsIfNeeds(event: LazyLoadEvent): void {
        if (!this.isShown) {
            return;
        }

        this.getRecords(event);
    }

    getRecords(event?: LazyLoadEvent): void {

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        const input = new FindWorkZoneUsersInput();
        input.workZoneId = this.workZoneId;
        input.type = this.type;
        input.filter = this.filterText;
        input.skipCount = this.primengTableHelper.getSkipCount(this.paginator, event);
        input.maxResultCount = this.primengTableHelper.getMaxResultCount(this.paginator, event);

        this._workZoneService
            .findSelectedUsers(input)
            .subscribe(result => {
                
                this.selectedMembers = result.items;

                this._workZoneService
                    .findUsers(input)
                    .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
                    .subscribe(result => {
                        this.primengTableHelper.totalRecordsCount = result.totalCount;
                        this.primengTableHelper.records = result.items;
                        this.primengTableHelper.hideLoadingIndicator();
                    });
            });
    }

    addUsersToWorkZone(): void {
        const input = new UsersToWorkZoneInput();
        input.workZoneId = this.workZoneId;
        input.userIds = _.map(this.selectedMembers, selectedMember => Number(selectedMember.value));
        this.saving = true;
        this._workZoneService
            .addUsersToWorkZone(input)
            .subscribe(() => {
                this.notify.success(this.l('SuccessfullyAdded'));
                this.membersAdded.emit();
                this.saving = false;
                this.close();
                this.selectedMembers = [];
            });
    }
}
