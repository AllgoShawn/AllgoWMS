using System.Threading.Tasks;
using Aims.Sessions.Dto;

namespace Aims.Web.Session
{
    public interface IPerRequestSessionCache
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformationsAsync();
    }
}
