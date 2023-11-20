using System.ComponentModel.DataAnnotations;

namespace Aims.Authorization.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}
