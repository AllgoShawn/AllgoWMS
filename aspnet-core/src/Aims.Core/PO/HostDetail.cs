using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Aims.PO
{
    [Table("doc_po_details")]
    public class HostDetail : FullAuditedEntity<long>
    {
        [MaxLength(20)]
        public string organizationId { get; set; }

        [MaxLength(20)]
        public string warehouseId { get; set; }

        [MaxLength(20)]
        public string poNo { get; set; }

        public int poLineNo { get; set; }

        [MaxLength(30)]
        public string customerId { get; set; }

        [MaxLength(50)]
        public string sku { get; set; }

        [MaxLength(500)]
        public string skuDescr { get; set; }

        public decimal orderedQty { get; set; }

        public decimal orderedQty_Each { get; set; }

        public decimal receivedQty { get; set; }

        public decimal receivedQty_Each { get; set; }

        public DateTime? receivedTime { get; set; }

        [MaxLength(50)]
        public string packId { get; set; }

        [MaxLength(10)]
        public string packUom { get; set; }

        public decimal totalCubic { get; set; }

        public decimal totalGrossWeight { get; set; }

        public decimal totalNetWeight { get; set; }

        public decimal totalPrice { get; set; }

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

        public decimal? qtyReleased { get; set; }

        public decimal? price { get; set; }

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
        public string erpCancelFlag { get; set; }

        [MaxLength(100)]
        public string erpCancelReason { get; set; }

        public decimal? cancelledQty { get; set; }

        public string cancelledQtyMemo { get; set; }

        [MaxLength(30)]
        public string containerId { get; set; }

        //Extra

        public decimal openedQty { get; set; }

        public decimal shippedQty { get; set; }
    }
}
