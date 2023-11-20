using System.Threading.Tasks;

namespace Aims.Net.Sms
{
    public interface ISmsSender
    {
        Task SendAsync(string number, string message);
    }
}