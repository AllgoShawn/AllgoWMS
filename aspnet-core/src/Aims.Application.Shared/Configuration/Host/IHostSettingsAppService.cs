﻿using System.Threading.Tasks;
using Abp.Application.Services;
using Aims.Configuration.Host.Dto;

namespace Aims.Configuration.Host
{
    public interface IHostSettingsAppService : IApplicationService
    {
        Task<HostSettingsEditDto> GetAllSettings();

        Task UpdateAllSettings(HostSettingsEditDto input);

        Task SendTestEmail(SendTestEmailInput input);
    }
}
