using System;

namespace HotelBooking.Models.DTOs
{
    public class ReportDto
    {
        public Guid ReportId { get; set; }
        public string ReportType { get; set; } = string.Empty;
        public DateTime ReportPeriodStart { get; set; }
        public DateTime ReportPeriodEnd { get; set; }
        public string ReportData { get; set; } = string.Empty;
        public DateTime GeneratedAt { get; set; }
        public string? GeneratedBy { get; set; }
    }

    public class WeeklyReportDto
    {
        public DateTime WeekStartDate { get; set; }
        public DateTime WeekEndDate { get; set; }
        public int TotalBookings { get; set; }
        public decimal TotalRevenue { get; set; }
        public double OccupancyRate { get; set; }
        public int TotalGuests { get; set; }
        public List<RoomTypeStatDto> RoomTypeStats { get; set; } = new();
    }

    public class MonthlyReportDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int TotalBookings { get; set; }
        public decimal TotalRevenue { get; set; }
        public double AverageOccupancyRate { get; set; }
        public int TotalGuests { get; set; }
        public List<DailyStatDto> DailyStats { get; set; } = new();
    }

    public class OccupancyReportDto
    {
        public string RoomType { get; set; } = string.Empty;
        public DateTime ReportDate { get; set; }
        public int TotalRooms { get; set; }
        public int OccupiedRooms { get; set; }
        public double OccupancyRate { get; set; }
        public decimal AverageDailyRate { get; set; }
        public decimal RevenuePAR { get; set; } // Revenue Per Available Room
    }

    public class CustomReportDto
    {
        public string ReportTitle { get; set; } = string.Empty;
        public DateTime GeneratedAt { get; set; }
        public ReportParametersDto Parameters { get; set; } = new();
        public Dictionary<string, object> Data { get; set; } = new();
        public List<ChartDataDto> Charts { get; set; } = new();
    }

    public class CustomReportRequestDto
    {
        public string ReportType { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public ReportFiltersDto Filters { get; set; } = new();
    }

    public class ReportParametersDto
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<string> RoomTypes { get; set; } = new();
        public bool IncludeSpecialRequests { get; set; }
    }

    public class ReportFiltersDto
    {
        public List<string> RoomTypes { get; set; } = new();
        public bool IncludeSpecialRequests { get; set; }
        public string? CustomerSegment { get; set; }
        public decimal? MinRevenue { get; set; }
        public decimal? MaxRevenue { get; set; }
    }

    public class RoomTypeStatDto
    {
        public string RoomType { get; set; } = string.Empty;
        public int BookingCount { get; set; }
        public decimal Revenue { get; set; }
        public double OccupancyRate { get; set; }
    }

    public class DailyStatDto
    {
        public DateTime Date { get; set; }
        public int Bookings { get; set; }
        public decimal Revenue { get; set; }
        public double OccupancyRate { get; set; }
    }

    public class ChartDataDto
    {
        public string ChartType { get; set; } = string.Empty; // Line, Bar, Pie, etc.
        public string Title { get; set; } = string.Empty;
        public List<string> Labels { get; set; } = new();
        public List<decimal> Values { get; set; } = new();
    }

    public class WeeklyBookingsReportDto
    {
        public DateTime WeekStartDate { get; set; }
        public DateTime WeekEndDate { get; set; }
        public int TotalBookings { get; set; }
        public decimal TotalRevenue { get; set; }
        public double OccupancyRate { get; set; }
        public int TotalGuests { get; set; }
        public List<DailyBookingsDetailDto> DailyDetails { get; set; } = new();
        public List<RoomTypeStatDto> RoomTypeStats { get; set; } = new();
        public DateTime GeneratedAt { get; set; }
    }

    public class DailyBookingsDetailDto
    {
        public DateTime Date { get; set; }
        public string DayOfWeek { get; set; } = string.Empty;
        public int TotalBookings { get; set; }
        public decimal DayRevenue { get; set; }
        public double DayOccupancyRate { get; set; }
        public int TotalGuests { get; set; }
        public List<BookingSummaryDto> Bookings { get; set; } = new();
        public List<SpecialRequestSummaryDto> SpecialRequests { get; set; } = new();
    }

    public class BookingSummaryDto
    {
        public Guid BookingId { get; set; }
        public string BookingReference { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string RoomNumber { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfGuests { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class SpecialRequestSummaryDto
    {
        public Guid RequestId { get; set; }
        public string BookingReference { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string RequestType { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime RequestDate { get; set; }
        public DateTime? FulfilledDate { get; set; }
    }
}