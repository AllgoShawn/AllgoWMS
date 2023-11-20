using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aims.MultiTenancy.HostDashboard.Dto;

namespace Aims.MultiTenancy.HostDashboard
{
    public interface IIncomeStatisticsService
    {
        Task<List<IncomeStastistic>> GetIncomeStatisticsData(DateTime startDate, DateTime endDate,
            ChartDateInterval dateInterval);
    }
}