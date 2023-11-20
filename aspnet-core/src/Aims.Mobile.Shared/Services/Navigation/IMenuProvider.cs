using System.Collections.Generic;
using MvvmHelpers;
using Aims.Models.NavigationMenu;

namespace Aims.Services.Navigation
{
    public interface IMenuProvider
    {
        ObservableRangeCollection<NavigationMenuItem> GetAuthorizedMenuItems(Dictionary<string, string> grantedPermissions);
    }
}