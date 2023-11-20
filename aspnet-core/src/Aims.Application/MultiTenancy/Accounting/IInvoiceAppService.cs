using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Aims.MultiTenancy.Accounting.Dto;

namespace Aims.MultiTenancy.Accounting
{
    public interface IInvoiceAppService
    {
        Task<InvoiceDto> GetInvoiceInfo(EntityDto<long> input);

        Task CreateInvoice(CreateInvoiceDto input);
    }
}
