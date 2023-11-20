using System.ComponentModel.DataAnnotations;
using Abp.Organizations;

namespace Aims.Organizations.Dto
{
    public class CreateOrganizationUnitInput
    {
        public long? ParentId { get; set; }

        [Required]
        [StringLength(OrganizationUnit.MaxDisplayNameLength)]
        public string DisplayName { get; set; }

        [Required]
        [StringLength(OrganizationUnit.MaxDisplayNameLength)]
        public string Code { get; set; }

        public string Type { get; set; }
    }
}