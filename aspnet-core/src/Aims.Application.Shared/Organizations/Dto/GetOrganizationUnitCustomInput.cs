using System.ComponentModel.DataAnnotations;
using Abp.Runtime.Validation;
using Aims.Dto;

namespace Aims.Organizations.Dto
{
    public class GetOrganizationUnitCustomInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public int ItemId { get; set; }
        public string StoreCode { get; set; }
        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "Code";
            }
        }
    }
}