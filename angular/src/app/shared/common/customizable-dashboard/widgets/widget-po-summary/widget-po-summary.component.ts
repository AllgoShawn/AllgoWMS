import { Component, OnInit, Injector } from '@angular/core';
import { DashboardChartBase } from '../dashboard-chart-base';
import { TenantDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { WidgetComponentBase } from '../widget-component-base';
import { Router, ActivatedRoute } from '@angular/router';

class POSummaryTable extends DashboardChartBase {
    poSummary: Array<any>;
    totalOpenPO = 0;

    constructor(private _dashboardService: TenantDashboardServiceProxy) {
        super();
    }

    init() {
        this.loadPOSummary();
    }

    loadPOSummary() {
        this._dashboardService.getPOSummary().subscribe(result => {
            this.poSummary = result.poSummary;
            this.formData(this.poSummary);
            this.hideLoading();
        })
    }

    formData(PoSummary: Array<any>) {
        this.totalOpenPO = PoSummary[0].totalOpenPO;
        console.log("va totalopenpo = "+ this.totalOpenPO);
        console.log("posummary = "+ PoSummary[0].totalOpenPO);
    }
}

@Component({
    selector: 'app-widget-po-summary',
    templateUrl: './widget-po-summary.component.html',
    styleUrls: ['./widget-po-summary.component.css']
})

export class WidgetPOSummary extends WidgetComponentBase implements OnInit {
    
    poSummaryTable: POSummaryTable;

    constructor(injector: Injector,
        private _dashboardService: TenantDashboardServiceProxy
    ) {
        super(injector);
        this.poSummaryTable = new POSummaryTable(this._dashboardService);
        }

    ngOnInit(): void {
        this.poSummaryTable.init();
    }

    
}