using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Castle.DynamicProxy.Generators.Emitters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;
using System.Text;
using System.Web;

namespace Aims.Warehouses
{
    [Table("t_warehouse")]
    public class WarehouseMaster: FullAuditedEntity<long>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        [MaxLength(30)]
        public string whse_code { get; set; }

        [MaxLength(100)]
        public string whse_name { get; set; }

        [MaxLength(1)]
        public string status { get; set; }

        [MaxLength(30)]
        public string country { get; set; }

        [MaxLength(50)]
        public string state { get; set; }

        [MaxLength(50)]
        public string city { get; set; }

        [MaxLength(200)]
        public string address { get; set; }

        [MaxLength(200)]
        public string address1 { get; set; }

        [MaxLength(200)]
        public string address2 { get; set; }

        [MaxLength(20)]
        public string zip { get; set; }

        [MaxLength(50)]
        public string contact { get; set; }

        [MaxLength(50)]
        public string contact_tel { get; set; }

        [MaxLength(50)]
        public string contact_fax { get; set; }

        [MaxLength(100)]
        public string contact_email { get; set; }

        [MaxLength(50)]
        public string contact_title { get; set; }

        [MaxLength(200)]
        public string udf01 { get; set; }

        [MaxLength(200)]
        public string udf02 { get; set; }

        [MaxLength (200)]
        public string udf03 { get; set; }

        [MaxLength(200)]
        public string udf04 { get; set; }

        [MaxLength(200)]
        public string remarks { get; set; }

        [MaxLength(200)]
        public string lookupDesc { get; set; }
    }
}
