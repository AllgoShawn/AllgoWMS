using System.ComponentModel.DataAnnotations;
using Abp.Runtime.Validation;
using Aims.Dto;

namespace Aims.WorkZones.Dto
{
    public class GetWorkZoneInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public long organizationUnitId { get; set; }

        public long? warehouseId { get; set; }

        public string Filter { get; set; }

        public string Type { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "workZone.code";
            }
            else if (Sorting.Contains("code"))
            {
                Sorting = Sorting.Replace("code", "workZone.code");
            }
            else if (Sorting.Contains("updatedTime"))
            {
                Sorting = Sorting.Replace("updatedTime", "ISNULL(workZone.lastModificationTime, workZone.creationTime)");
            }
        }
    }
}