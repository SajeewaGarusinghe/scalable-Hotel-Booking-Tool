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

        public async Task<List<BookingDto>> GetWeeklyBookingReport(DateTime startDate, DateTime endDate)
        {
            var bookings = await _bookingRepository.GetBookingsByDateRange(startDate, endDate);
            return bookings.Select(b => new BookingDto
            {
                BookingId = b.BookingId,
                CustomerId = b.CustomerId,
                RoomId = b.RoomId,
                CheckInDate = b.CheckInDate,
                CheckOutDate = b.CheckOutDate,
                NumberOfGuests = b.NumberOfGuests,
                TotalAmount = b.TotalAmount,
                BookingStatus = b.BookingStatus
            }).ToList();
        }

        public async Task<decimal> GetTotalRevenue(DateTime startDate, DateTime endDate)
        {
            var bookings = await _bookingRepository.GetBookingsByDateRange(startDate, endDate);
            return bookings.Sum(b => b.TotalAmount);
        }

        // Additional report methods can be added here
    }
}