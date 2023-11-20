import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateWorkZoneInput, WorkZoneListDto, WorkZoneServiceProxy, UpdateWorkZoneInput } from '@shared/service-proxies/apis/workzone-service-proxy';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { result } from 'lodash';

export interface IWorkZoneOnEdit {
    id?: number;
    organizationUnitId?: number;
    warehouseId?: number;
    code?: string;
    type?: string;
}

@Component({
    selector: 'addWorkZoneModal',
    templateUrl: './create-or-edit-workzone-modal.component.html'
})
export class CreateOrEditWorkZoneModalComponent extends AppComponentBase {

    @ViewChild('addWorkZoneModal', {static: true}) modal: ModalDirective;
    @ViewChild('workZoneCode', {static: true}) workZoneCodeInput: ElementRef;

    @Output() workZoneCreated: EventEmitter<WorkZoneListDto> = new EventEmitter<WorkZoneListDto>();
    @Output() workZoneUpdated: EventEmitter<WorkZoneListDto> = new EventEmitter<WorkZoneListDto>();

    active = false;
    saving = false;
    isEditing = false;
    hasWarehouseId = false;

    workZone: IWorkZoneOnEdit = {};
    organizationUnitId: number;

    workZoneTypeList: SelectItem[];
    selectedWorkZoneType: string;

    warehouseList: SelectItem[];
    selectedWarehouse: number;
    warehouseValue: string;

    constructor(
        injector: Injector,
        private _workZoneService: WorkZoneServiceProxy,
        private _changeDetector: ChangeDetectorRef
    ) {
        super(injector);
    }

    onShown(): void {
        document.getElementById('workZoneCode').focus();
    }

    show(workZone: IWorkZoneOnEdit, organizationId: number, warehouseCode?: string, warehouseId?: number): void {

        this.workZone = workZone;
        this.organizationUnitId = organizationId;
        this.workZoneTypeList = [];

        if(workZone.type != null && workZone.type != ""){
            this.selectedWorkZoneType = workZone.type
        }
        else{
            this.selectedWorkZoneType = "Store";
        }

        this.workZoneTypeList.push({
            value: "Store",
            label: "Store"
        });

        this.workZoneTypeList.push({
            value: "Supplier",
            label: "Supplier"
        });

        this.workZoneTypeList.push({
            value: "Transporter",
            label: "Transporter"
        });

        this.workZoneTypeList.push({
            value: "Customer",
            label: "Customer"
        });

        this.getWarehouses(warehouseId);

        /*
        if(warehouseId != null){

            this.selectedWarehouse = warehouseId;
            //this.warehouseValue = warehouseCode;
            //this.hasWarehouseId = true;
        }
        else{
            
            //this.hasWarehouseId = false;
        }
        */
        
        this.active = true;
        this.modal.show();
        this._changeDetector.detectChanges();
    }

    save(): void {
        if (!this.workZone.id) {
            this.createUnit();
        } else {
            this.updateUnit();
        }
    }

    getWarehouses(warehouseId?: number): void{

        this._workZoneService.getWarehouses(this.organizationUnitId)
        .subscribe(results => {

            this.warehouseList = [];

            for(let result of results.items){
    
                this.warehouseList.push({
                    value: result.id,
                    label: result.code
                });
            }

            if(this.warehouseList.length > 0){
                
                if(!warehouseId){
                    this.selectedWarehouse = warehouseId
                }
                else{
                    this.selectedWarehouse = this.warehouseList[0].value;
                }
            }
        });
    }

    createUnit(): void {
        const createInput = new CreateWorkZoneInput();
        createInput.organizationUnitId = this.organizationUnitId;
        createInput.warehouseId = this.selectedWarehouse;
        createInput.code = this.workZone.code;
        createInput.type = this.selectedWorkZoneType;

        this.saving = true;
        this._workZoneService
            .createWorkZone(createInput)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.workZoneCreated.emit(null);
            });
    }

    updateUnit(): void {
        const updateInput = new UpdateWorkZoneInput();
        updateInput.id = this.workZone.id;
        updateInput.organizationUnitId = this.organizationUnitId;
        updateInput.warehouseId = this.selectedWarehouse;
        updateInput.code = this.workZone.code;
        updateInput.type = this.selectedWorkZoneType;

        this.saving = true;
        this._workZoneService
            .updateWorkZone(updateInput)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.workZoneUpdated.emit(null);
            });
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }
}
