using System;
using System.Collections.Generic;
using System.Text;

namespace Aims.Inventories
{
    public class InventoryItemDto
    {
        public string sku { get; set; }

        public string warehouseId { get; set; }

        public decimal qty { get; set; }
    }
}
