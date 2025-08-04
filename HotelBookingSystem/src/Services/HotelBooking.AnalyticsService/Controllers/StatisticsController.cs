using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using HotelBooking.Models.DTOs;
using HotelBooking.AnalyticsService.Services;

namespace HotelBooking.AnalyticsService.Controllers
{
    [Route("api/statistics")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly StatisticsService _statisticsService;

        public StatisticsController(StatisticsService statisticsService)
        {
            _statisticsService = statisticsService;
        }

        [HttpGet("quick")]
        public async Task<ActionResult<QuickStatsDto>> GetQuickStatistics()
        {
            var stats = await _statisticsService.GetQuickStatisticsAsync();
            return Ok(stats);
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<DashboardStatsDto>> GetDashboardStatistics()
        {
            var stats = await _statisticsService.GetDashboardStatisticsAsync();
            return Ok(stats);
        }

        [HttpGet("occupancy/current")]
        public async Task<ActionResult<double>> GetCurrentOccupancyRate()
        {
            var rate = await _statisticsService.GetCurrentOccupancyRateAsync();
            return Ok(rate);
        }

        [HttpGet("revenue/today")]
        public async Task<ActionResult<decimal>> GetTodayRevenue()
        {
            var revenue = await _statisticsService.GetTodayRevenueAsync();
            return Ok(revenue);
        }

        [HttpGet("bookings/upcoming")]
        public async Task<ActionResult<List<UpcomingBookingDto>>> GetUpcomingBookings([FromQuery] int days = 7)
        {
            var bookings = await _statisticsService.GetUpcomingBookingsAsync(days);
            return Ok(bookings);
        }
    }
}
