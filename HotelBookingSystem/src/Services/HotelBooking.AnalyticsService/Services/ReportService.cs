using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelBooking.Models.DTOs;
using HotelBooking.Data.Repositories;

namespace HotelBooking.AnalyticsService.Services
{
    public class ReportService
    {
        private readonly IBookingRepository _bookingRepository;

        public ReportService(IBookingRepository bookingRepository)
        {
            _bookingRepository = bookingRepository;
        }

        public async Task<List<ReportDto>> GenerateWeeklyReportAsync(string startDate, string endDate)
        {
            var start = DateTime.Parse(startDate);
            var end = DateTime.Parse(endDate);
            var bookings = await _bookingRepository.GetBookingsByDateRangeAsync(start, end);
            
            var reports = new List<ReportDto>
            {
                new ReportDto
                {
                    ReportId = Guid.NewGuid(),
                    ReportType = "Weekly",
                    ReportPeriodStart = start,
                    ReportPeriodEnd = end,
                    ReportData = $"Total Bookings: {bookings.Count()}, Total Revenue: {bookings.Sum(b => b.TotalAmount)}",
                    GeneratedAt = DateTime.UtcNow,
                    GeneratedBy = "System"
                }
            };
            return reports;
        }

        public async Task<List<ReportDto>> GenerateMonthlyReportAsync(int year, int month)
        {
            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);
            var bookings = await _bookingRepository.GetBookingsByDateRangeAsync(startDate, endDate);
            
            var reports = new List<ReportDto>
            {
                new ReportDto
                {
                    ReportId = Guid.NewGuid(),
                    ReportType = "Monthly",
                    ReportPeriodStart = startDate,
                    ReportPeriodEnd = endDate,
                    ReportData = $"Monthly Report for {year}-{month:00}: Total Bookings: {bookings.Count()}, Total Revenue: {bookings.Sum(b => b.TotalAmount)}",
                    GeneratedAt = DateTime.UtcNow,
                    GeneratedBy = "System"
                }
            };
            return reports;
        }

        public async Task<List<OccupancyReportDto>> GetOccupancyReportAsync(string roomType, string period)
        {
            // Sample implementation for occupancy report
            var reports = new List<OccupancyReportDto>
            {
                new OccupancyReportDto
                {
                    RoomType = roomType,
                    ReportDate = DateTime.UtcNow,
                    TotalRooms = 10,
                    OccupiedRooms = 7,
                    OccupancyRate = 0.70,
                    AverageDailyRate = 120.00m,
                    RevenuePAR = 84.00m
                }
            };
            return reports;
        }

        public async Task<CustomReportDto> GenerateCustomReportAsync(CustomReportRequestDto request)
        {
            var report = new CustomReportDto
            {
                ReportTitle = request.ReportType,
                GeneratedAt = DateTime.UtcNow,
                Parameters = new ReportParametersDto
                {
                    StartDate = request.StartDate,
                    EndDate = request.EndDate,
                    RoomTypes = request.Filters.RoomTypes,
                    IncludeSpecialRequests = request.Filters.IncludeSpecialRequests
                },
                Data = new Dictionary<string, object>
                {
                    { "TotalBookings", 50 },
                    { "TotalRevenue", 12500.00m },
                    { "AverageOccupancy", 0.75 }
                }
            };
            return report;
        }
    }
}