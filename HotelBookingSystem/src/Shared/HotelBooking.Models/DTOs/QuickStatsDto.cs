using System;
using System.Collections.Generic;

namespace HotelBooking.Models.DTOs
{
    public class QuickStatsDto
    {
        public int TotalBookings { get; set; }
        public decimal TotalRevenue { get; set; }
        public double OccupancyRate { get; set; }
        public int AvailableRooms { get; set; }
        public int TotalRooms { get; set; }
        public int TotalGuests { get; set; }
        public DateTime LastUpdated { get; set; }
        public List<RoomTypeQuickStatDto> RoomTypeStats { get; set; } = new();
    }

    public class RoomTypeQuickStatDto
    {
        public string RoomType { get; set; } = string.Empty;
        public int TotalRooms { get; set; }
        public int OccupiedRooms { get; set; }
        public int AvailableRooms { get; set; }
        public double OccupancyRate { get; set; }
        public decimal AverageRate { get; set; }
    }

    public class DashboardStatsDto
    {
        public QuickStatsDto CurrentStats { get; set; } = new();
        public List<TrendDataDto> RevenueTrind { get; set; } = new();
        public List<TrendDataDto> OccupancyTrend { get; set; } = new();
        public List<UpcomingBookingDto> UpcomingBookings { get; set; } = new();
        public List<RecentActivityDto> RecentActivities { get; set; } = new();
    }

    public class TrendDataDto
    {
        public DateTime Date { get; set; }
        public decimal Value { get; set; }
        public string Label { get; set; } = string.Empty;
    }

    public class UpcomingBookingDto
    {
        public Guid BookingId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string RoomNumber { get; set; } = string.Empty;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfGuests { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class RecentActivityDto
    {
        public string ActivityType { get; set; } = string.Empty; // Booking, Cancellation, Check-in, Check-out
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string? CustomerName { get; set; }
        public string? RoomNumber { get; set; }
    }
}
