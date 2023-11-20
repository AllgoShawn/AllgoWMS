using Abp.Application.Services.Dto;
using System;

namespace Aims.ASN
{
    public class ASNCaseDto : AuditedEntityDto<long>
    {
        public int? TenantId { get; set; }

        public string asnNo { get; set; }

        public string ctnNo { get; set; }

        public int ctnLineNo { get; set; }

        public string ctnType { get; set; }

        public int totalLineNo { get; set; }

        public string ctnSize { get; set; }

        public decimal ctnGrossWeight { get; set; }

        public string ctnSealNo1 { get; set; }

        public string creationTimeToString { get; set; }

        public string udf01 { get; set; }
    }
}
