using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelBooking.Models.DTOs;
using HotelBooking.Data.Repositories;

namespace HotelBooking.AnalyticsService.Services
{
    public class StatisticsService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IRoomRepository _roomRepository;

        public StatisticsService(IBookingRepository bookingRepository, IRoomRepository roomRepository)
        {
            _bookingRepository = bookingRepository;
            _roomRepository = roomRepository;
        }

        public async Task<QuickStatsDto> GetQuickStatisticsAsync()
        {
            var today = DateTime.Today;
            var bookings = await _bookingRepository.GetBookingsByDateRangeAsync(today, today.AddDays(1));
            var allRooms = await _roomRepository.GetAllRoomsAsync();
            var currentBookings = await _bookingRepository.GetCurrentBookingsAsync();

            var totalRooms = allRooms.Count();
            var occupiedRooms = currentBookings.Count();
            var availableRooms = totalRooms - occupiedRooms;
            var occupancyRate = totalRooms > 0 ? (double)occupiedRooms / totalRooms : 0;

            var roomTypeStats = allRooms.GroupBy(r => r.RoomType)
                .Select(g => new RoomTypeQuickStatDto
                {
                    RoomType = g.Key,
                    TotalRooms = g.Count(),
                    OccupiedRooms = currentBookings.Count(b => g.Any(r => r.RoomId == b.RoomId)),
                    AvailableRooms = g.Count() - currentBookings.Count(b => g.Any(r => r.RoomId == b.RoomId)),
                    OccupancyRate = g.Count() > 0 ? (double)currentBookings.Count(b => g.Any(r => r.RoomId == b.RoomId)) / g.Count() : 0,
                    AverageRate = g.Average(r => r.PricePerNight)
                }).ToList();

            return new QuickStatsDto
            {
                TotalBookings = bookings.Count(),
                TotalRevenue = bookings.Sum(b => b.TotalAmount),
                OccupancyRate = occupancyRate,
                AvailableRooms = availableRooms,
                TotalRooms = totalRooms,
                TotalGuests = bookings.Sum(b => b.NumberOfGuests),
                LastUpdated = DateTime.UtcNow,
                RoomTypeStats = roomTypeStats
            };
        }

        public async Task<DashboardStatsDto> GetDashboardStatisticsAsync()
        {
            var currentStats = await GetQuickStatisticsAsync();
            var revenueTrend = await GetRevenueTrendAsync();
            var occupancyTrend = await GetOccupancyTrendAsync();
            var upcomingBookings = await GetUpcomingBookingsAsync(7);
            var recentActivities = await GetRecentActivitiesAsync();

            return new DashboardStatsDto
            {
                CurrentStats = currentStats,
                RevenueTrind = revenueTrend,
                OccupancyTrend = occupancyTrend,
                UpcomingBookings = upcomingBookings,
                RecentActivities = recentActivities
            };
        }

        public async Task<double> GetCurrentOccupancyRateAsync()
        {
            var allRooms = await _roomRepository.GetAllRoomsAsync();
            var currentBookings = await _bookingRepository.GetCurrentBookingsAsync();

            var totalRooms = allRooms.Count();
            var occupiedRooms = currentBookings.Count();

            return totalRooms > 0 ? (double)occupiedRooms / totalRooms : 0;
        }

        public async Task<decimal> GetTodayRevenueAsync()
        {
            var today = DateTime.Today;
            var bookings = await _bookingRepository.GetBookingsByDateRangeAsync(today, today.AddDays(1));
            return bookings.Sum(b => b.TotalAmount);
        }

        public async Task<List<UpcomingBookingDto>> GetUpcomingBookingsAsync(int days)
        {
            var startDate = DateTime.Today;
            var endDate = startDate.AddDays(days);
            var bookings = await _bookingRepository.GetBookingsByDateRangeAsync(startDate, endDate);

            return bookings.Select(b => new UpcomingBookingDto
            {
                BookingId = b.BookingId,
                CustomerName = $"{b.Customer?.FirstName} {b.Customer?.LastName}".Trim(),
                RoomNumber = b.Room?.RoomNumber ?? "N/A",
                CheckInDate = b.CheckInDate,
                CheckOutDate = b.CheckOutDate,
                NumberOfGuests = b.NumberOfGuests,
                TotalAmount = b.TotalAmount
            }).OrderBy(b => b.CheckInDate).Take(10).ToList();
        }

        private async Task<List<TrendDataDto>> GetRevenueTrendAsync()
        {
            var endDate = DateTime.Today;
            var startDate = endDate.AddDays(-30);
            var bookings = await _bookingRepository.GetBookingsByDateRangeAsync(startDate, endDate);

            return bookings.GroupBy(b => b.CheckInDate.Date)
                .Select(g => new TrendDataDto
                {
                    Date = g.Key,
                    Value = g.Sum(b => b.TotalAmount),
                    Label = g.Key.ToString("MM/dd")
                })
                .OrderBy(t => t.Date)
                .ToList();
        }

        private async Task<List<TrendDataDto>> GetOccupancyTrendAsync()
        {
            var endDate = DateTime.Today;
            var startDate = endDate.AddDays(-30);
            var allRooms = await _roomRepository.GetAllRoomsAsync();
            var totalRooms = allRooms.Count();

            var trendData = new List<TrendDataDto>();
            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var dayBookings = await _bookingRepository.GetBookingsForDateAsync(date);
                var occupancy = totalRooms > 0 ? (decimal)dayBookings.Count() / totalRooms : 0;

                trendData.Add(new TrendDataDto
                {
                    Date = date,
                    Value = occupancy * 100, // Convert to percentage
                    Label = date.ToString("MM/dd")
                });
            }

            return trendData.OrderBy(t => t.Date).ToList();
        }

        private async Task<List<RecentActivityDto>> GetRecentActivitiesAsync()
        {
            var recentDate = DateTime.Today.AddDays(-7);
            var recentBookings = await _bookingRepository.GetBookingsByDateRangeAsync(recentDate, DateTime.Today.AddDays(1));

            var activities = new List<RecentActivityDto>();

            foreach (var booking in recentBookings.OrderByDescending(b => b.CreatedAt).Take(10))
            {
                activities.Add(new RecentActivityDto
                {
                    ActivityType = "Booking",
                    Description = $"New booking created for room {booking.Room?.RoomNumber}",
                    Timestamp = booking.CreatedAt,
                    CustomerName = $"{booking.Customer?.FirstName} {booking.Customer?.LastName}".Trim(),
                    RoomNumber = booking.Room?.RoomNumber
                });
            }

            return activities.OrderByDescending(a => a.Timestamp).ToList();
        }
    }
}
