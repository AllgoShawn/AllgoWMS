import { AfterViewInit, Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateWarehouseMasterComponent } from './create-warehouse-master.component';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { SelectItem } from 'primeng/api';
import { WarehouseServiceProxy } from '@shared/service-proxies/apis/warehouse-service-proxy';
import { CommonLookupServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: './warehouse-master.component.html',
    styleUrls: ['./warehouse-master.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class WarehouseMasterComponent extends AppComponentBase {
    
    @ViewChild('createWarehouseMaster', { static: true }) createWarehouseMaster: CreateWarehouseMasterComponent;

    statusType: SelectItem[] = [];

    source = "t_warehouse";
    lookup_type = "STATUS"


    constructor(
        injector: Injector,
        private _commonLookupService: CommonLookupServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }
    
    ngOnInit(): void {
        this.getLookup();
    }

    createWarehouse() {
        this.createWarehouseMaster.show();
    }

    getLookup() {
        this._commonLookupService.getLookup(this.source,this.lookup_type).subscribe(
            dropDownResults => {
                let itemNames: SelectItem[] = [];

                itemNames.push({
                    value: null,
                    label: "-- Please Select --" 
                });
                
                for(let result of dropDownResults.items){

                    itemNames.push({
                        value: result.value,
                        label: result.name
                    });
                }
                
                this.statusType = itemNames;
            }
        )

    }

    nodeSelect() {
        
        if(event)
        this._router.navigate(['app/admin/warehouse-detail'])
    }
}