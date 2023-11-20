using System.ComponentModel.DataAnnotations;
using Abp.Runtime.Validation;
using Aims.Dto;

namespace Aims.PO
{
    public class GetPODetailsInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public int? Id { get; set; }

        public string PONo { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = " poLineNo ASC ";
            }
        }
    }
}