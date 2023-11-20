using Aims.Dto;

namespace Aims.WorkZones.Dto
{
    public class FindWorkZoneUsersInput : PagedAndFilteredInputDto
    {
        public long WorkZoneId { get; set; }
        public string Type { get; set; }
    }
}
