using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Aims.TransferOrders
{
    [Table("doc_transfer_details")]
    public class HostDetail : FullAuditedEntity<long>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        [MaxLength(20)]
        public string organizationId { get; set; }

        [MaxLength(20)]
        public string warehouseId { get; set; }

        [MaxLength(20)]
        public string orderNo { get; set; }

        public int orderLineNo { get; set; }

        [MaxLength(30)]
        public string customerId { get; set; }

        [MaxLength(50)]
        public string sku { get; set; }

        [MaxLength(2)]
        public string lineStatus { get; set; }

        [MaxLength(10)]
        public string lotNum { get; set; }

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

        [MaxLength(20)]
        public string pickZone { get; set; }

        [MaxLength(500)]
        public string location { get; set; }

        [MaxLength(30)]
        public string traceId { get; set; }

        public decimal qtyOrdered { get; set; }

        public decimal qtySoftAllocated { get; set; }

        public decimal qtyAllocated { get; set; }

        public decimal qtyPicked { get; set; }

        public decimal qtyShipped { get; set; }

        [MaxLength(50)]
        public string packId { get; set; }

        [MaxLength(10)]
        public string packUom { get; set; }

        public decimal? qtyOrdered_each { get; set; }

        public decimal qtySoftAllocated_each { get; set; }

        public decimal qtyAllocated_each { get; set; }

        public decimal qtyPicked_each { get; set; }

        public decimal qtyShipped_each { get; set; }

        [MaxLength(20)]
        public string rotationId { get; set; }

        [MaxLength(20)]
        public string softAllocationRule { get; set; }

        [MaxLength(20)]
        public string allocationRule { get; set; }

        public decimal grossWeight { get; set; }

        public decimal netWeight { get; set; }

        public decimal cubic { get; set; }

        public decimal price { get; set; }

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

        [MaxLength(100)]
        public string alternativeSku { get; set; }

        public int? kitReferenceNo { get; set; }

        [MaxLength(30)]
        public string orderLineReferenceNo { get; set; }

        [MaxLength(50)]
        public string kitSku { get; set; }

        [MaxLength(1)]
        public string erpCancelFlag { get; set; }

        [MaxLength(20)]
        public string zoneGroup { get; set; }

        [MaxLength(10)]
        public string locGroup1 { get; set; }

        [MaxLength(10)]
        public string locGroup2 { get; set; }

        [MaxLength(1)]
        public string commingleSku { get; set; }

        [MaxLength(1)]
        public string ONESTEPALLOCATION { get; set; }

        [MaxLength(1)]
        public string orderLotControl { get; set; }

        [MaxLength(1)]
        public string fullCaseLotControl { get; set; }

        [MaxLength(1)]
        public string pieceLotControl { get; set; }

        public int? referenceLineNo { get; set; }

        [MaxLength(20)]
        public string salesOrderNo { get; set; }

        [MaxLength(20)]
        public string salesOrderLineNo { get; set; }

        public int qtyReleased { get; set; }

        [MaxLength(1)]
        public string rule3Flag { get; set; }

        [MaxLength(500)]
        public string pickInstruction { get; set; }

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

        [MaxLength(40)]
        public string addWho { get; set; }

        public DateTime? addTime { get; set; }

        [MaxLength(40)]
        public string editWho { get; set; }

        public DateTime? editTime { get; set; }

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

        [MaxLength(1)]
        public string freePickGift { get; set; }

        public string allocationWhereSql { get; set; }

        [MaxLength(30)]
        public string refLineNo { get; set; }

        [MaxLength(30)]
        public string muid { get; set; }

        [MaxLength(50)]
        public string originalSku { get; set; }

        [MaxLength(1)]
        public string ignoreLocationControl { get; set; }

        public DateTime? expiryDate { get; set; }
    }
}