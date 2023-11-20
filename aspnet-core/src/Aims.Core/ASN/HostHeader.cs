using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Aims.ASN
{
    [Table("doc_asn_header")]
    public class HostHeader : FullAuditedEntity<long>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        [MaxLength(20)]
        public string organizationId { get; set; }

        [MaxLength(20)]
        public string warehouseId { get; set; }

        [MaxLength(20)]
        public string asnNo { get; set; }

        [MaxLength(20)]
        public string asnType { get; set; }

        [MaxLength(2)]
        public string asnStatus { get; set; }

        [MaxLength(30)]
        public string customerId { get; set; }

        public DateTime asnCreationTime { get; set; }

        public DateTime? expectedArriveTime1 { get; set; }

        public DateTime? expectedArriveTime2 { get; set; }

        [MaxLength(50)]
        public string asnReference1 { get; set; }

        [MaxLength(50)]
        public string asnReference2 { get; set; }

        [MaxLength(50)]
        public string asnReference3 { get; set; }

        [MaxLength(50)]
        public string asnReference4 { get; set; }

        [MaxLength(50)]
        public string asnReference5 { get; set; }

        [MaxLength(50)]
        public string door { get; set; }

        [MaxLength(30)]
        public string carrierId { get; set; }

        [MaxLength(200)]
        public string carrierName { get; set; }

        [MaxLength(200)]
        public string carrierContact { get; set; }

        [MaxLength(100)]
        public string carrierMail { get; set; }

        [MaxLength(50)]
        public string carrierFax { get; set; }

        [MaxLength(40)]
        public string carrierTel1 { get; set; }

        [MaxLength(40)]
        public string carrierTel2 { get; set; }

        [MaxLength(200)]
        public string carrierAddress1 { get; set; }

        [MaxLength(200)]
        public string carrierAddress2 { get; set; }

        [MaxLength(100)]
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

        [MaxLength(2)]
        public string countryOfOrigin { get; set; }

        [MaxLength(2)]
        public string countryOfDestination { get; set; }

        [MaxLength(60)]
        public string placeOfLoading { get; set; }

        [MaxLength(60)]
        public string placeOfDischarge { get; set; }

        [MaxLength(60)]
        public string placeOfDelivery { get; set; }

        [MaxLength(4)]
        public string paymentTerms { get; set; }

        [MaxLength(100)]
        public string paymentTermsDescr { get; set; }

        [MaxLength(10)]
        public string deliveryTerms { get; set; }

        [MaxLength(100)]
        public string deliveryTermsDescr { get; set; }

        [MaxLength(20)]
        public string poNo { get; set; }

        [MaxLength(35)]
        public string createSource { get; set; }

        [MaxLength(1)]
        public string byTrace_Flag { get; set; }

        [MaxLength(1)]
        public string reserve_Flag { get; set; }

        public long? receiveId { get; set; }

        [MaxLength(30)]
        public string supplierId { get; set; }

        [MaxLength(200)]
        public string supplierName { get; set; }

        [MaxLength(200)]
        public string supplierContact { get; set; }

        [MaxLength(100)]
        public string supplierMail { get; set; }

        [MaxLength(50)]
        public string supplierFax { get; set; }

        [MaxLength(50)]
        public string supplierTel1 { get; set; }

        [MaxLength(40)]
        public string supplierTel2 { get; set; }

        [MaxLength(200)]
        public string supplierAddress1 { get; set; }

        [MaxLength(200)]
        public string supplierAddress2 { get; set; }

        [MaxLength(100)]
        public string supplierAddress3 { get; set; }

        [MaxLength(100)]
        public string supplierAddress4 { get; set; }

        [MaxLength(50)]
        public string supplierCity { get; set; }

        [MaxLength(50)]
        public string supplierProvince { get; set; }

        [MaxLength(20)]
        public string supplierCountry { get; set; }

        [MaxLength(10)]
        public string supplierZip { get; set; }

        [MaxLength(10)]
        public string billingClass_Group { get; set; }

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

        [MaxLength(30)]
        public string issuePartyId { get; set; }

        [MaxLength(200)]
        public string issuePartyName { get; set; }

        [MaxLength(200)]
        public string issuePartyContact { get; set; }

        [MaxLength(100)]
        public string issuePartyMail { get; set; }

        [MaxLength(50)]
        public string issuePartyFax { get; set; }

        [MaxLength(50)]
        public string issuePartyTel1 { get; set; }

        [MaxLength(40)]
        public string issuePartyTel2 { get; set; }

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

        [MaxLength(30)]
        public string billingId { get; set; }

        [MaxLength(200)]
        public string billingName { get; set; }

        [MaxLength(200)]
        public string billingContact { get; set; }

        [MaxLength(100)]
        public string billingMail { get; set; }

        [MaxLength(50)]
        public string billingFax { get; set; }

        [MaxLength(50)]
        public string billingTel1 { get; set; }

        [MaxLength(40)]
        public string billingTel2 { get; set; }

        [MaxLength(200)]
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

        [MaxLength(10)]
        public string billingZip { get; set; }

        [MaxLength(1)]
        public string asnPrintFlag { get; set; }

        [MaxLength(2)]
        public string qcStatus { get; set; }

        [MaxLength(1)]
        public string returnPrintFlag { get; set; }

        [MaxLength(20)]
        public string zoneGroup { get; set; }

        [MaxLength(1)]
        public string priority { get; set; }

        [MaxLength(1)]
        public string releaseStatus { get; set; }

        [MaxLength(1)]
        public string packMaterialConsume { get; set; }

        public DateTime? medicalXMLTime { get; set; }

        [MaxLength(20)]
        public string followUp { get; set; }

        [MaxLength(1)]
        public string serialNoCatch { get; set; }

        [MaxLength(20)]
        public string userDefineA { get; set; }

        [MaxLength(20)]
        public string userDefineB { get; set; }

        public DateTime? lastReceivingTime { get; set; }

        public DateTime? actualArriveTime { get; set; }

        [MaxLength(1)]
        public string archiveFlag { get; set; }

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

        [MaxLength(500)]
        public string udf07 { get; set; }

        [MaxLength(500)]
        public string udf08 { get; set; }

        [MaxLength(500)]
        public string udf09 { get; set; }

        [MaxLength(500)]
        public string udf10 { get; set; }

        public int currentVersion { get; set; }

        [MaxLength(65)]
        public string oprSeqFlag { get; set; }

        [MaxLength(50)]
        public string supplierDistrict { get; set; }

        [MaxLength(50)]
        public string supplierStreet { get; set; }

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

        [MaxLength(100)]
        public string erpCancelReason { get; set; }

        [MaxLength(1)]
        public string ediSendFlag { get; set; }

        [MaxLength(50)]
        public string ediErrorCode { get; set; }

        public string ediErrorMessage { get; set; }

        public DateTime? ediSendTime { get; set; }

        [MaxLength(1)]
        public string ediSendFlag2 { get; set; }

        [MaxLength(50)]
        public string ediErrorCode2 { get; set; }

        public string ediErrorMessage2 { get; set; }

        public DateTime? ediSendTime2 { get; set; }

        [MaxLength(1)]
        public string ediSendFlag3 { get; set; }

        [MaxLength(50)]
        public string ediErrorCode3 { get; set; }

        public string ediErrorMessage3 { get; set; }

        public DateTime? ediSendTime3 { get; set; }

        [MaxLength(50)]
        public string ocpNo { get; set; }

        [MaxLength(1)]
        public string splitFlag { get; set; }

        [MaxLength(20)]
        public string reverseAsnNo { get; set; }

        [MaxLength(10)]
        public string orderSource { get; set; }

        public decimal? totalQty { get; set; }
    }
}
