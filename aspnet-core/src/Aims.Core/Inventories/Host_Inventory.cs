using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Aims.Inventories
{
    [Table("inv_lot_loc_id")]
    public class Host_Inventory : FullAuditedEntity<long>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        [MaxLength(20)]
        public string organizationId { get; set; }

        [MaxLength(20)]
        public string warehouseId { get; set; }

        [MaxLength(60)]
        public string locationId { get; set; }

        [MaxLength(10)]
        public string lotNum { get; set; }

        [MaxLength(30)]
        public string traceId { get; set; }

        [MaxLength(30)]
        public string customerId { get; set; }

        [MaxLength(50)]
        public string sku { get; set; }

        public decimal qty { get; set; }

        public decimal qtyAllocated { get; set; }

        public decimal qtyRpIn { get; set; }

        public decimal qtyRpOut { get; set; }

        public decimal qtyMvIn { get; set; }

        public decimal qtyMvOut { get; set; }

        public decimal qtyOnHold { get; set; }

        public int onHoldLocker { get; set; }

        public decimal grossWeight { get; set; }

        public decimal netWeight { get; set; }

        public decimal cubic { get; set; }

        public decimal price { get; set; }

        [MaxLength(30)]
        public string muid { get; set; }

        public decimal qtyPa { get; set; }

        [MaxLength(20)]
        public string qcStatus { get; set; }

        public DateTime? lastMaintenanceDate { get; set; }

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

        [MaxLength(40)]
        public string addWho { get; set; }

        public DateTime? addTime { get; set; }

        [MaxLength(40)]
        public string editWho { get; set; }

        public DateTime? editTime { get; set; }

        public DateTime? inLocTime { get; set; }
    }
}
