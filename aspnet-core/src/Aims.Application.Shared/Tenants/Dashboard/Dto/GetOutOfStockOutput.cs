using System.Collections.Generic;

namespace Aims.Tenants.Dashboard.Dto
{
   public class GetOutOfStockOutput
    {
        public GetOutOfStockOutput(List<OutOfStockItem> stats)
        {
            Stats = stats;
        }

        public GetOutOfStockOutput()
        {
            Stats = new List<OutOfStockItem>();
        }
            
        public List<OutOfStockItem> Stats { get;}
    }
}
