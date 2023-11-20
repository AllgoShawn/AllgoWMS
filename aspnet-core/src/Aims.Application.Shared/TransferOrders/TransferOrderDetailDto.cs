using Abp.Application.Services.Dto;
using System;

namespace Aims.TransferOrders
{
    public class TransferOrderDetailDto : AuditedEntityDto<long>
    {
        public int? TenantId { get; set; }

        public string organizationId { get; set; }

        public string customerId { get; set; }

        public int orderLineNo { get; set; }

        public string sku { get; set; }

        public string lineStatus { get; set; }

        public decimal? dedi09 { get; set; }

        public decimal? dedi10 { get; set; }
         
        public decimal qtyOrdered { get; set; }

        public string lotNum { get; set; }

        public DateTime? expiryDate { get; set; }

        public string creationTimeToString { get; set; }

        public string expiryDateToString { get; set; }
    }
}
