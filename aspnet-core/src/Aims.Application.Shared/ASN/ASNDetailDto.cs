using Abp.Application.Services.Dto;
using System;

namespace Aims.ASN
{
    public class ASNDetailDto : AuditedEntityDto<long>
    {
        public int? TenantId { get; set; }

        public int asnLineNo { get; set; }

        public int poLineNo { get; set; }

        public string sku { get; set; }

        public string skuDescr { get; set; }

        public decimal expectedQty { get; set; }

        public decimal receivedQty { get; set; }

        public decimal openedQty { get; set; }

        public decimal shippedQty { get; set; }

        public string containerId { get; set; }

        public int containerQty { get; set; }

        public string lotAtt01 { get; set; }

        public DateTime? expiryDate { get; set; }

        public string creationTimeToString { get; set; }

        public string expiryDateToString { get; set; }

        //default value

        public string customerId { get; set; } //NULL

        public string lineStatus { get; set; }

        public decimal expectedQty_Each { get; set; }

        public decimal receivedQty_Each { get; set; }

        public string packId { get; set; }

        public string packUom { get; set; }
    }
}
