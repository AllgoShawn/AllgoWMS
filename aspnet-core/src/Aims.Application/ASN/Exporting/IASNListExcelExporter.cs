using System.Collections.Generic;
using Aims.Dto;

namespace Aims.ASN.Exporting
{
    public interface IASNListExcelExporter
    {
        FileDto ExportToFile(List<ASNMasterDto> asnListDtos);
    }
}