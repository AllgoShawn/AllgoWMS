using System;
using System.ComponentModel.DataAnnotations;
using Abp.Runtime.Validation;
using Aims.Dto;

namespace Aims.ASN
{
    public class GetASNMasterInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public long? id { get; set; }
        public string Filter { get; set; }
        public string POFilter { get; set; }
        public string ASNFilter { get; set; }
        public string CustomerFilter { get; set; }
        public string WarehouseFilter { get; set; }
        public string StatusFilter { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public int FormatId { get; set; }

        public string asnNo { get; set; }

        public string poNo { get; set; }

        public DateTime expectedArriveTime1 { get; set; }

        public string carrierName { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = " ISNULL(CreationTime, LastModificationTime) DESC ";
            }
        }
    }
}