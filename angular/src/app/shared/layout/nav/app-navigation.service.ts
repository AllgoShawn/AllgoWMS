import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { AppSessionService } from '@shared/common/session/app-session.service';

import { Injectable } from '@angular/core';
import { AppMenu } from './app-menu';
import { AppMenuItem } from './app-menu-item';

@Injectable()
export class AppNavigationService {

    constructor(
        private _permissionCheckerService: PermissionCheckerService,
        private _appSessionService: AppSessionService
    ) {

    }

    getMenu(): AppMenu {
        return new AppMenu('MainMenu', 'MainMenu', [
            // new AppMenuItem('Dashboard', 'Pages.Administration.Host.Dashboard', 'flaticon-line-graph', '/app/admin/hostDashboard'),
            new AppMenuItem('Dashboard', 'Pages.Tenant.Dashboard', null, '/app/main/dashboard'),
            new AppMenuItem('Tenants', 'Pages.Tenants', null, '/app/admin/tenants'), //'flaticon-list-3'
             new AppMenuItem('Editions', 'Pages.Editions', null, '/app/admin/editions'), //'flaticon-app'
            new AppMenuItem('Administration', '', null, '', [ //'flaticon-interface-8'
                new AppMenuItem('Organizations', 'Pages.Administration.OrganizationUnits', null, '/app/admin/organization-units'), //'flaticon-map'
                new AppMenuItem('Roles', 'Pages.Administration.Roles', null, '/app/admin/roles'), //'flaticon-suitcase'
                new AppMenuItem('Users', 'Pages.Administration.Users', null, '/app/admin/users'), //'flaticon-users'
                //new AppMenuItem('Languages', 'Pages.Administration.Languages', 'flaticon-tabs', '/app/admin/languages'),
                new AppMenuItem('AuditLogs', 'Pages.Administration.AuditLogs', null, '/app/admin/auditLogs'), //'flaticon-folder-1'
                new AppMenuItem('Maintenance', 'Pages.Administration.Host.Maintenance', null, '/app/admin/maintenance'), //'flaticon-lock'
                new AppMenuItem('Subscription', 'Pages.Administration.Tenant.SubscriptionManagement', null, '/app/admin/subscription-management'), //'flaticon-refresh'
                new AppMenuItem('VisualSettings', 'Pages.Administration.UiCustomization', null, '/app/admin/ui-customization'), //'flaticon-medical'
                new AppMenuItem('Settings', 'Pages.Administration.Host.Settings', null, '/app/admin/hostSettings'), //'flaticon-settings'
                new AppMenuItem('Settings', 'Pages.Administration.Tenant.Settings', null, '/app/admin/tenantSettings') //'flaticon-settings'
            ]),

            new AppMenuItem('PO Master', null, null, '/app/admin/po'),

            new AppMenuItem('ASN Management', '', null, '', [
                new AppMenuItem('ASN Master', null, null, '/app/admin/asn'),
                new AppMenuItem('Number Format', null, null, '/app/admin/asnlookup')
            ]),
            
            new AppMenuItem('Transfer Order', null, null, '/app/admin/transfer-order'),

            new AppMenuItem('Reporting', '', null, '', [
                new AppMenuItem('Inventory Report', null, null, '/app/admin/inventory')
            ]),

            new AppMenuItem('Warehouse Master', null, null, '/app/admin/warehouse'),
            
            //new AppMenuItem('DemoUiComponents', 'Pages.DemoUiComponents', 'flaticon-shapes', '/app/admin/demo-ui-components')
        ]);
    }   

    checkChildMenuItemPermission(menuItem): boolean {

        for (let i = 0; i < menuItem.items.length; i++) {
            let subMenuItem = menuItem.items[i];

            if (subMenuItem.permissionName === '' || subMenuItem.permissionName === null || subMenuItem.permissionName && this._permissionCheckerService.isGranted(subMenuItem.permissionName)) {
                return true;
            } else if (subMenuItem.items && subMenuItem.items.length) {
                return this.checkChildMenuItemPermission(subMenuItem);
            }
        }

        return false;
    }

    showMenuItem(menuItem: AppMenuItem): boolean {
        if (menuItem.permissionName === 'Pages.Administration.Tenant.SubscriptionManagement' && this._appSessionService.tenant && !this._appSessionService.tenant.edition) {
            return false;
        }

        let hideMenuItem = false;

        if (menuItem.requiresAuthentication && !this._appSessionService.user) {
            hideMenuItem = true;
        }

        if (menuItem.permissionName && !this._permissionCheckerService.isGranted(menuItem.permissionName)) {
            hideMenuItem = true;
        }

        if (this._appSessionService.tenant || !abp.multiTenancy.ignoreFeatureCheckForHostUsers) {
            if (menuItem.hasFeatureDependency() && !menuItem.featureDependencySatisfied()) {
                hideMenuItem = true;
            }
        }

        if (!hideMenuItem && menuItem.items && menuItem.items.length) {
            return this.checkChildMenuItemPermission(menuItem);
        }

        return !hideMenuItem;
    }

    /**
     * Returns all menu items recursively
     */
    getAllMenuItems(): AppMenuItem[] {
        let menu = this.getMenu();
        let allMenuItems: AppMenuItem[] = [];
        menu.items.forEach(menuItem => {
            allMenuItems = allMenuItems.concat(this.getAllMenuItemsRecursive(menuItem));
        });

        return allMenuItems;
    }

    private getAllMenuItemsRecursive(menuItem: AppMenuItem): AppMenuItem[] {
        if (!menuItem.items) {
            return [menuItem];
        }

        let menuItems = [menuItem];
        menuItem.items.forEach(subMenu => {
            menuItems = menuItems.concat(this.getAllMenuItemsRecursive(subMenu));
        });

        return menuItems;
    }
}
