using System.ComponentModel.DataAnnotations;
using Abp.Runtime.Validation;
using Aims.Dto;

namespace Aims.Warehouses.Dto
{
    public class GetWarehouseInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public long Id { get; set; }
        public string Filter { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "warehouse.code";
            }
            else if (Sorting.Contains("code"))
            {
                Sorting = Sorting.Replace("code", "warehouse.code");
            }
            else if (Sorting.Contains("updatedTime"))
            {
                Sorting = Sorting.Replace("updatedTime", "ISNULL(warehouse.lastModificationTime, warehouse.creationTime)");
            }
        }
    }
}