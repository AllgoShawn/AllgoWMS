using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Aims.OrganizationUnits
{
    public class OrganizationUnitCustom : FullAuditedEntity<long>, IMayHaveTenant
    {
        public const int MaxDisplayNameLength = 128;
        public const int MaxDepth = 16;
        public const int CodeUnitLength = 5;
        public const int MaxCodeLength = 95;

        [Required]
        [StringLength(95)]
        public virtual string Code { get; set; }

        public virtual long? ParentId { get; set; }

        [ForeignKey("ParentId")]
        public virtual OrganizationUnitCustom Parent { get; set; }

        public virtual int? TenantId { get; set; }

        public virtual ICollection<OrganizationUnitCustom> Children { get; set; }

        [Required]
        [StringLength(128)]
        public virtual string DisplayName { get; set; }

        public virtual string Type { get; set; }
    }
}
