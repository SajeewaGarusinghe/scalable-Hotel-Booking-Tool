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
        private readonly IRoomRepository _roomRepository;

        public ReportService(IBookingRepository bookingRepository, IRoomRepository roomRepository)
        {
            _bookingRepository = bookingRepository;
            _roomRepository = roomRepository;
        }

        public async Task<WeeklyReportDto> GenerateWeeklyReportAsync(string startDate, string endDate)
        {
            var start = DateTime.Parse(startDate);
            var end = DateTime.Parse(endDate);
            var bookings = await _bookingRepository.GetBookingsByDateRangeAsync(start, end);
            var allRooms = await _roomRepository.GetAllRoomsAsync();

            var totalRooms = allRooms.Count();
            var totalBookings = bookings.Count();
            var totalRevenue = bookings.Sum(b => b.TotalAmount);
            var totalGuests = bookings.Sum(b => b.NumberOfGuests);

            // Calculate occupancy rate
            var daysInPeriod = (end - start).Days + 1;
            var totalRoomNights = totalRooms * daysInPeriod;
            var occupiedRoomNights = bookings.Sum(b => (b.CheckOutDate - b.CheckInDate).Days);
            var occupancyRate = totalRoomNights > 0 ? (double)occupiedRoomNights / totalRoomNights : 0;

            // Room type statistics
            var roomTypeStats = bookings
                .GroupBy(b => b.Room?.RoomType ?? "Unknown")
                .Select(g => new RoomTypeStatDto
                {
                    RoomType = g.Key,
                    BookingCount = g.Count(),
                    Revenue = g.Sum(b => b.TotalAmount),
                    OccupancyRate = CalculateRoomTypeOccupancy(g.Key, start, end, allRooms, bookings)
                }).ToList();

            return new WeeklyReportDto
            {
                WeekStartDate = start,
                WeekEndDate = end,
                TotalBookings = totalBookings,
                TotalRevenue = totalRevenue,
                OccupancyRate = occupancyRate,
                TotalGuests = totalGuests,
                RoomTypeStats = roomTypeStats
            };
        }

        public async Task<MonthlyReportDto> GenerateMonthlyReportAsync(int year, int month)
        {
            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);
            var bookings = await _bookingRepository.GetBookingsByDateRangeAsync(startDate, endDate);
            var allRooms = await _roomRepository.GetAllRoomsAsync();

            var totalRooms = allRooms.Count();
            var totalBookings = bookings.Count();
            var totalRevenue = bookings.Sum(b => b.TotalAmount);
            var totalGuests = bookings.Sum(b => b.NumberOfGuests);

            // Calculate average occupancy rate for the month
            var daysInMonth = DateTime.DaysInMonth(year, month);
            var totalRoomNights = totalRooms * daysInMonth;
            var occupiedRoomNights = bookings.Sum(b => (b.CheckOutDate - b.CheckInDate).Days);
            var averageOccupancyRate = totalRoomNights > 0 ? (double)occupiedRoomNights / totalRoomNights : 0;

            // Daily statistics
            var dailyStats = new List<DailyStatDto>();
            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var dayBookings = await _bookingRepository.GetBookingsForDateAsync(date);
                var dayRevenue = dayBookings.Sum(b => b.TotalAmount / (decimal)(b.CheckOutDate - b.CheckInDate).Days);
                var dayOccupancy = totalRooms > 0 ? (double)dayBookings.Count() / totalRooms : 0;

                dailyStats.Add(new DailyStatDto
                {
                    Date = date,
                    Bookings = dayBookings.Count(),
                    Revenue = dayRevenue,
                    OccupancyRate = dayOccupancy
                });
            }

            return new MonthlyReportDto
            {
                Year = year,
                Month = month,
                TotalBookings = totalBookings,
                TotalRevenue = totalRevenue,
                AverageOccupancyRate = averageOccupancyRate,
                TotalGuests = totalGuests,
                DailyStats = dailyStats
            };
        }

        public async Task<List<OccupancyReportDto>> GetOccupancyReportAsync(string roomType, string period)
        {
            var endDate = DateTime.Today;
            var startDate = period switch
            {
                "last7days" => endDate.AddDays(-7),
                "last30days" => endDate.AddDays(-30),
                "lastmonth" => new DateTime(endDate.Year, endDate.Month, 1).AddMonths(-1),
                _ => endDate.AddDays(-7)
            };

            var allRooms = await _roomRepository.GetAllRoomsAsync();
            var roomsOfType = string.IsNullOrEmpty(roomType) ? allRooms : allRooms.Where(r => r.RoomType == roomType);
            var bookings = await _bookingRepository.GetBookingsByDateRangeAsync(startDate, endDate);

            var reports = new List<OccupancyReportDto>();

            foreach (var room in roomsOfType.GroupBy(r => r.RoomType))
            {
                var roomTypeBookings = bookings.Where(b => b.Room?.RoomType == room.Key);
                var totalRooms = room.Count();
                var occupiedRoomNights = roomTypeBookings.Sum(b => (b.CheckOutDate - b.CheckInDate).Days);
                var daysInPeriod = (endDate - startDate).Days + 1;
                var totalRoomNights = totalRooms * daysInPeriod;
                var occupancyRate = totalRoomNights > 0 ? (double)occupiedRoomNights / totalRoomNights : 0;
                var averageDailyRate = roomTypeBookings.Any() ? 
                    roomTypeBookings.Average(b => b.TotalAmount / (decimal)(b.CheckOutDate - b.CheckInDate).Days) : 0;
                var revenuePAR = averageDailyRate * (decimal)occupancyRate;

                reports.Add(new OccupancyReportDto
                {
                    RoomType = room.Key,
                    ReportDate = endDate,
                    TotalRooms = totalRooms,
                    OccupiedRooms = (int)(occupancyRate * totalRooms),
                    OccupancyRate = occupancyRate,
                    AverageDailyRate = averageDailyRate,
                    RevenuePAR = revenuePAR
                });
            }

            return reports;
        }

        public async Task<CustomReportDto> GenerateCustomReportAsync(CustomReportRequestDto request)
        {
            var bookings = await _bookingRepository.GetBookingsByDateRangeAsync(request.StartDate, request.EndDate);
            var allRooms = await _roomRepository.GetAllRoomsAsync();

            // Filter by room types if specified
            if (request.Filters.RoomTypes?.Any() == true)
            {
                bookings = bookings.Where(b => request.Filters.RoomTypes.Contains(b.Room?.RoomType ?? ""));
            }

            var totalBookings = bookings.Count();
            var totalRevenue = bookings.Sum(b => b.TotalAmount);
            var averageOccupancy = CalculateAverageOccupancy(bookings, allRooms, request.StartDate, request.EndDate);

            var chartData = new List<ChartDataDto>
            {
                new ChartDataDto
                {
                    ChartType = "Line",
                    Title = "Daily Revenue",
                    Labels = GenerateDateLabels(request.StartDate, request.EndDate),
                    Values = GenerateDailyRevenue(bookings, request.StartDate, request.EndDate)
                },
                new ChartDataDto
                {
                    ChartType = "Bar",
                    Title = "Bookings by Room Type",
                    Labels = bookings.GroupBy(b => b.Room?.RoomType ?? "Unknown").Select(g => g.Key).ToList(),
                    Values = bookings.GroupBy(b => b.Room?.RoomType ?? "Unknown").Select(g => (decimal)g.Count()).ToList()
                }
            };

            var report = new CustomReportDto
            {
                ReportTitle = request.ReportType,
                GeneratedAt = DateTime.UtcNow,
                Parameters = new ReportParametersDto
                {
                    StartDate = request.StartDate,
                    EndDate = request.EndDate,
                    RoomTypes = request.Filters.RoomTypes ?? new List<string>(),
                    IncludeSpecialRequests = request.Filters.IncludeSpecialRequests
                },
                Data = new Dictionary<string, object>
                {
                    { "TotalBookings", totalBookings },
                    { "TotalRevenue", totalRevenue },
                    { "AverageOccupancy", averageOccupancy },
                    { "AverageBookingValue", totalBookings > 0 ? totalRevenue / totalBookings : 0 },
                    { "UniqueCustomers", bookings.Select(b => b.CustomerId).Distinct().Count() }
                },
                Charts = chartData
            };

            return report;
        }

        private double CalculateRoomTypeOccupancy(string roomType, DateTime startDate, DateTime endDate, 
            IEnumerable<HotelBooking.Models.Entities.Room> allRooms, IEnumerable<HotelBooking.Models.Entities.Booking> bookings)
        {
            var roomsOfType = allRooms.Where(r => r.RoomType == roomType).Count();
            if (roomsOfType == 0) return 0;

            var daysInPeriod = (endDate - startDate).Days + 1;
            var totalRoomNights = roomsOfType * daysInPeriod;
            var occupiedRoomNights = bookings
                .Where(b => b.Room?.RoomType == roomType)
                .Sum(b => (b.CheckOutDate - b.CheckInDate).Days);

            return totalRoomNights > 0 ? (double)occupiedRoomNights / totalRoomNights : 0;
        }

        private double CalculateAverageOccupancy(IEnumerable<HotelBooking.Models.Entities.Booking> bookings, 
            IEnumerable<HotelBooking.Models.Entities.Room> allRooms, DateTime startDate, DateTime endDate)
        {
            var totalRooms = allRooms.Count();
            if (totalRooms == 0) return 0;

            var daysInPeriod = (endDate - startDate).Days + 1;
            var totalRoomNights = totalRooms * daysInPeriod;
            var occupiedRoomNights = bookings.Sum(b => (b.CheckOutDate - b.CheckInDate).Days);

            return totalRoomNights > 0 ? (double)occupiedRoomNights / totalRoomNights : 0;
        }

        private List<string> GenerateDateLabels(DateTime startDate, DateTime endDate)
        {
            var labels = new List<string>();
            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                labels.Add(date.ToString("MM/dd"));
            }
            return labels;
        }

        private List<decimal> GenerateDailyRevenue(IEnumerable<HotelBooking.Models.Entities.Booking> bookings, DateTime startDate, DateTime endDate)
        {
            var dailyRevenue = new List<decimal>();
            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var dayRevenue = bookings
                    .Where(b => b.CheckInDate.Date == date.Date)
                    .Sum(b => b.TotalAmount);
                dailyRevenue.Add(dayRevenue);
            }
            return dailyRevenue;
        }
    }
}