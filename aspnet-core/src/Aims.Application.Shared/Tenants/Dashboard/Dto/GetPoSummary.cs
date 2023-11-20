using System.Collections.Generic;

namespace Aims.Tenants.Dashboard.Dto
{
   public class GetPoSummaryOutput
   {
        public GetPoSummaryOutput(List<PoSummaryData> poSummary)
        {
            PoSummary = poSummary;
        }

        public GetPoSummaryOutput()
        {
            PoSummary = new List<PoSummaryData>();
        }

        public List<PoSummaryData> PoSummary { get; }
   }
}
