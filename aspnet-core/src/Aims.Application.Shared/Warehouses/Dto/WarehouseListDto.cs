using System;
using Abp.Application.Services.Dto;

namespace Aims.Warehouses.Dto
{
    public class WarehouseListDto : EntityDto<long>
    {
        public string Code { get; set; }

        public DateTime? UpdatedTime { get; set; }

        public int MemberCount { get; set; }

        public int WorkZoneCount { get; set; }
    }
}