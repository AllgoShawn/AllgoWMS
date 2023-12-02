using Abp.Runtime.Validation;
using Aims.Dto;
using System;
using System.Globalization;

namespace Aims.Warehouses.Dto
{
    public class GetWarehouseMasterInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public long? id { get; set; }

        public string Filter { get; set; }

        public string whseCodeFilter { get; set; }

        public string whseNameFilter { get; set; }

        public string whseStatusFilter { get; set; }    

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
        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = " ISNULL(CreationTime, LastModificationTime) DESC ";
            }
        }
    }
}
