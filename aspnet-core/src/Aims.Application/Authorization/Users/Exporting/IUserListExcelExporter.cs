using System.Collections.Generic;
using Aims.Authorization.Users.Dto;
using Aims.Dto;

namespace Aims.Authorization.Users.Exporting
{
    public interface IUserListExcelExporter
    {
        FileDto ExportToFile(List<UserListDto> userListDtos);
    }
}