using Abp.Application.Services.Dto;
using System;


namespace Aims.Inventories
{
    public class InventoryMasterDto : AuditedEntityDto<long>
    {
        public int? TenantId { get; set; }

        public string organizationId { get; set; }

        public string warehouseId { get; set; }

        public string sku { get; set; }

        public string lotNum { get; set; }

        public string descr { get; set; }

        public decimal qty { get; set; }

        public decimal qtyOrdered { get; set; }

        public decimal qtyAllocated { get; set; }

        public decimal qtyDamaged { get; set; }

        public decimal qtyInTransit { get; set; }

        //Default Value

        public string locationId { get; set; }
        public string traceId { get; set; }
        public string customerId { get; set; }

        public decimal qtyRpIn { get; set; }
        public decimal qtyRpOut { get; set; }
        public decimal qtyMvIn { get; set; }
        public decimal qtyMvOut { get; set; }
        public decimal qtyOnHold { get; set; }
        public decimal grossWeight { get; set; }
        public decimal netWeight { get; set; }
        public decimal cubic { get; set; }
        public decimal price { get; set; }
        public decimal qtyPa { get; set; }

        public string oprSeqFlag { get; set; }
        public DateTime? inLocTime { get; set; }

        public string addWho { get; set; }
        public DateTime addTime { get; set; }
        public string editWho { get; set; }
        public DateTime? editTime { get; set; }
    }
}
