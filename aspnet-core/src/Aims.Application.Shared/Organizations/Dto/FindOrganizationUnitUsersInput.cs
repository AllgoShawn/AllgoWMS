using Aims.Dto;

namespace Aims.Organizations.Dto
{
    public class FindOrganizationUnitUsersInput : PagedAndFilteredInputDto
    {
        public long OrganizationUnitId { get; set; }
        public string Type { get; set; }
    }
}
