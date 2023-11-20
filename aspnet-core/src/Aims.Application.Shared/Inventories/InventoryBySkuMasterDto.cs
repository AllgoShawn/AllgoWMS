using Abp.Application.Services.Dto;
using System;

namespace Aims.Inventories
{
    public class InventoryBySkuMasterDto : AuditedEntityDto<long>
    {
        public int? TenantId { get; set; }

        public string sku { get; set; }

        public string warehouseId { get; set; }

        public string qcStatus { get; set; }

        public decimal qty { get; set; }

        public string descr { get; set; }

        public string noteText { get; set; }
    }
}
