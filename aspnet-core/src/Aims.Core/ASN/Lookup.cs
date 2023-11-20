using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Aims.ASN
{
    [Table("doc_asn_lookup")]
    public class Lookup : FullAuditedEntity<long>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        [MaxLength(20)]
        public string Prefix { get; set; }

        public int HasDate { get; set; }

        public int IsActive { get; set; }

        public int IsStatic { get; set; }
    }
}
