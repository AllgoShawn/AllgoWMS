using Abp.Application.Services.Dto;
using System;

namespace Aims.PO
{
    public class POStatusDto : IEquatable<POStatusDto>
    {
        public string organizationId { get; set; }

        public string warehouseId { get; set; }

        public string poNo { get; set; }

        public string poStatus { get; set; }

        public bool Equals(POStatusDto other)
        {
            //Check whether the compared object is null.
            if (Object.ReferenceEquals(other, null)) return false;

            //Check whether the compared object references the same data.
            if (Object.ReferenceEquals(this, other)) return true;

            //Check whether the properties are equal.
            return 
                organizationId.Equals(other.organizationId) &&
                warehouseId.Equals(other.warehouseId) && 
                poNo.Equals(other.poNo) &&
                poStatus.Equals(other.poStatus);
        }

        public override int GetHashCode()
        {

            int hashOrganizationId = organizationId == null ? 0 : organizationId.GetHashCode();

            int hashWarehouseId = warehouseId == null ? 0 : warehouseId.GetHashCode();

            int hashPONo = poNo == null ? 0 : poNo.GetHashCode();

            int hashPOStatus = poStatus == null ? 0 : poStatus.GetHashCode();

            //Calculate the hash code.
            return (hashOrganizationId + hashWarehouseId + hashPONo + hashPOStatus);
        }
    }
}
