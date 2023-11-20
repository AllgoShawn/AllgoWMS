using System;
using System.ComponentModel.DataAnnotations;
using Abp.Runtime.Validation;
using Aims.Dto;

namespace Aims.ASN
{
    public class GetASNDetailInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public long? id { get; set; }

        public string poNo { get; set; }

        public string asnNo { get; set; }

        public long ctnId { get; set; }

        public string sku { get; set; }

        public string skuDescr { get; set; }

        public decimal expectedQty { get; set; }

        public decimal orderedQty { get; set; }

        public int containerQty { get; set; }

        public string lotAtt01 { get; set; }

        public DateTime? expiryDate { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = " asnLineNo ASC ";
            }
        }
    }
}