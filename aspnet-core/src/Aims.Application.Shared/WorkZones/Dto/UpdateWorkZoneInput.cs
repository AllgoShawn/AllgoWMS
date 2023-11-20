using System.ComponentModel.DataAnnotations;
using Abp.Organizations;

namespace Aims.WorkZones.Dto
{
    public class UpdateWorkZoneInput
    {
        [Range(1, long.MaxValue)]
        public long Id { get; set; }

        [Required]
        public long OrganizationUnitId { get; set; }

        [Required]
        public long WarehouseId { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [Required]
        [StringLength(20)]
        public string Type { get; set; }
    }
}