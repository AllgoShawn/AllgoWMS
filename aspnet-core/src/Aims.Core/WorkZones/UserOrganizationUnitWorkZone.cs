using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Abp.Organizations;

namespace Aims.WorkZones
{
    [Table("AbpUserOrganizationUnitWorkZones")]
    public class UserOrganizationUnitWorkZone : FullAuditedEntity<long>, IMayHaveTenant
    {
        public int? TenantId { get; set; }
        public long WorkZoneId { get; set; }
        public long UserId { get; set; }
    }
}
