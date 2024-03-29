import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrganizationUnitInput, OrganizationUnitDto, OrganizationUnitServiceProxy, UpdateOrganizationUnitInput } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';

export interface IOrganizationUnitOnEdit {
    id?: number;
    parentId?: number;
    displayName?: string;
    code?: string;
}

@Component({
    selector: 'createOrEditOrganizationUnitModal',
    templateUrl: './create-or-edit-unit-modal.component.html'
})
export class CreateOrEditUnitModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', {static: true}) modal: ModalDirective;
    @ViewChild('organizationUnitDisplayName', {static: true}) organizationUnitDisplayNameInput: ElementRef;

    @Output() unitCreated: EventEmitter<OrganizationUnitDto> = new EventEmitter<OrganizationUnitDto>();
    @Output() unitUpdated: EventEmitter<OrganizationUnitDto> = new EventEmitter<OrganizationUnitDto>();

    active = false;
    saving = false;
    isEditing = false;

    organizationUnit: IOrganizationUnitOnEdit = {};

    storeTypeList: SelectItem[];
    selectedStoreType: string;

    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy,
        private _changeDetector: ChangeDetectorRef
    ) {
        super(injector);
    }

    onShown(): void {
        document.getElementById('OrganizationUnitDisplayName').focus();
    }

    show(organizationUnit: IOrganizationUnitOnEdit): void {

        this.organizationUnit = organizationUnit;

        this.storeTypeList = [];

        this.selectedStoreType = "Store";

        this.storeTypeList.push({
            value: "Store",
            label: "Store"
        });

        this.storeTypeList.push({
            value: "Warehouse",
            label: "Warehouse"
        });

        this.active = true;
        this.modal.show();
        this._changeDetector.detectChanges();
    }

    save(): void {
        if (!this.organizationUnit.id) {
            this.createUnit();
        } else {
            this.updateUnit();
        }
    }

    createUnit() {
        const createInput = new CreateOrganizationUnitInput();
        createInput.parentId = this.organizationUnit.parentId;
        createInput.displayName = this.organizationUnit.displayName;
        createInput.code = this.organizationUnit.code;
        //createInput.type = this.selectedStoreType;

        this.saving = true;
        this._organizationUnitService
            .createOrganizationUnit(createInput)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: OrganizationUnitDto) => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.unitCreated.emit(result);
            });
    }

    updateUnit() {
        const updateInput = new UpdateOrganizationUnitInput();
        updateInput.id = this.organizationUnit.id;
        updateInput.displayName = this.organizationUnit.displayName;
        updateInput.code = this.organizationUnit.code;
        //updateInput.type = this.selectedStoreType;

        this.saving = true;
        this._organizationUnitService
            .updateOrganizationUnit(updateInput)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: OrganizationUnitDto) => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.unitUpdated.emit(result);
            });
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }
}
