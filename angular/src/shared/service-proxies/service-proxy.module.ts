import { AbpHttpInterceptor, RefreshTokenService } from '@abp/abpHttpInterceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import * as ApiServiceProxies from './service-proxies';
import { ZeroRefreshTokenService } from '@account/auth/zero-refresh-token.service';
import * as OrganizationUnitCustomApiServiceProxies from './apis/organization-service-proxy';
import * as WarehouseApiServiceProxies from './apis/warehouse-service-proxy';
import * as WorkZoneApiServiceProxies from './apis/workzone-service-proxy';
import * as POApiServiceProxies from './apis/po-service-proxy';
import * as ASNApiServiceProxies from './apis/asn-service-proxy';
import * as InventoryApiServiceProxies from './apis/inventory-service-proxy';
import * as TransferOrderApiServiceProxies from './apis/transfer-order-service-proxy';

@NgModule({
    providers: [      
        ApiServiceProxies.AuditLogServiceProxy,
        ApiServiceProxies.CachingServiceProxy,
        ApiServiceProxies.ChatServiceProxy,
        ApiServiceProxies.CommonLookupServiceProxy,
        ApiServiceProxies.EditionServiceProxy,
        ApiServiceProxies.FriendshipServiceProxy,
        ApiServiceProxies.HostSettingsServiceProxy,
        ApiServiceProxies.InstallServiceProxy,
        ApiServiceProxies.LanguageServiceProxy,
        ApiServiceProxies.NotificationServiceProxy,
        ApiServiceProxies.OrganizationUnitServiceProxy,
        ApiServiceProxies.PermissionServiceProxy,
        ApiServiceProxies.ProfileServiceProxy,
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.TenantServiceProxy,
        ApiServiceProxies.TenantDashboardServiceProxy,
        ApiServiceProxies.TenantSettingsServiceProxy,
        ApiServiceProxies.TimingServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.UserLinkServiceProxy,
        ApiServiceProxies.UserLoginServiceProxy,
        ApiServiceProxies.WebLogServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.TenantRegistrationServiceProxy,
        ApiServiceProxies.HostDashboardServiceProxy,
        ApiServiceProxies.PaymentServiceProxy,
        ApiServiceProxies.DemoUiComponentsServiceProxy,
        ApiServiceProxies.InvoiceServiceProxy,
        ApiServiceProxies.SubscriptionServiceProxy,
        ApiServiceProxies.InstallServiceProxy,
        ApiServiceProxies.UiCustomizationSettingsServiceProxy,
        ApiServiceProxies.PayPalPaymentServiceProxy,
        ApiServiceProxies.StripePaymentServiceProxy,
        ApiServiceProxies.DashboardCustomizationServiceProxy,
        ApiServiceProxies.ItemServiceProxy,
        ApiServiceProxies.ReportServiceProxy,

        //Octopus Service Proxies
        OrganizationUnitCustomApiServiceProxies.OrganizationUnitCustomServiceProxy,
        WarehouseApiServiceProxies.WarehouseServiceProxy,
        WorkZoneApiServiceProxies.WorkZoneServiceProxy,
        POApiServiceProxies.POServiceProxy,
        ASNApiServiceProxies.ASNServiceProxy,
        InventoryApiServiceProxies.InventoryServiceProxy,
        TransferOrderApiServiceProxies.TransferOrderServiceProxy,
        ApiServiceProxies.CustomLookupServiceProxy,

        { provide: RefreshTokenService, useClass: ZeroRefreshTokenService },
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class ServiceProxyModule { }
