import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { SelectItem } from 'primeng/api';
import { PrimengTableHelper } from 'shared/helpers/PrimengTableHelper';

import { PagedResultDtoOfASNListDto, GetASNMasterInput,  ASNServiceProxy } from '@shared/service-proxies/apis/asn-service-proxy';

import { CreateASNModalComponent } from './create-asn-modal.component';

@Component({
    templateUrl: './asnmaster.component.html',
    styleUrls: ['./asnmaster.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ASNMasterComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createASNModal', { static: true }) createASNModal: CreateASNModalComponent;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    //Filters
    public dateRange: moment.Moment[] = [moment().startOf('day'), moment().endOf('day')];

    public filterText: string = '';
    public asnFilter: string = '';
    public poFilter: string = '';
    public customerFilter: string = '';
    public warehouseFilter: string = '';
    public statusFilter: string = '';
    public dateFilter?: moment.Moment[];

    statusTypes: SelectItem[] = [];

    primengTableHelper = new PrimengTableHelper();
    advancedFiltersAreShown = false;

    constructor(
        injector: Injector,
        private _asnService: ASNServiceProxy,
        private _router: Router,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    ngOnInit(): void{

        this.getStatusTypes();
    }

    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }
    
    getStatusTypes(): void{

        this.statusTypes = [];

        this.statusTypes.push({
            value: '',
            label: "All" 
        });
        
        this.statusTypes.push({
            value: "N",
            label: "Pending" 
        });
        
        this.statusTypes.push({
            value: "S",
            label: "Shipped" 
        });
    }

    getASNDatas(event?: LazyLoadEvent) {
        
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        let startTime: string;
        let endTime: string;

        if(this.dateFilter != null){

            startTime = this.dateFilter[0].format('YYYY-MM-DD HH:mm:ss').toString();
            endTime = this.dateFilter[1].format('YYYY-MM-DD HH:mm:ss').toString();
        }

        this._asnService.getASNMasters(
            this.filterText,
            this.poFilter,
            this.asnFilter,
            this.customerFilter,
            this.warehouseFilter,
            this.statusFilter,
            startTime,
            endTime,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).subscribe((result) => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    exportToExcel(): void {
        const self = this;
        /*
        self._transportService.getTransports(
            this.filter,
            undefined,
            1,
            0)
            .subscribe(result => {
                self._fileDownloadService.downloadTempFile(result);
            });
        */
    }

    nodeSelect(event) {

        if(event.data.id){

            this._router.navigate(['app/admin/asncase'],
            { queryParams: {id:event.data.id}});
        }
        else{
            
            this.notify.error("Id not found. Please check the SQL query.")
        }
    }

    createASN(poNo?: string, itemId?: number){

        this.createASNModal.show(poNo, itemId);
    }

    deleteASN(asnNo?: string, itemId?: number){

        this.message.confirm(
            this.l('Confirmation to delete this ASN Number : ' + asnNo),
            this.l('Are you confirm?'),
            (isConfirmed) => {
                if (isConfirmed) {

                    let asnDataInput: GetASNMasterInput = new GetASNMasterInput();
                    asnDataInput.id = itemId;

                    this._asnService.deleteASN(asnDataInput)
                        .subscribe(() => {
                            this.refreshData();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    shipASN(asnNo?: string, itemId?: number){

        this.message.confirm(
            this.l('Confirmation to ship this ASN Number : ' + asnNo),
            this.l('Are you confirm?'),
            (isConfirmed) => {
                if (isConfirmed) {

                    this._asnService.getShippingValidationById(itemId)
                    .subscribe((result) => {

                        if(result.udf01 == "1"){

                            let asnDataInput: GetASNMasterInput = new GetASNMasterInput();
                            asnDataInput.id = itemId;
        
                            this._asnService.shipASN(asnDataInput)
                                .subscribe(() => {
                                    this.refreshData();
                                    this.notify.success(this.l('SuccessfullyShipped'));
                                });
                        }
                        else{
                            this.notify.warn(result.udf01);
                        }
                    });
                }
            }
        );
    }

    refreshData(): void{

        this.getASNDatas();
    }

    truncateStringWithPostfix(text: string, length: number): string {
        return abp.utils.truncateStringWithPostfix(text, length);
    }
}
