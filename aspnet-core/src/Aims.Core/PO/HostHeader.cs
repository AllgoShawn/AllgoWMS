using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Aims.PO
{
    [Table("doc_po_header")]
    public class HostHeader : FullAuditedEntity<long>
    {
        [MaxLength(20)]
        public string organizationId { get; set; }

        [MaxLength(20)]
        public string warehouseId { get; set; }

        [MaxLength(20)]
        public string poNo { get; set; }

        [MaxLength(20)]
        public string poType { get; set; }

        [MaxLength(2)]
        public string poStatus { get; set; }

        [MaxLength(30)]
        public string customerId { get; set; }

        public DateTime poCreationTime { get; set; }

        public DateTime? expectedArriveTime1 { get; set; }

        public DateTime? expectedArriveTime2 { get; set; }

        [MaxLength(50)]
        public string poReference1 { get; set; }

        [MaxLength(50)]
        public string poReference2 { get; set; }

        [MaxLength(50)]
        public string poReference3 { get; set; }

        [MaxLength(50)]
        public string poReference4 { get; set; }

        [MaxLength(50)]
        public string poReference5 { get; set; }

        [MaxLength(30)]
        public string supplierId { get; set; }

        [MaxLength(200)]
        public string supplier_Name { get; set; }

        [MaxLength(200)]
        public string supplier_Address1 { get; set; }

        [MaxLength(200)]
        public string supplier_Address2 { get; set; }

        [MaxLength(100)]
        public string supplier_Address3 { get; set; }

        [MaxLength(100)]
        public string supplier_Address4 { get; set; }

        [MaxLength(50)]
        public string supplier_City { get; set; }

        [MaxLength(50)]
        public string supplier_Province { get; set; }

        [MaxLength(20)]
        public string supplier_Country { get; set; }

        [MaxLength(10)]
        public string supplier_Zip { get; set; }

        [MaxLength(200)]
        public string supplier_Contact { get; set; }

        [MaxLength(100)]
        public string supplier_Mail { get; set; }

        [MaxLength(50)]
        public string supplier_Fax { get; set; }

        [MaxLength(40)]
        public string supplier_Tel1 { get; set; }

        [MaxLength(40)]
        public string supplier_Tel2 { get; set; }

        [MaxLength(50)]
        public string supplier_District { get; set; }

        [MaxLength(50)]
        public string supplier_Street { get; set; }

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

        public DateTime? ediSendTime { get; set; }

        [MaxLength(1)]
        public string ediSendFlag { get; set; }

        [MaxLength(35)]
        public string createSource { get; set; }

        [MaxLength(1)]
        public string releaseStatus { get; set; }

        [MaxLength(20)]
        public string userDefineA { get; set; }

        [MaxLength(20)]
        public string userDefineB { get; set; }

        [MaxLength(1)]
        public string asnLinked { get; set; }

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

        public int currentVersion { get; set; }

        [MaxLength(65)]
        public string oprSeqFlag { get; set; }

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

        [MaxLength(50)]
        public string issuePartyDistrict { get; set; }

        [MaxLength(50)]
        public string issuePartyStreet { get; set; }

        [MaxLength(20)]
        public string reversePoNo { get; set; }

        [MaxLength(1)]
        public string erpCancelFlag { get; set; }

        [MaxLength(100)]
        public string erpCancelReason { get; set; }
    }
}
