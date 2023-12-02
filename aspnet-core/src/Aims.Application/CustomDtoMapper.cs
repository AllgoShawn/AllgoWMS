using Abp.Application.Editions;
using Abp.Application.Features;
using Abp.Auditing;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.EntityHistory;
using Abp.Localization;
using Abp.Notifications;
using Abp.Organizations;
using Abp.UI.Inputs;
using AutoMapper;
using Aims.Auditing.Dto;
using Aims.Authorization.Accounts.Dto;
using Aims.Authorization.Permissions.Dto;
using Aims.Authorization.Roles;
using Aims.Authorization.Roles.Dto;
using Aims.Authorization.Users;
using Aims.Authorization.Users.Dto;
using Aims.Authorization.Users.Importing.Dto;
using Aims.Authorization.Users.Profile.Dto;
using Aims.Chat;
using Aims.Chat.Dto;
using Aims.Editions;
using Aims.Editions.Dto;
using Aims.Friendships;
using Aims.Friendships.Cache;
using Aims.Friendships.Dto;
using Aims.Localization.Dto;
using Aims.MultiTenancy;
using Aims.MultiTenancy.Dto;
using Aims.MultiTenancy.HostDashboard.Dto;
using Aims.MultiTenancy.Payments;
using Aims.MultiTenancy.Payments.Dto;
using Aims.Notifications.Dto;
using Aims.Organizations.Dto;
using Aims.Sessions.Dto;
using Aims.Dto;
using Aims.OrganizationUnits;
using Aims.PO;
using Aims.ASN;
using Aims.Warehouses;
using Aims.Warehouses.Dto;
using Aims.WorkZones;
using Aims.WorkZones.Dto;
using Aims.Inventories;
using Aims.TransferOrders;

