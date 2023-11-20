using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Abp.Organizations;

namespace Aims.Warehouses
{
    [Table("AbpOrganizationUnitWarehouses")]
    public class Warehouse : FullAuditedEntity<long>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        public long OrganizationUnitId { get; set; }

        [MaxLength((OrganizationUnit.MaxDisplayNameLength))]
        public string Name { get; set; }
    }
}
