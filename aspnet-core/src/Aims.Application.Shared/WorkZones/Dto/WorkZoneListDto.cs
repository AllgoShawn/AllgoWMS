using System;
using Abp.Application.Services.Dto;

namespace Aims.WorkZones.Dto
{
    public class WorkZoneListDto : EntityDto<long>
    {
        public string Code { get; set; }

        public string Type { get; set; }

        public string WarehouseCode { get; set; }

        public long? WarehouseId { get; set; }

        public DateTime? UpdatedTime { get; set; }

        public int MemberCount { get; set; }
    }
}