namespace Aims
{
    internal static class CustomDtoMapper
    {
        public static void CreateMappings(IMapperConfigurationExpression configuration)
        {
            //Inputs
            configuration.CreateMap<CheckboxInputType, FeatureInputTypeDto>();
            configuration.CreateMap<SingleLineStringInputType, FeatureInputTypeDto>();
            configuration.CreateMap<ComboboxInputType, FeatureInputTypeDto>();
            configuration.CreateMap<IInputType, FeatureInputTypeDto>()
                .Include<CheckboxInputType, FeatureInputTypeDto>()
                .Include<SingleLineStringInputType, FeatureInputTypeDto>()
                .Include<ComboboxInputType, FeatureInputTypeDto>();
            configuration.CreateMap<StaticLocalizableComboboxItemSource, LocalizableComboboxItemSourceDto>();
            configuration.CreateMap<ILocalizableComboboxItemSource, LocalizableComboboxItemSourceDto>()
                .Include<StaticLocalizableComboboxItemSource, LocalizableComboboxItemSourceDto>();
            configuration.CreateMap<LocalizableComboboxItem, LocalizableComboboxItemDto>();
            configuration.CreateMap<ILocalizableComboboxItem, LocalizableComboboxItemDto>()
                .Include<LocalizableComboboxItem, LocalizableComboboxItemDto>();

            //Chat
            configuration.CreateMap<ChatMessage, ChatMessageDto>();
            configuration.CreateMap<ChatMessage, ChatMessageExportDto>();

            //Feature
            configuration.CreateMap<FlatFeatureSelectDto, Feature>().ReverseMap();
            configuration.CreateMap<Feature, FlatFeatureDto>();

            //Role
            configuration.CreateMap<RoleEditDto, Role>().ReverseMap();
            configuration.CreateMap<Role, RoleListDto>();
            configuration.CreateMap<UserRole, UserListRoleDto>();

            //Edition
            configuration.CreateMap<EditionEditDto, SubscribableEdition>().ReverseMap();
            configuration.CreateMap<EditionCreateDto, SubscribableEdition>();
            configuration.CreateMap<EditionSelectDto, SubscribableEdition>().ReverseMap();
            configuration.CreateMap<SubscribableEdition, EditionInfoDto>();

            configuration.CreateMap<Edition, EditionInfoDto>().Include<SubscribableEdition, EditionInfoDto>();

            configuration.CreateMap<SubscribableEdition, EditionListDto>();
            configuration.CreateMap<Edition, EditionEditDto>();
            configuration.CreateMap<Edition, SubscribableEdition>();
            configuration.CreateMap<Edition, EditionSelectDto>();

            //Payment
            configuration.CreateMap<SubscriptionPaymentDto, SubscriptionPayment>().ReverseMap();
            configuration.CreateMap<SubscriptionPaymentListDto, SubscriptionPayment>().ReverseMap();
            configuration.CreateMap<SubscriptionPayment, SubscriptionPaymentInfoDto>();

            //Permission
            configuration.CreateMap<Permission, FlatPermissionDto>();
            configuration.CreateMap<Permission, FlatPermissionWithLevelDto>();

            //Language
            configuration.CreateMap<ApplicationLanguage, ApplicationLanguageEditDto>();
            configuration.CreateMap<ApplicationLanguage, ApplicationLanguageListDto>();
            configuration.CreateMap<NotificationDefinition, NotificationSubscriptionWithDisplayNameDto>();
            configuration.CreateMap<ApplicationLanguage, ApplicationLanguageEditDto>()
                .ForMember(ldto => ldto.IsEnabled, options => options.MapFrom(l => !l.IsDisabled));

            //Tenant
            configuration.CreateMap<Tenant, RecentTenant>();
            configuration.CreateMap<Tenant, TenantLoginInfoDto>();
            configuration.CreateMap<Tenant, TenantListDto>();
            configuration.CreateMap<TenantEditDto, Tenant>().ReverseMap();
            configuration.CreateMap<CurrentTenantInfoDto, Tenant>().ReverseMap();

            //User
            configuration.CreateMap<User, UserEditDto>()
                .ForMember(dto => dto.Password, options => options.Ignore())
                .ReverseMap()
                .ForMember(user => user.Password, options => options.Ignore());
            configuration.CreateMap<User, UserLoginInfoDto>();
            configuration.CreateMap<User, UserListDto>();
            configuration.CreateMap<User, ChatUserDto>();
            configuration.CreateMap<User, OrganizationUnitUserListDto>();
            configuration.CreateMap<Role, OrganizationUnitRoleListDto>();
            configuration.CreateMap<CurrentUserProfileEditDto, User>().ReverseMap();
            configuration.CreateMap<UserLoginAttemptDto, UserLoginAttempt>().ReverseMap();
            configuration.CreateMap<ImportUserDto, User>();

            //AuditLog
            configuration.CreateMap<AuditLog, AuditLogListDto>();
            configuration.CreateMap<EntityChange, EntityChangeListDto>();
            configuration.CreateMap<EntityPropertyChange, EntityPropertyChangeDto>();

            //Friendship
            configuration.CreateMap<Friendship, FriendDto>();
            configuration.CreateMap<FriendCacheItem, FriendDto>();

            //OrganizationUnit
            configuration.CreateMap<OrganizationUnit, OrganizationUnitDto>();
            configuration.CreateMap<OrganizationUnitCustom, OrganizationUnitDto>();

            //Warehouse
           //configuration.CreateMap<Warehouse, WarehouseListDto>();
            configuration.CreateMap<WarehouseMaster, WarehouseMasterDto>();

            //WorkZone
            configuration.CreateMap<WorkZone, WorkZoneListDto>();
            configuration.CreateMap<WorkZone, WarehouseListDto>();

            //PO
            configuration.CreateMap<PO.Header, POMasterDto>();
            configuration.CreateMap<PO.Header, POStatusDto>();
            configuration.CreateMap<PO.HostHeader, POMasterDto>();
            configuration.CreateMap<PO.HostHeader, POStatusDto>();
            configuration.CreateMap<PO.Details, PODetailDto>();

            //ASN
            configuration.CreateMap<ASN.Header, ASNMasterDto>();
            configuration.CreateMap<ASN.Container, ASNCaseDto>();
            configuration.CreateMap<ASN.Details, ASNDetailDto>();
            configuration.CreateMap<ASN.Lookup, ASNFormatDto>();

            //Inventory
            configuration.CreateMap<Inventory, InventoryMasterDto>();
            configuration.CreateMap<Inventory, InventoryItemDto>();
            configuration.CreateMap<Inventory, InventoryBySkuMasterDto>();
            configuration.CreateMap<Host_Inventory, InventoryMasterDto>();
            configuration.CreateMap<Host_Inventory, InventoryItemDto>();

            //TransferOrder
            configuration.CreateMap<TransferOrders.Header, TransferOrderMasterDto>();
            configuration.CreateMap<TransferOrders.Detail, TransferOrderDetailDto>();
        }
    }
}