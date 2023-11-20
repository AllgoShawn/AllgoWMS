using System.ComponentModel.DataAnnotations;
using Abp.Organizations;

namespace Aims.WorkZones.Dto
{
    public class CreateWorkZoneInput
    {
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