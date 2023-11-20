using System.Collections.Generic;
using Aims.Authorization.Users.Importing.Dto;
using Aims.Dto;

namespace Aims.Authorization.Users.Importing
{
    public interface IInvalidUserExporter
    {
        FileDto ExportToFile(List<ImportUserDto> userListDtos);
    }
}
