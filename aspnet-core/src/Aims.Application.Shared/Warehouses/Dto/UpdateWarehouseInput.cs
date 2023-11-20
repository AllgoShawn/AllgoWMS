using System.ComponentModel.DataAnnotations;
using Abp.Organizations;

namespace Aims.Warehouses.Dto
{
    public class UpdateWarehouseInput
    {
        [Range(1, long.MaxValue)]
        public long Id { get; set; }

        [Required]
        public long OrganizationUnitId { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }
    }
}