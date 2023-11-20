using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Abp.Organizations;

namespace Aims.WorkZones
{
    [Table("AbpOrganizationUnitWorkZones")]
    public class WorkZone : FullAuditedEntity<long>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        public long OrganizationUnitId { get; set; }

        public long? WarehouseId { get; set; }

        [MaxLength((20))]
        public string Code { get; set; }

        [MaxLength(20)]
        public string Type { get; set; }
    }
}
