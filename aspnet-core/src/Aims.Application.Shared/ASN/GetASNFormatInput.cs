using System;
using System.ComponentModel.DataAnnotations;
using Abp.Runtime.Validation;
using Aims.Dto;

namespace Aims.ASN
{
    public class GetASNFormatInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public long? id { get; set; }

        public string Filter { get; set; }

        public string Prefix { get; set; }

        public int HasDate { get; set; }

        public int IsActive { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = " Prefix ASC ";
            }
        }
    }
}
