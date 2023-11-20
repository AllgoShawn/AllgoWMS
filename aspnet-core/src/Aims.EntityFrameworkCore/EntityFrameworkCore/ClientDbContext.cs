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
using Aims.PO;
using Aims.TransferOrders;

namespace Aims.EntityFrameworkCore
{
    public class ClientDbContext : AbpZeroDbContext<Tenant, Role, User, ClientDbContext>, IAbpPersistedGrantDbContext
    {
        public virtual DbSet<PersistedGrantEntity> PersistedGrants { get; set; }

        public virtual DbSet<ASN.HostHeader> ASNHeader { get; set; }
        public virtual DbSet<ASN.HostDetail> ASNDetail { get; set; }

        public virtual DbSet<PO.HostHeader> POHeader { get; set; }
        public virtual DbSet<PO.HostDetail> POHDetail { get; set; }

        public virtual DbSet<Host_Inventory> Inventories { get; set; }

        public virtual DbSet<TransferOrders.HostHeader> TOHeader { get; set; }
        public virtual DbSet<TransferOrders.HostDetail> TODetail { get; set; }

        public ClientDbContext(DbContextOptions<ClientDbContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ConfigurePersistedGrantEntity();
        }
    }
}
