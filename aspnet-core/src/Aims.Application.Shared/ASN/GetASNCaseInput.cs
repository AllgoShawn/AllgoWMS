using System;
using System.ComponentModel.DataAnnotations;
using Abp.Runtime.Validation;
using Aims.Dto;

namespace Aims.ASN
{
    public class GetASNCaseInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public long? id { get; set; }

        public string ctnType { get; set; }

        public string ctnSize { get; set; }

        public decimal ctnGrossWeight { get; set; }

        public string ctnSealNo1 { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = " ctnLineNo ASC ";
            }
        }
    }
}