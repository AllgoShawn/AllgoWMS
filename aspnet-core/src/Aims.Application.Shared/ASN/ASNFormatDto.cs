using Abp.Application.Services.Dto;
using System;

namespace Aims.ASN
{
    public class ASNFormatDto : AuditedEntityDto<long>
    {
        public int? TenantId { get; set; }

        public string Prefix { get; set; }

        public int HasDate { get; set; }

        public int IsActive { get; set; }

        public int IsStatic { get; set; }
    }
}
