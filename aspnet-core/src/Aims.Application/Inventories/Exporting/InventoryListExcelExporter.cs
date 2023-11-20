using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Abp.Collections.Extensions;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using Aims.Authorization.Users.Dto;
using Aims.DataExporting.Excel.EpPlus;
using Aims.Dto;
using Aims.Storage;
using OfficeOpenXml;

namespace Aims.Inventories.Exporting
{
    public class InventoryListExcelExporter : EpPlusExcelExporterBase, IInventoryListExcelExporter
    {
        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public InventoryListExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager)
            : base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<InventoryMasterDto> inventoryListDtos)
        {
            return CreateExcelPackage(
                "Inventory_List_" + DateTime.Now.ToString("yyyyMMdd") + ".xlsx",
                excelPackage =>
                {
                    var sheet = excelPackage.Workbook.Worksheets.Add(L("Inventory"));
                    sheet.OutLineApplyStyle = true;

                    AddHeader(
                        sheet,
                        L("Organization"),
                        L("Warehouse"),
                        L("Item"),
                        L("LotNumber"),
                        L("Description"),
                        L("AvailableQty"),
                        L("AllocatedQty"),
                        L("Damaged"),
                        L("InTransit")
                    );

                    AddObjects(
                        sheet, 2, inventoryListDtos,
                        _ => _.organizationId,
                        _ => _.warehouseId,
                        _ => _.sku,
                        _ => _.lotNum,
                        _ => _.descr,
                        _ => _.qty,
                        _ => _.qtyAllocated,
                        _ => _.qtyDamaged,
                        _ => _.qtyInTransit
                        );

                    //Formatting cells

                    var creationTimeColumn = sheet.Column(9);
                    creationTimeColumn.Style.Numberformat.Format = "yyyy-mm-dd";

                    for (var i = 1; i <= 9; i++)
                    {
                        sheet.Column(i).AutoFit();
                    }
                });
        }
    }
}
