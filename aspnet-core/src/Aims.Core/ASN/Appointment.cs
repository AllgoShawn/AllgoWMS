using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Aims.ASN
{
    [Table("doc_asn_appointment")]
    public class Appointment : FullAuditedEntity<long>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        [MaxLength(20)]
        public string organizationId { get; set; }

        [MaxLength(20)]
        public string warehouseId { get; set; }

        [MaxLength(20)]
        public string asnNo { get; set; }

        [MaxLength(20)]
        public string appointmentNo { get; set; }

        [MaxLength(20)]
        public string vehicleNo { get; set; }

        [MaxLength(2)]
        public string asnAppStatus { get; set; }

        [MaxLength(20)]
        public string passCard { get; set; }

        [MaxLength(20)]
        public string driver { get; set; }

        [MaxLength(50)]
        public string dockNo { get; set; }

        public DateTime? entranceTime { get; set; }

        public DateTime? leaveTime { get; set; }

        public DateTime? startUnloadTime { get; set; }

        public DateTime? endUnloadTime { get; set; }

        public DateTime? dockAssignmentTime { get; set; }

        [MaxLength(1)]
        public string broadCast { get; set; }

        [MaxLength(1)]
        public string lockFlag { get; set; }

        [MaxLength(10)]
        public string seqNo { get; set; }

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

        [MaxLength(10)]
        public string vehicleType { get; set; }
    }
}
