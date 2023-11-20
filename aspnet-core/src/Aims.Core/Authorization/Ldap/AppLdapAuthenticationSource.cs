using Abp.Zero.Ldap.Authentication;
using Abp.Zero.Ldap.Configuration;
using Aims.Authorization.Users;
using Aims.MultiTenancy;

namespace Aims.Authorization.Ldap
{
    public class AppLdapAuthenticationSource : LdapAuthenticationSource<Tenant, User>
    {
        public AppLdapAuthenticationSource(ILdapSettings settings, IAbpZeroLdapModuleConfig ldapModuleConfig)
            : base(settings, ldapModuleConfig)
        {
        }
    }
}