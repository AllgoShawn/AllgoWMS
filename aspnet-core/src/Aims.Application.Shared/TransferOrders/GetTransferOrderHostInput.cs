using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Runtime.Validation;
using Aims.Dto;

namespace Aims.TransferOrders
{
    public class GetTransferOrderHostInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public TransferOrderMasterDto orderMaster { get; set; }
        public List<TransferOrderDetailDto> orderDetail { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = " ISNULL(CreationTime, LastModificationTime) DESC ";
            }
        }
    }
}