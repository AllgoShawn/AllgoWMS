using System;
using System.Collections.Generic;
using System.Text;

namespace Aims.Tenants.Dashboard.Dto
{
    public class PoSummaryData
    {
        public int totalOpenPO { get; set; }

        public int percentTotalOpenPO { get; set; }

        public int totalOpenLine { get; set;}

        public decimal percentTotalOpenLine { get; set; }

        public int totalOpenQty { get; set;}

        public decimal percentTotalOpenQty { get; set;}
    }
}
