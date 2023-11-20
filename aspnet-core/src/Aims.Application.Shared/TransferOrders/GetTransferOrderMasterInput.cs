using System;
using System.ComponentModel.DataAnnotations;
using Abp.Runtime.Validation;
using Aims.Dto;

namespace Aims.TransferOrders
{
    public class GetTransferOrderMasterInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public int? Id { get; set; }

        public string Filter { get; set; }
        public string OrderNoFilter { get; set; }
        public string TransferFromFilter { get; set; }
        public string TransferToFilter { get; set; }
        public string StatusFilter { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public string organizationId { get; set; }
        public string warehouseId { get; set; }
        public string consigneeId { get; set; }
        public DateTime requiredDeliveryTime { get; set; }
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