using Microsoft.Extensions.Configuration;

namespace Aims.Configuration
{
    public interface IAppConfigurationAccessor
    {
        IConfigurationRoot Configuration { get; }
    }
}
