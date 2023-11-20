using Abp.Domain.Services;

namespace Aims
{
    public abstract class AimsDomainServiceBase : DomainService
    {
        /* Add your common members for all your domain services. */

        protected AimsDomainServiceBase()
        {
            LocalizationSourceName = AimsConsts.LocalizationSourceName;
        }
    }
}
