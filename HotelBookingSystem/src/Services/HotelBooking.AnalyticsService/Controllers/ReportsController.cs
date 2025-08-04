using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using HotelBooking.AnalyticsService.Services;
using HotelBooking.Models.DTOs;

namespace HotelBooking.AnalyticsService.Controllers
{
    [ApiController]
    [Route("api/reports")]
    public class ReportsController : ControllerBase
    {
        private readonly ReportService _reportService;

        public ReportsController(ReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("weekly")]
        public async Task<ActionResult<WeeklyReportDto>> GetWeeklyReport([FromQuery] string startDate, [FromQuery] string endDate)
        {
            var report = await _reportService.GenerateWeeklyReportAsync(startDate, endDate);
            return Ok(report);
        }

        [HttpGet("weekly/detailed")]
        public async Task<ActionResult<WeeklyBookingsReportDto>> GetDetailedWeeklyReport([FromQuery] string startDate, [FromQuery] string endDate)
        {
            var report = await _reportService.GenerateDetailedWeeklyReportAsync(startDate, endDate);
            return Ok(report);
        }

        [HttpGet("weekly/detailed")]
        public async Task<ActionResult<WeeklyBookingsReportDto>> GetDetailedWeeklyReport([FromQuery] string startDate, [FromQuery] string endDate)
        {
            var report = await _reportService.GenerateDetailedWeeklyReportAsync(startDate, endDate);
            return Ok(report);
        }

        [HttpGet("monthly")]
        public async Task<ActionResult<MonthlyReportDto>> GetMonthlyReport([FromQuery] int year, [FromQuery] int month)
        {
            var report = await _reportService.GenerateMonthlyReportAsync(year, month);
            return Ok(report);
        }

        [HttpGet("occupancy")]
        public async Task<ActionResult<IEnumerable<OccupancyReportDto>>> GetOccupancyReport([FromQuery] string roomType, [FromQuery] string period)
        {
            var report = await _reportService.GetOccupancyReportAsync(roomType, period);
            return Ok(report);
        }

        [HttpPost("custom")]
        public async Task<ActionResult<CustomReportDto>> GenerateCustomReport([FromBody] CustomReportRequestDto request)
        {
            var report = await _reportService.GenerateCustomReportAsync(request);
            return Ok(report);
        }
    }
}