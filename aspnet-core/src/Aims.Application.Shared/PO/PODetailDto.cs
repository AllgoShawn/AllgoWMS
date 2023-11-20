using Abp.Application.Services.Dto;
using System;

namespace Aims.PO
{
    public class PODetailDto : AuditedEntityDto<long>
    {
        public int? TenantId { get; set; }

        public string organizationId { get; set; }

        public string warehouseId { get; set; }

        public string poNo { get; set; }

        public int poLineNo { get; set; }

        public string poLineStatus { get; set; }

        public string customerId { get; set; }

        public string sku { get; set; }

        public string skuDescr { get; set; }

        public decimal orderedQty { get; set; }

        public decimal receivedQty { get; set; }

        public decimal openedQty { get; set; }

        public decimal shippedQty { get; set; }

        public string lotAtt01 { get; set; }

        //Default Value

        public string addWho { get; set; }

        public DateTime addTime { get; set; }

        public string editWho { get; set; }

        public DateTime editTime { get; set; }

        public decimal orderedQty_Each { get; set; }

        public decimal receivedQty_Each { get; set; }

        public string packId { get; set; }

        public string packUom { get; set; }

        public decimal totalCubic { get; set; }

        public decimal totalGrossWeight { get; set; }

        public decimal totalNetWeight { get; set; }

        public decimal totalPrice { get; set; }
    }
}
