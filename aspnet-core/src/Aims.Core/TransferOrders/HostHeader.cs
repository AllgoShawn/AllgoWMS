using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Aims.TransferOrders
{
    [Table("doc_transfer_header")]
    public class HostHeader : FullAuditedEntity<long>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        [MaxLength(20)]
        public string organizationId { get; set; }

        [MaxLength(20)]
        public string warehouseId { get; set; }

        [MaxLength(20)]
        public string orderNo { get; set; }

        [MaxLength(20)]
        public string orderType { get; set; }

        [MaxLength(2)]
        public string soStatus { get; set; }

        public DateTime orderTime { get; set; }

        public DateTime expectedShipmentTime1 { get; set; }

        public DateTime? expectedShipmentTime2 { get; set; }

        public DateTime? requiredDeliveryTime { get; set; }

        [MaxLength(30)]
        public string customerId { get; set; }

        [MaxLength(50)]
        public string soReference1 { get; set; }

        [MaxLength(50)]
        public string soReference2 { get; set; }

        [MaxLength(50)]
        public string soReference3 { get; set; }

        [MaxLength(50)]
        public string soReference4 { get; set; }

        [MaxLength(50)]
        public string soReference5 { get; set; }

        [MaxLength(1)]
        public string releaseStatus { get; set; }

        [MaxLength(1)]
        public string priority { get; set; }

        [MaxLength(30)]
        public string consigneeId { get; set; }

        [MaxLength(250)]
        public string consigneeName { get; set; }

        [MaxLength(500)]
        public string consigneeAddress1 { get; set; }

        [MaxLength(200)]
        public string consigneeAddress2 { get; set; }

        [MaxLength(100)]
        public string consigneeAddress3 { get; set; }

        [MaxLength(100)]
        public string consigneeAddress4 { get; set; }

        [MaxLength(50)]
        public string consigneeCity { get; set; }

        [MaxLength(50)]
        public string consigneeProvince { get; set; }

        [MaxLength(20)]
        public string consigneeCountry { get; set; }

        [MaxLength(30)]
        public string consigneeZip { get; set; }

        [MaxLength(200)]
        public string consigneeContact { get; set; }

        [MaxLength(100)]
        public string consigneeEmail { get; set; }

        [MaxLength(100)]
        public string consigneeFax { get; set; }

        [MaxLength(250)]
        public string consigneeTel1 { get; set; }

        [MaxLength(250)]
        public string consigneeTel2 { get; set; }

        [MaxLength(30)]
        public string billingId { get; set; }

        [MaxLength(250)]
        public string billingName { get; set; }

        [MaxLength(500)]
        public string billingAddress1 { get; set; }

        [MaxLength(200)]
        public string billingAddress2 { get; set; }

        [MaxLength(100)]
        public string billingAddress3 { get; set; }

        [MaxLength(100)]
        public string billingAddress4 { get; set; }

        [MaxLength(50)]
        public string billingCity { get; set; }

        [MaxLength(50)]
        public string billingProvince { get; set; }

        [MaxLength(20)]
        public string billingCountry { get; set; }

        [MaxLength(30)]
        public string billingZip { get; set; }

        [MaxLength(200)]
        public string billingContact { get; set; }

        [MaxLength(100)]
        public string billingEmail { get; set; }

        [MaxLength(100)]
        public string billingFax { get; set; }

        [MaxLength(250)]
        public string billingTel1 { get; set; }

        [MaxLength(250)]
        public string billingTel2 { get; set; }

        [MaxLength(10)]
        public string deliveryTerms { get; set; }

        [MaxLength(100)]
        public string deliveryTermsDescr { get; set; }

        [MaxLength(10)]
        public string paymentTerms { get; set; }

        [MaxLength(100)]
        public string paymentTermsDescr { get; set; }

        [MaxLength(100)]
        public string transportation { get; set; }

        [MaxLength(10)]
        public string door { get; set; }

        [MaxLength(30)]
        public string route { get; set; }

        [MaxLength(100)]
        public string placeOfLoading { get; set; }

        [MaxLength(100)]
        public string placeOfDischarge { get; set; }

        [MaxLength(100)]
        public string placeOfDelivery { get; set; }

        [MaxLength(30)]
        public string carrierId { get; set; }

        [MaxLength(200)]
        public string carrierName { get; set; }

        [MaxLength(200)]
        public string carrierAddress1 { get; set; }

        [MaxLength(100)]
        public string carrierAddress2 { get; set; }

        [MaxLength(200)]
        public string carrierAddress3 { get; set; }

        [MaxLength(100)]
        public string carrierAddress4 { get; set; }

        [MaxLength(50)]
        public string carrierCity { get; set; }

        [MaxLength(50)]
        public string carrierProvince { get; set; }

        [MaxLength(20)]
        public string carrierCountry { get; set; }

        [MaxLength(10)]
        public string carrierZip { get; set; }

        [MaxLength(200)]
        public string carrierContact { get; set; }

        [MaxLength(50)]
        public string carrierEmail { get; set; }

        [MaxLength(50)]
        public string carrierFax { get; set; }

        [MaxLength(50)]
        public string carrierTel1 { get; set; }

        [MaxLength(50)]
        public string carrierTel2 { get; set; }

        [MaxLength(30)]
        public string issuePartyId { get; set; }

        [MaxLength(200)]
        public string issuePartyName { get; set; }

        [MaxLength(200)]
        public string issuePartyAddress1 { get; set; }

        [MaxLength(200)]
        public string issuePartyAddress2 { get; set; }

        [MaxLength(100)]
        public string issuePartyAddress3 { get; set; }

        [MaxLength(100)]
        public string issuePartyAddress4 { get; set; }

        [MaxLength(50)]
        public string issuePartyCity { get; set; }

        [MaxLength(50)]
        public string issuePartyProvince { get; set; }

        [MaxLength(20)]
        public string issuePartyCountry { get; set; }

        [MaxLength(10)]
        public string issuePartyZip { get; set; }

        [MaxLength(200)]
        public string issuePartyContact { get; set; }

        [MaxLength(100)]
        public string issuePartyEmail { get; set; }

        [MaxLength(50)]
        public string issuePartyFax { get; set; }

        [MaxLength(50)]
        public string issuePartyTel1 { get; set; }

        [MaxLength(40)]
        public string issuePartyTel2 { get; set; }

        [MaxLength(200)]
        public string hedi01 { get; set; }

        [MaxLength(200)]
        public string hedi02 { get; set; }

        [MaxLength(200)]
        public string hedi03 { get; set; }

        [MaxLength(200)]
        public string hedi04 { get; set; }

        [MaxLength(200)]
        public string hedi05 { get; set; }

        [MaxLength(200)]
        public string hedi06 { get; set; }

        [MaxLength(200)]
        public string hedi07 { get; set; }

        [MaxLength(200)]
        public string hedi08 { get; set; }

        public decimal? hedi09 { get; set; }

        public decimal? hedi10 { get; set; }

        [MaxLength(1)]
        public string ediSendFlag { get; set; }

        public DateTime? ediSendTime2 { get; set; }

        public DateTime? ediSendTime3 { get; set; }

        [MaxLength(1)]
        public string rfGetTask { get; set; }

        [MaxLength(1)]
        public string erpCancelFlag { get; set; }

        [MaxLength(20)]
        public string singleMatch { get; set; }

        [MaxLength(1)]
        public string serialNoCatch { get; set; }

        [MaxLength(1)]
        public string requireDeliveryNo { get; set; }

        [MaxLength(1)]
        public string archiveFlag { get; set; }

        [MaxLength(1)]
        public string ful_alc { get; set; }

        [MaxLength(50)]
        public string channel { get; set; }

        [MaxLength(1)]
        public string weightingFlag { get; set; }

        [MaxLength(1)]
        public string allowShipment { get; set; }

        [MaxLength(50)]
        public string ediCarrierFlag { get; set; }

        public DateTime? lastShipmentTime { get; set; }

        [MaxLength(35)]
        public string createSource { get; set; }

        [MaxLength(20)]
        public string zoneGroup { get; set; }

        public DateTime? medicalXmlTime { get; set; }

        [MaxLength(20)]
        public string followUp { get; set; }

        [MaxLength(20)]
        public string salesOrderno { get; set; }

        [MaxLength(60)]
        public string putToLocation { get; set; }

        [MaxLength(30)]
        public string deliveryNo { get; set; }

        public int allocationCount { get; set; }

        [MaxLength(20)]
        public string waveNo { get; set; }

        [MaxLength(50)]
        public string cartonGroup { get; set; }

        [MaxLength(50)]
        public string cartonId { get; set; }

        [MaxLength(20)]
        public string orderGroupNo { get; set; }

        [MaxLength(20)]
        public string transServiceLevel { get; set; }

        [MaxLength(200)]
        public string orderHandleInstruction { get; set; }

        public decimal totalCubic { get; set; }

        public decimal totalGrossWeight { get; set; }

        public decimal totalNetWeight { get; set; }

        public decimal totalPrice { get; set; }

        public int totalLineCount { get; set; }

        public int curLineNo { get; set; }

        public int totalSkuCount { get; set; }

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
        public string locGroup1List { get; set; }

        [MaxLength(100)]
        public string locGroup2List { get; set; }

        [MaxLength(1)]
        public string allowPartialShip { get; set; }

        [MaxLength(20)]
        public string waveRule { get; set; }

        [MaxLength(50)]
        public string consigneeDistrict { get; set; }

        [MaxLength(50)]
        public string consigneeStreet { get; set; }

        [MaxLength(50)]
        public string carrierDistrict { get; set; }

        [MaxLength(50)]
        public string carrierStreet { get; set; }

        [MaxLength(50)]
        public string billingDistrict { get; set; }

        [MaxLength(50)]
        public string billingStreet { get; set; }

        [MaxLength(50)]
        public string issuePartyDistrict { get; set; }

        [MaxLength(50)]
        public string issuePartyStreet { get; set; }

        [MaxLength(50)]
        public string parcelMark { get; set; }

        [MaxLength(50)]
        public string parcelConsolidation { get; set; }

        [MaxLength(10)]
        public string stopStation { get; set; }

        [MaxLength(1)]
        public string warehouseTransferFlag { get; set; }

        public int shipmentCount { get; set; }

        public DateTime? ediSendTime { get; set; }

        [MaxLength(50)]
        public string ediErrorCode { get; set; }

        public string ediErrorMessage { get; set; }

        [MaxLength(1)]
        public string ediSendFlag2 { get; set; }

        [MaxLength(50)]
        public string ediErrorCode2 { get; set; }

        public string ediErrorMessage2 { get; set; }

        [MaxLength(1)]
        public string ediSendFlag3 { get; set; }

        [MaxLength(50)]
        public string ediErrorCode3 { get; set; }

        public string ediErrorMessage3 { get; set; }

        [MaxLength(50)]
        public string expressPlatform { get; set; }

        [MaxLength(50)]
        public string ocpNo { get; set; }

        [MaxLength(100)]
        public string vehicleNo { get; set; }

        [MaxLength(20)]
        public string vehicleType { get; set; }

        [MaxLength(100)]
        public string driver { get; set; }

        [MaxLength(50)]
        public string hedi11 { get; set; }

        [MaxLength(50)]
        public string hedi12 { get; set; }

        [MaxLength(50)]
        public string hedi13 { get; set; }

        [MaxLength(50)]
        public string hedi14 { get; set; }

        [MaxLength(50)]
        public string hedi15 { get; set; }

        [MaxLength(50)]
        public string hedi16 { get; set; }

        [MaxLength(50)]
        public string hedi17 { get; set; }

        [MaxLength(50)]
        public string hedi18 { get; set; }

        [MaxLength(50)]
        public string hedi19 { get; set; }

        [MaxLength(50)]
        public string hedi20 { get; set; }

        [MaxLength(1)]
        public string splitFlag { get; set; }

        [MaxLength(20)]
        public string reverseOrderNo { get; set; }

        [MaxLength(20)]
        public string shop { get; set; }

        [MaxLength(1)]
        public string taskFlag { get; set; }

        public decimal? totalQty { get; set; }

        [MaxLength(20)]
        public string rpGroupId { get; set; }

        [MaxLength(50)]
        public string REF1 { get; set; }

        [MaxLength(1)]
        public string crossdockFlag { get; set; }

        [MaxLength(30)]
        public string shopId { get; set; }

        [MaxLength(20)]
        public string parentOrderNo { get; set; }
    }
}
