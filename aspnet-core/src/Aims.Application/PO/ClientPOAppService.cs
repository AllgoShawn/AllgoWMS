using Abp.Application.Services.Dto;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Threading.Tasks;

namespace Aims.PO
{
    public class ClientPOAppService : AimsAppServiceBase
    {
        private readonly IDapperRepository<PO.HostHeader, long> _clientPOHeaderDapperRepository;

        public ClientPOAppService
        (
            IDapperRepository<PO.HostHeader, long> clientPOHeaderDapperRepository
        )
        {
            _clientPOHeaderDapperRepository = clientPOHeaderDapperRepository;
        }

        public async Task<PagedResultDto<POMasterDto>> GetPOListing(GetPOMasterInput input)
        {

            var countQuery = $@"
                                SELECT * FROM doc_po_header
                               ";

            var selectQuery = $@"
                                SELECT * FROM doc_po_header ORDER BY addTime DESC LIMIT {input.SkipCount},{input.MaxResultCount}
                               ";

            var counts = _clientPOHeaderDapperRepository.Query(countQuery);

            var countDto = ObjectMapper.Map<List<POMasterDto>>(counts);

            var pOList = _clientPOHeaderDapperRepository.Query(selectQuery);

            var pOListDto = ObjectMapper.Map<List<POMasterDto>>(pOList);

            return new PagedResultDto<POMasterDto>(countDto.Count, pOListDto);
        }
    }
}
