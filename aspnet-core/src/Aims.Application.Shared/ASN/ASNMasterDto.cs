using Abp.Application.Services.Dto;
using System;

namespace Aims.ASN
{
    public class ASNMasterDto : AuditedEntityDto<long>
    {
        public int? TenantId { get; set; }

        public string asnNo { get; set; }

        public string asnType { get; set; }

        public string poNo { get; set; }

        public string organizationId { get; set; }

        public string customerId { get; set; }

        public string warehouseId { get; set; }

        public string supplierId { get; set; }

        public string asnStatus { get; set; }

        public DateTime expectedArriveTime1 { get; set; }

        public string carrierName { get; set; }

        public string expectedArriveTime1ToString { get; set; }

        public string creationTimeToString { get; set; }

        //Default Value

        public string createSource { get; set; }

        public string byTrace_Flag { get; set; }

        public string reserve_Flag { get; set; }

        public int currentVersion { get; set; }

        public string warehouseTransferFlag { get; set; }

        public string oprSeqFlag { get; set; }

        public string udf01 { get; set; }
    }
}
