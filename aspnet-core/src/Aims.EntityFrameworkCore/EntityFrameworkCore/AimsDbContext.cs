using Abp.IdentityServer4;
using Abp.Zero.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Aims.Authorization.Roles;
using Aims.Authorization.Users;
using Aims.Chat;
using Aims.Editions;
using Aims.Friendships;
using Aims.MultiTenancy;
using Aims.MultiTenancy.Accounting;
using Aims.MultiTenancy.Payments;
using Aims.Storage;
using Aims.OrganizationUnits;
using Aims.Warehouses;
using Aims.WorkZones;
using Aims.Inventories;

namespace Aims.EntityFrameworkCore
{
    public class AimsDbContext : AbpZeroDbContext<Tenant, Role, User, AimsDbContext>, IAbpPersistedGrantDbContext
    {
        /* Define an IDbSet for each entity of the application */

        public virtual DbSet<BinaryObject> BinaryObjects { get; set; }

        public virtual DbSet<Friendship> Friendships { get; set; }

        public virtual DbSet<ChatMessage> ChatMessages { get; set; }

        public virtual DbSet<SubscribableEdition> SubscribableEditions { get; set; }

        public virtual DbSet<SubscriptionPayment> SubscriptionPayments { get; set; }

        public virtual DbSet<Invoice> Invoices { get; set; }

        public virtual DbSet<PersistedGrantEntity> PersistedGrants { get; set; }

        public virtual DbSet<SubscriptionPaymentExtensionData> SubscriptionPaymentExtensionDatas { get; set; }

        //Octopus DBSet

        public virtual DbSet<OrganizationUnitCustom> OrganizationUnitCustoms { get; set; }
        public virtual DbSet<UserOrganizationUnitWorkZone> UserOrganizationUnitWorkZones { get; set; }

        public virtual DbSet<Warehouse> Warehouses { get; set; }
        public virtual DbSet<WorkZone> WorkZones { get; set; }

        public virtual DbSet<ASN.Appointment> ASNAppointments { get; set; }
        public virtual DbSet<ASN.Container> ASNContainers { get; set; }
        public virtual DbSet<ASN.Details> ASNDetails { get; set; }
        public virtual DbSet<ASN.Header> ASNHeaders { get; set; }
        public virtual DbSet<ASN.SerialNo> ASNSerialNos { get; set; }
        public virtual DbSet<ASN.Lookup> ASNLookups { get; set; }

        public virtual DbSet<PO.Details> PODetails { get; set; }
        public virtual DbSet<PO.Header> POHeaders { get; set; }

        public virtual DbSet<Inventory> Inventories { get; set; }

        public virtual DbSet<TransferOrders.Header> TOHeaders { get; set; }
        public virtual DbSet<TransferOrders.Detail> TODetails { get; set; }

        public AimsDbContext(DbContextOptions<AimsDbContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<BinaryObject>(b =>
                       {
                           b.HasIndex(e => new { e.TenantId });
                       });

            modelBuilder.Entity<ChatMessage>(b =>
            {
                b.HasIndex(e => new { e.TenantId, e.UserId, e.ReadState });
                b.HasIndex(e => new { e.TenantId, e.TargetUserId, e.ReadState });
                b.HasIndex(e => new { e.TargetTenantId, e.TargetUserId, e.ReadState });
                b.HasIndex(e => new { e.TargetTenantId, e.UserId, e.ReadState });
            });

            modelBuilder.Entity<Friendship>(b =>
            {
                b.HasIndex(e => new { e.TenantId, e.UserId });
                b.HasIndex(e => new { e.TenantId, e.FriendUserId });
                b.HasIndex(e => new { e.FriendTenantId, e.UserId });
                b.HasIndex(e => new { e.FriendTenantId, e.FriendUserId });
            });

            modelBuilder.Entity<Tenant>(b =>
            {
                b.HasIndex(e => new { e.SubscriptionEndDateUtc });
                b.HasIndex(e => new { e.CreationTime });
            });

            modelBuilder.Entity<SubscriptionPayment>(b =>
            {
                b.HasIndex(e => new { e.Status, e.CreationTime });
                b.HasIndex(e => new { PaymentId = e.ExternalPaymentId, e.Gateway });
            });

            modelBuilder.Entity<SubscriptionPaymentExtensionData>(b =>
            {
                b.HasQueryFilter(m => !m.IsDeleted)
                    .HasIndex(e => new { e.SubscriptionPaymentId, e.Key, e.IsDeleted })
                    .IsUnique();
            });

            modelBuilder.ConfigurePersistedGrantEntity();
        }
    }
}