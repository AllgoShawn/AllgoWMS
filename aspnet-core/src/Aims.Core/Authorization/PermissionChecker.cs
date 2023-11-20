using Abp.Authorization;
using Aims.Authorization.Roles;
using Aims.Authorization.Users;

namespace Aims.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {

        }
    }
}
