using Abp.Application.Services.Dto;

namespace Aims.Organizations.Dto
{
    public class OrganizationUnitDto : AuditedEntityDto<long>
    {
        public long? ParentId { get; set; }

        public string Code { get; set; }

        public string DisplayName { get; set; }

        public int WarehouseCount { get; set; }
        
        //public int RoleCount { get; set; }
    }
}