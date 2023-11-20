using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Aims.ASN
{
    [Table("doc_asn_details")]
    public class HostDetail : FullAuditedEntity<long>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        [MaxLength(20)]
        public string organizationId { get; set; }

        [MaxLength(20)]
        public string warehouseId { get; set; }

        [MaxLength(20)]
        public string asnNo { get; set; }

        public int asnLineNo { get; set; }

        [MaxLength(30)]
        public string customerId { get; set; }

        [MaxLength(50)]
        public string sku { get; set; }

        [MaxLength(500)]
        public string skuDescr { get; set; }

        [MaxLength(20)]
        public string poNo { get; set; }

        public int? poLineNo { get; set; }

        [MaxLength(2)]
        public string lineStatus { get; set; }

        public DateTime? receivedTime { get; set; }

        public decimal expectedQty { get; set; }

        public decimal expectedQty_Each { get; set; }

        public decimal receivedQty { get; set; }

        public decimal receivedQty_Each { get; set; }

        [MaxLength(50)]
        public string packId { get; set; }

        [MaxLength(10)]
        public string packUom { get; set; }

        [MaxLength(2)]
        public string holdRejectCode { get; set; }

        [MaxLength(60)]
        public string holdRejectReason { get; set; }

        [MaxLength(20)]
        public string productStatus { get; set; }

        [MaxLength(60)]
        public string productStatus_Descr { get; set; }

        [MaxLength(60)]
        public string receivingLocation { get; set; }

        [MaxLength(30)]
        public string containerId { get; set; }

        public int containerQty { get; set; }

        [MaxLength(20)]
        public string lotAtt01 { get; set; }

        [MaxLength(20)]
        public string lotAtt02 { get; set; }

        [MaxLength(20)]
        public string lotAtt03 { get; set; }

        [MaxLength(100)]
        public string lotAtt04 { get; set; }

        [MaxLength(100)]
        public string lotAtt05 { get; set; }

        [MaxLength(100)]
        public string lotAtt06 { get; set; }

        [MaxLength(100)]
        public string lotAtt07 { get; set; }

        [MaxLength(100)]
        public string lotAtt08 { get; set; }

        [MaxLength(100)]
        public string lotAtt09 { get; set; }

        [MaxLength(100)]
        public string lotAtt10 { get; set; }

        [MaxLength(100)]
        public string lotAtt11 { get; set; }

        [MaxLength(100)]
        public string lotAtt12 { get; set; }

        [MaxLength(100)]
        public string lotAtt13 { get; set; }

        [MaxLength(100)]
        public string lotAtt14 { get; set; }

        [MaxLength(100)]
        public string lotAtt15 { get; set; }

        [MaxLength(100)]
        public string lotAtt16 { get; set; }

        [MaxLength(100)]
        public string lotAtt17 { get; set; }

        [MaxLength(100)]
        public string lotAtt18 { get; set; }

        [MaxLength(100)]
        public string lotAtt19 { get; set; }

        [MaxLength(100)]
        public string lotAtt20 { get; set; }

        [MaxLength(100)]
        public string lotAtt21 { get; set; }

        [MaxLength(100)]
        public string lotAtt22 { get; set; }

        [MaxLength(100)]
        public string lotAtt23 { get; set; }

        [MaxLength(100)]
        public string lotAtt24 { get; set; }

        public decimal totalCubic { get; set; }

        public decimal totalGrossWeight { get; set; }

        public decimal totalNetWeight { get; set; }

        public decimal totalPrice { get; set; }

        [MaxLength(35)]
        public string createSource { get; set; }

        public decimal? palletizeQty_Each { get; set; }

        [MaxLength(8)]
        public string palletizeMethod { get; set; }

        [MaxLength(60)]
        public string planToLoc { get; set; }

        [MaxLength(1)]
        public string reserve_Flag { get; set; }

        [MaxLength(100)]
        public string alternativeSku { get; set; }

        [MaxLength(200)]
        public string alternativeDescr { get; set; }

        [MaxLength(1)]
        public string printLabel { get; set; }

        public decimal? damagedQty_Each { get; set; }

        public decimal? rejectedQty { get; set; }

        public decimal? rejectedQty_Each { get; set; }

        [MaxLength(2)]
        public string qcStatus { get; set; }

        public decimal? overRcvPercentage { get; set; }

        public int? referenceLineNo { get; set; }

        [MaxLength(100)]
        public string asnLineFilter { get; set; }

        [MaxLength(35)]
        public string operatorr { get; set; }

        public decimal? preReceivedQty_Each { get; set; }

        [MaxLength(60)]
        public string preReceivedLocation { get; set; }

        [MaxLength(200)]
        public string dedi01 { get; set; }

        [MaxLength(200)]
        public string dedi02 { get; set; }

        [MaxLength(200)]
        public string dedi03 { get; set; }

        [MaxLength(200)]
        public string dedi04 { get; set; }

        [MaxLength(200)]
        public string dedi05 { get; set; }

        [MaxLength(200)]
        public string dedi06 { get; set; }

        [MaxLength(200)]
        public string dedi07 { get; set; }

        [MaxLength(200)]
        public string dedi08 { get; set; }

        public decimal? dedi09 { get; set; }

        public decimal? dedi10 { get; set; }

        [MaxLength(200)]
        public string dedi11 { get; set; }

        [MaxLength(200)]
        public string dedi12 { get; set; }

        [MaxLength(200)]
        public string dedi13 { get; set; }

        [MaxLength(200)]
        public string dedi14 { get; set; }

        [MaxLength(200)]
        public string dedi15 { get; set; }

        [MaxLength(200)]
        public string dedi16 { get; set; }

        [MaxLength(200)]
        public string dedi17 { get; set; }

        [MaxLength(200)]
        public string dedi18 { get; set; }

        [MaxLength(200)]
        public string dedi19 { get; set; }

        [MaxLength(200)]
        public string dedi20 { get; set; }

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
        public string checkItemsFlag { get; set; }

        [MaxLength(1)]
        public string erpCancelFlag { get; set; }

        public DateTime? expiryDate { get; set; }

        //Extra

        public decimal openedQty { get; set; }

        public decimal shippedQty { get; set; }
    }
}
