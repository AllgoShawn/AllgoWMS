using Abp.Application.Services.Dto;
using System;

namespace Aims.Warehouses.Dto
{
    public class WarehouseMasterDto : AuditedEntityDto<long>
    {
        public int? tenantId { get; set; }

        public string whse_code { get; set; }

        public string whse_name { get; set; }

        public string status { get; set; }

        public string country { get; set; }

        public string state { get; set; }

        public string city { get; set; }

        public string address { get; set; }

        public string address1 { get; set; }

        public string address2 { get; set; }

        public string zip { get; set; }

        public string contact { get; set; }

        public string contact_tel { get; set; }

        public string contact_fax { get; set; }

        public string contact_email { get; set; }

        public string contact_title { get; set; }

        public string remarks { get; set; }

        public string lookupDesc { get; set; }
    }
}
