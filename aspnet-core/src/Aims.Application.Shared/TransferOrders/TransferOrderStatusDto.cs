using System;
using System.Collections.Generic;
using System.Text;

namespace Aims.TransferOrders
{
    public class TransferOrderStatusDto : IEquatable<TransferOrderStatusDto>
    {
        public string organizationId { get; set; }

        public string warehouseId { get; set; }

        public string orderNo { get; set; }

        public string soStatus { get; set; }

        public bool Equals(TransferOrderStatusDto other)
        {
            //Check whether the compared object is null.
            if (Object.ReferenceEquals(other, null)) return false;

            //Check whether the compared object references the same data.
            if (Object.ReferenceEquals(this, other)) return true;

            //Check whether the properties are equal.
            return
                organizationId.Equals(other.organizationId) &&
                warehouseId.Equals(other.warehouseId) &&
                orderNo.Equals(other.orderNo) &&
                soStatus.Equals(other.soStatus);
        }

        public override int GetHashCode()
        {

            int hashOrganizationId = organizationId == null ? 0 : organizationId.GetHashCode();

            int hashWarehouseId = warehouseId == null ? 0 : warehouseId.GetHashCode();

            int hashOrderNo = orderNo == null ? 0 : orderNo.GetHashCode();

            int hashSOStatus = soStatus == null ? 0 : soStatus.GetHashCode();

            //Calculate the hash code.
            return (hashOrganizationId + hashWarehouseId + hashOrderNo + hashSOStatus);
        }
    }
}
