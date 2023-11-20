using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace Aims.Common
{
    [Table("t_lookup")]

    public class Lookup : FullAuditedEntity<long>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        [MaxLength(50)]
        public string source { get; set; }

        public decimal sequence { get; set; }

        [MaxLength(50)]
        public string text { get; set; }

        [MaxLength(100)]
        public string description { get; set; }

        [MaxLength(20)]
        public string lookup_type { get; set; }

        public decimal locale_id { get; set; }


    }

}
