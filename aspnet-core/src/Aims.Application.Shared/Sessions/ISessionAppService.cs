using System.Threading.Tasks;
using Abp.Application.Services;
using Aims.Sessions.Dto;

namespace Aims.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();

        Task<UpdateUserSignInTokenOutput> UpdateUserSignInToken();
    }
}
