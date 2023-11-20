using System.ComponentModel.DataAnnotations;

namespace Aims.WorkZones.Dto
{
    public class UsersToWorkZoneInput
    {
        public long[] UserIds { get; set; }
        
        public long WorkZoneId { get; set; }
    }
}
