﻿using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Aims.Authorization.Permissions.Dto;

namespace Aims.Authorization.Permissions
{
    public interface IPermissionAppService : IApplicationService
    {
        ListResultDto<FlatPermissionWithLevelDto> GetAllPermissions();
    }
}
