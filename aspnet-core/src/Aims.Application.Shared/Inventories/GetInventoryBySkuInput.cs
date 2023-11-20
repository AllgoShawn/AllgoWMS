using System;
using System.ComponentModel.DataAnnotations;
using Abp.Runtime.Validation;
using Aims.Dto;

namespace Aims.Inventories
{
    public class GetInventoryBySkuInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public string Filter { get; set; }
        public string SkuFilter { get; set; }
        public string WarehouseFilter { get; set; }
        public string StatusFilter { get; set; }
        public decimal? MinQtyFilter { get; set; }
        public decimal? MaxQtyFilter { get; set; }
        public string InformationFilter { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = " ISNULL(CreationTime, LastModificationTime) DESC ";
            }
        }
    }
}
