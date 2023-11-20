using System.Collections.Generic;
using Aims.Dto;

namespace Aims.Inventories.Exporting
{
    public interface IInventoryListExcelExporter
    {
        FileDto ExportToFile(List<InventoryMasterDto> inventoryListDtos);
    }
}