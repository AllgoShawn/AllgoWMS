using System;
using System.ComponentModel.DataAnnotations;
using Abp.Runtime.Validation;
using Aims.Dto;

namespace Aims.TransferOrders
{
    public class GetTransferOrderDetailsInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public int? Id { get; set; }

        public int? orderId { get; set; }
        public string sku { get; set; }
        public decimal qtyOrdered { get; set; }
        public string lotNum { get; set; }
        public DateTime? expiryDate { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = " orderLineNo ASC ";
            }
        }
    }
}