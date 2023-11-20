using System.Collections.Generic;
using System.Threading.Tasks;
using Abp;
using Aims.Dto;

namespace Aims.Gdpr
{
    public interface IUserCollectedDataProvider
    {
        Task<List<FileDto>> GetFiles(UserIdentifier user);
    }
}
