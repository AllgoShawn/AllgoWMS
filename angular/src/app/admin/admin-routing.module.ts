import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { HostDashboardComponent } from './dashboard/host-dashboard.component';
import { DemoUiComponentsComponent } from './demo-ui-components/demo-ui-components.component';
import { EditionsComponent } from './editions/editions.component';
import { InstallComponent } from './install/install.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { LanguagesComponent } from './languages/languages.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { RolesComponent } from './roles/roles.component';
import { HostSettingsComponent } from './settings/host-settings.component';
import { TenantSettingsComponent } from './settings/tenant-settings.component';
import { InvoiceComponent } from './subscription-management/invoice/invoice.component';
import { SubscriptionManagementComponent } from './subscription-management/subscription-management.component';
import { TenantsComponent } from './tenants/tenants.component';
import { UiCustomizationComponent } from './ui-customization/ui-customization.component';
import { UsersComponent } from './users/users.component';

//Octopus Component
import { POMasterComponent } from './po/pomaster.component';
import { PODetailComponent } from './po/podetail.component';
import { ASNMasterComponent } from './asn/asnmaster.component';
import { ASNCaseComponent } from './asn/asncase.component';
import { ASNDetailComponent } from './asn/asndetail.component';
import { ASNLookupComponent } from './asn/asnlookup.component';
import { InventoryMasterComponent } from './inventory/inventory-master.component';
import { InventoryBySkuMasterComponent } from './inventory/inventory-master-sku.component';
import { TransferOrderMasterComponent } from './transfer-order/transfer-order-master.component';
import { TransferOrderDetailComponent } from './transfer-order/transfer-order-detail.component';
import { WarehouseMasterComponent } from './warehouse/warehouse-master.component';
import { WarehouseDetailsComponent} from './warehouse/warehouse-detail.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Administration.Users' } },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Administration.Roles' } },
                    { path: 'auditLogs', component: AuditLogsComponent, data: { permission: 'Pages.Administration.AuditLogs' } },
                    { path: 'maintenance', component: MaintenanceComponent, data: { permission: 'Pages.Administration.Host.Maintenance' } },
                    { path: 'hostSettings', component: HostSettingsComponent, data: { permission: 'Pages.Administration.Host.Settings' } },
                    { path: 'editions', component: EditionsComponent, data: { permission: 'Pages.Editions' } },
                    { path: 'languages', component: LanguagesComponent, data: { permission: 'Pages.Administration.Languages' } },
                    { path: 'languages/:name/texts', component: LanguageTextsComponent, data: { permission: 'Pages.Administration.Languages.ChangeTexts' } },
                    { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' } },
                    { path: 'organization-units', component: OrganizationUnitsComponent, data: { permission: 'Pages.Administration.OrganizationUnits' } },
                    { path: 'subscription-management', component: SubscriptionManagementComponent, data: { permission: 'Pages.Administration.Tenant.SubscriptionManagement' } },
                    { path: 'invoice/:paymentId', component: InvoiceComponent, data: { permission: 'Pages.Administration.Tenant.SubscriptionManagement' } },
                    { path: 'tenantSettings', component: TenantSettingsComponent, data: { permission: 'Pages.Administration.Tenant.Settings' } },
                    { path: 'hostDashboard', component: HostDashboardComponent, data: { permission: 'Pages.Administration.Host.Dashboard' } },
                    { path: 'demo-ui-components', component: DemoUiComponentsComponent, data: { permission: 'Pages.DemoUiComponents' } },
                    { path: 'install', component: InstallComponent },
                    { path: 'ui-customization', component: UiCustomizationComponent },
                    //{ path: '', redirectTo: 'hostDashboard', pathMatch: 'full' },

                    //Octopus Path
                    { path: 'po', component: POMasterComponent },   
                    { path: 'podetail', component: PODetailComponent },   

                    { path: 'asn', component: ASNMasterComponent },   
                    { path: 'asncase', component: ASNCaseComponent },  
                    { path: 'asndetail', component: ASNDetailComponent },  
                    { path: 'asnlookup', component: ASNLookupComponent },  

                    { path: 'inventory', component: InventoryMasterComponent }, 
                    { path: 'inventory-sku', component: InventoryBySkuMasterComponent }, 
                    
                    { path: 'transfer-order', component: TransferOrderMasterComponent }, 
                    { path: 'transfer-order-detail', component: TransferOrderDetailComponent }, 

                    { path: 'warehouse', component: WarehouseMasterComponent }, 
                    { path: 'warehouse-detail', component:WarehouseDetailsComponent},
                    
                    { path: '', redirectTo: 'po', pathMatch: 'full' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AdminRoutingModule {

    constructor(
        private router: Router
    ) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scroll(0, 0);
            }
        });
    }
}
