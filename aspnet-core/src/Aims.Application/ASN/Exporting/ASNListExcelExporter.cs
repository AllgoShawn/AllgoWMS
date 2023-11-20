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

namespace Aims.ASN.Exporting
{
    public class ASNListExcelExporter : EpPlusExcelExporterBase, IASNListExcelExporter
    {
        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public ASNListExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager)
            : base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<ASNMasterDto> asnListDtos)
        {
            return CreateExcelPackage(
                "ASN_List_" + DateTime.Now.ToString("yyyyMMdd") + ".xlsx",
                excelPackage =>
                {
                    var sheet = excelPackage.Workbook.Worksheets.Add(L("ASN"));
                    sheet.OutLineApplyStyle = true;

                    AddHeader(
                        sheet,
                        L("ASNNo"),
                        L("PONo"),
                        L("Customer"),
                        L("Warehouse"),
                        L("Supplier"),
                        L("ETA"),
                        L("DeliverTo"),
                        L("CarrierName"),
                        L("Status")
                    );

                    AddObjects(
                        sheet, 2, asnListDtos,
                        _ => _.asnNo,
                        _ => _.poNo,
                        _ => _.customerId,
                        _ => _.warehouseId,
                        _ => _.supplierId,
                        _ => _timeZoneConverter.Convert(_.expectedArriveTime1, _abpSession.TenantId, _abpSession.GetUserId()),
                        _ => _.organizationId,
                        _ => _.carrierName,
                        _ => _.asnStatus
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
