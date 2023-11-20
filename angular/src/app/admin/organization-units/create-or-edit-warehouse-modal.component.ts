import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateWarehouseInput, WarehouseListDto, WarehouseServiceProxy, UpdateWarehouseInput } from '@shared/service-proxies/apis/warehouse-service-proxy';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';

export interface IWarehouseOnEdit {
    id?: number;
    organizationUnitId?: number;
    code?: string;
}

@Component({
    selector: 'addWarehouseModal',
    templateUrl: './create-or-edit-warehouse-modal.component.html'
})
export class CreateOrEditWarehouseModalComponent extends AppComponentBase {

    @ViewChild('addWarehouseModal', {static: true}) modal: ModalDirective;
    @ViewChild('warehouseCode', {static: true}) warehouseCodeInput: ElementRef;

    @Output() warehouseCreated: EventEmitter<WarehouseListDto> = new EventEmitter<WarehouseListDto>();
    @Output() warehouseUpdated: EventEmitter<WarehouseListDto> = new EventEmitter<WarehouseListDto>();

    active = false;
    saving = false;
    isEditing = false;

    warehouse: IWarehouseOnEdit = {};
    organizationUnitId: number;

    constructor(
        injector: Injector,
        private _warehouseService: WarehouseServiceProxy,
        private _changeDetector: ChangeDetectorRef
    ) {
        super(injector);
    }

    onShown(): void {
        document.getElementById('warehouseCode').focus();
    }

    show(warehouse: IWarehouseOnEdit, organizationId: number): void {

        this.warehouse = warehouse;
        this.organizationUnitId = organizationId;
        
        this.active = true;
        this.modal.show();
        this._changeDetector.detectChanges();
    }

    save(): void {
        if (!this.warehouse.id) {
            this.createUnit();
        } else {
            this.updateUnit();
        }
    }

    createUnit() {
        const createInput = new CreateWarehouseInput();
        createInput.organizationUnitId = this.organizationUnitId;
        createInput.code = this.warehouse.code;

        this.saving = true;
        this._warehouseService
            .createWarehouse(createInput)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.warehouseCreated.emit(null);
            });
    }

    updateUnit() {
        const updateInput = new UpdateWarehouseInput();
        updateInput.id = this.warehouse.id;
        updateInput.organizationUnitId = this.organizationUnitId;
        updateInput.code = this.warehouse.code;

        this.saving = true;
        this._warehouseService
            .updateWarehouse(updateInput)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.warehouseUpdated.emit(null);
            });
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }
}
