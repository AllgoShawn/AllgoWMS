using System.ComponentModel.DataAnnotations;
using Abp.Organizations;

namespace Aims.Warehouses.Dto
{
    public class CreateWarehouseInput
    {
        [Required]
        public long OrganizationUnitId { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }
    }
}