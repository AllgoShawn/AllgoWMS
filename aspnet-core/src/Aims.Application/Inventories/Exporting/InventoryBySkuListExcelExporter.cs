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
    public class InventoryBySkuListExcelExporter : EpPlusExcelExporterBase, IInventoryBySkuListExcelExporter
    {
        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public InventoryBySkuListExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager)
            : base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<InventoryBySkuMasterDto> inventoryBySkuListDtos)
        {
            return CreateExcelPackage(
                "InventoryBySku_List_" + DateTime.Now.ToString("yyyyMMdd") + ".xlsx",
                excelPackage =>
                {
                    var sheet = excelPackage.Workbook.Worksheets.Add(L("InventoryBySku"));
                    sheet.OutLineApplyStyle = true;

                    AddHeader(
                        sheet,
                        L("SKU"),
                        L("Warehouse"),
                        L("Status"),
                        L("Quantity"),
                        L("Information")
                    );

                    AddObjects(
                        sheet, 2, inventoryBySkuListDtos,
                        _ => _.sku,
                        _ => _.warehouseId,
                        _ => _.qcStatus,
                        _ => _.qty,
                        _ => _.noteText
                        );

                    //Formatting cells

                    var creationTimeColumn = sheet.Column(9);
                    creationTimeColumn.Style.Numberformat.Format = "yyyy-mm-dd";

                    for (var i = 1; i <= 5; i++)
                    {
                        sheet.Column(i).AutoFit();
                    }
                });
        }
    }
}
