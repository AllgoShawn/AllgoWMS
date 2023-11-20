using System.Threading.Tasks;
using Abp.Application.Services;
using Aims.MultiTenancy.Payments.PayPal.Dto;

namespace Aims.MultiTenancy.Payments.PayPal
{
    public interface IPayPalPaymentAppService : IApplicationService
    {
        Task ConfirmPayment(long paymentId, string paypalOrderId);

        PayPalConfigurationDto GetConfiguration();
    }
}
