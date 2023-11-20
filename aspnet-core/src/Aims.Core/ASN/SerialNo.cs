using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Aims.ASN
{
    [Table("doc_asn_serialno")]
    public class SerialNo : FullAuditedEntity<long>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        [MaxLength(20)]
        public string organizationId { get; set; }

        [MaxLength(20)]
        public string warehouseId { get; set; }

        [MaxLength(20)]
        public string asnNo { get; set; }

        [MaxLength(40)]
        public string serialNo { get; set; }

        [MaxLength(50)]
        public string sku { get; set; }

        public DateTime scanTime { get; set; }

        [MaxLength(30)]
        public string customerId { get; set; }

        [MaxLength(60)]
        public string locationId { get; set; }

        [MaxLength(30)]
        public string traceId { get; set; }

        [MaxLength(1)]
        public string stockFlag { get; set; }

        [MaxLength(10)]
        public string lotNum { get; set; }

        [MaxLength(40)]
        public string secondSerialNo { get; set; }

        public decimal? qty { get; set; }

        [MaxLength(1)]
        public string qcFlag { get; set; }

        [MaxLength(1)]
        public string partialFlag { get; set; }

        [MaxLength(30)]
        public string consigneeId { get; set; }

        public int? qcQty { get; set; }

        public decimal? grossWeight { get; set; }

        public decimal? cubic { get; set; }

        [MaxLength(50)]
        public string cartonType { get; set; }

        [MaxLength(20)]
        public string transactionId { get; set; }

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

        public int currentVersion { get; set; }

        [MaxLength(65)]
        public string oprSeqFlag { get; set; }

        [MaxLength(1)]
        public string holdFlag { get; set; }

        [MaxLength(30)]
        public string supplierId { get; set; }

        [MaxLength(40)]
        public string originalCode { get; set; }
    }
}
