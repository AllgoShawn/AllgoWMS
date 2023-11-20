using System;
using System.ComponentModel.DataAnnotations;
using Abp.Runtime.Validation;
using Aims.Dto;

namespace Aims.PO
{
    public class GetPOMasterInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public string Filter { get; set; }
        public string POFilter { get; set; }
        public string CustomerFilter { get; set; }
        public string WarehouseFilter { get; set; }
        public string DeliverToFilter { get; set; }
        public string StatusFilter { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = " ISNULL(CreationTime, LastModificationTime) DESC ";
            }
        }
    }
}