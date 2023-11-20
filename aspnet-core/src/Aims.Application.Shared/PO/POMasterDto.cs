using Abp.Application.Services.Dto;
using System;

namespace Aims.PO
{
    public class POMasterDto : AuditedEntityDto<long>
    {
        public int? TenantId { get; set; }

        public string organizationId { get; set; }

        public string warehouseId { get; set; } 

        public string poNo { get; set; }

        public string poType { get; set; }

        public string poStatus { get; set; }

        public string customerId { get; set; }

        public DateTime poCreationTime { get; set; }

        public string poReference1 { get; set; }

        public string supplierId { get; set; }

        public string supplier_Name { get; set; }

        public string carrierName { get; set; }

        public string IssuePartyId { get; set; }

        //Default Value

        public string addWho { get; set; }

        public DateTime addTime { get; set; }

        public string editWho { get; set; }

        public DateTime? editTime { get; set; }

        public string orderNo { get; set; }

        public int? orderId { get; set; }

        public string poCreationTimeToString { get; set; }

        public string udf01 { get; set; }
    }
}
