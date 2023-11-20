using System.Collections.Generic;
using Aims.Dto;

namespace Aims.Inventories.Exporting
{
    public interface IInventoryBySkuListExcelExporter
    {
        FileDto ExportToFile(List<InventoryBySkuMasterDto> inventoryBySkuListDtos);
    }
}
