using Abp.Application.Services.Dto;
using System;

namespace Aims.TransferOrders
{
    public class TransferOrderMasterDto : AuditedEntityDto<long>
    {
        public int? TenantId { get; set; }

        public string organizationId { get; set; }

        public string orderNo { get; set; }

        public string orderType { get; set; }

        public string warehouseId { get; set; }

        public string consigneeId { get; set; }

        public string customerId { get; set; }

        public string carrierName { get; set; }

        public string soStatus { get; set; }

        public DateTime requiredDeliveryTime { get; set; }

        public string creationTimeToString { get; set; }

        public string requiredDeliveryTimeToString { get; set; }

        public string hedi05 { get; set; }
    }
}
