using System.Collections.Generic;
using Aims.Authorization.Users.Importing.Dto;
using Abp.Dependency;

namespace Aims.Authorization.Users.Importing
{
    public interface IUserListExcelDataReader: ITransientDependency
    {
        List<ImportUserDto> GetUsersFromExcel(byte[] fileBytes);
    }
}
