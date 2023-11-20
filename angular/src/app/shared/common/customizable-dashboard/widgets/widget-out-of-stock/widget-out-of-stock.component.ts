import { Component, OnInit, Injector } from '@angular/core';
import { DashboardChartBase } from '../dashboard-chart-base';
import { TenantDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { WidgetComponentBase } from '../widget-component-base';
import { Router, ActivatedRoute } from '@angular/router';

class OutofStockTable extends DashboardChartBase {
  stats: Array<any>;
  
  constructor(private _dashboardService: TenantDashboardServiceProxy) {
    super();
  }

  init() {
    this.reload();
  }

  formatData(): any {
    if (this.stats) {
      for (let j = 0; j < this.stats.length; j++) {
        let stat = this.stats[j];
  
        let series = [];
        if (stat.change) {
          for (let i = 0; i < stat.change.length; i++) {
            series.push({
              name: i + 1,
              value: stat.change[i]
            });
          }
        }
  
        stat.changeData = [
          {
            'name': j + 1,
            'series': series
          }
        ];
      }
    }

  }

  reload() {
    this.showLoading();
    this._dashboardService
      .getOutOfStock()
      .subscribe(result => {
        this.stats = result.stats;
        this.formatData();
        this.hideLoading();
      });
  }
}

@Component({
  selector: 'app-widget-regional-stats',
  templateUrl: './widget-out-of-stock.component.html',
  styleUrls: ['./widget-out-of-stock.component.css']
})
export class WidgetOutOfStockComponent extends WidgetComponentBase implements OnInit {

    outofStockTable: OutofStockTable;

  constructor(
    injector: Injector,
    private _dashboardService: TenantDashboardServiceProxy,
    private _router: Router
  ) {
    super(injector);
    this.outofStockTable = new OutofStockTable(this._dashboardService);
  }

  ngOnInit() {
    this.outofStockTable.init();
  }

  navigateToInventory(): void{
    this._router.navigate(['app/admin/inventory']);
  }
}
