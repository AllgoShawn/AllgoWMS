using System;
using System.ComponentModel.DataAnnotations;
using Abp.Runtime.Validation;
using Aims.Dto;

namespace Aims.Inventories
{
    public class GetInventoryInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public string Filter { get; set; }
        public string OrganizationFilter { get; set; }
        public string WarehouseFilter { get; set; }
        public string SkuFilter { get; set; }
        public string LotNumFilter { get; set; }
        public string DescrFilter { get; set; }
        public decimal? MinQtyFilter { get; set; }
        public decimal? MaxQtyFilter { get; set; }
        public decimal? MinQtyAllocatedFilter { get; set; }
        public decimal? MaxQtyAllocatedFilter { get; set; }
        public decimal? MinQtyDamagedFilter { get; set; }
        public decimal? MaxQtyDamagedFilter { get; set; }
        public decimal? MinQtyInTransitFilter { get; set; }
        public decimal? MaxQtyInTransitFilter { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = " organizationId,warehouseId,sku DESC ";
            }
        }
    }
}
