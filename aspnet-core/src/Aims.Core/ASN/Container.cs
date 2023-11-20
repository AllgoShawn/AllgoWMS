using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Aims.ASN
{
    [Table("doc_asn_container")]
    public class Container : FullAuditedEntity<long>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        [MaxLength(20)]
        public string organizationId { get; set; }

        [MaxLength(20)]
        public string warehouseId { get; set; }

        [MaxLength(20)]
        public string asnNo { get; set; }

        [MaxLength(20)]
        public string ctnNo { get; set; }

        public int ctnLineNo { get; set; }

        [MaxLength(2)]
        public string ctnType { get; set; }

        [MaxLength(2)]
        public string ctnSize { get; set; }

        [MaxLength(10)]
        public string ctnSealNo1 { get; set; }

        [MaxLength(10)]
        public string ctnSealNo2 { get; set; }

        public decimal ctnGrossWeight { get; set; }

        public decimal? ctnFee { get; set; }

        public DateTime? chargeDate { get; set; }

        public string noteText { get; set; }

        [MaxLength(500)]
        public string udf01 { get; set; }

        [MaxLength(500)]
        public string udf02 { get; set; }

        [MaxLength(500)]
        public string udf03 { get; set; }

        [MaxLength(500)]
        public string udf04 { get; set; }

        [MaxLength(500)]
        public string udf05 { get; set; }

        [MaxLength(500)]
        public string udf06 { get; set; }

        public int currentVersion { get; set; }

        [MaxLength(65)]
        public string oprSeqFlag { get; set; }

        //Extra

        public int totalLineNo { get; set; }
    }
}
