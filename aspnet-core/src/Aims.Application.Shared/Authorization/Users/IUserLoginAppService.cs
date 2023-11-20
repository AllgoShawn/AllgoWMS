using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Aims.Authorization.Users.Dto;

namespace Aims.Authorization.Users
{
    public interface IUserLoginAppService : IApplicationService
    {
        Task<ListResultDto<UserLoginAttemptDto>> GetRecentUserLoginAttempts();
    }
}
