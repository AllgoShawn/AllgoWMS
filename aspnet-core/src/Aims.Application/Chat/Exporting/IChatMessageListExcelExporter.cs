using System.Collections.Generic;
using Aims.Chat.Dto;
using Aims.Dto;

namespace Aims.Chat.Exporting
{
    public interface IChatMessageListExcelExporter
    {
        FileDto ExportToFile(List<ChatMessageExportDto> messages);
    }
}
