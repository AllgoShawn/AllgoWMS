using System;
using System.Collections.Generic;

namespace Aims.Tenants.Dashboard.Dto
{
    public class OutOfStockItem
    {
        public string sku { get; set; }

        public string itemDesc { get; set; }

        public DateTime lstMvDt { get; set; }

        public decimal qty { get; set; }

        public string status { get; set;}
    }
}
