using System;
using System.Threading.Tasks;
using HotelBooking.Models.DTOs;

namespace HotelBooking.BookingService.Services
{
    public static class BookingServiceExtensions
    {
        public static async Task CancelBookingAsync(this Services.BookingService bookingService, Guid bookingId)
        {
            await bookingService.DeleteBookingAsync(bookingId);
        }

        public static async Task<bool> CheckRoomAvailabilityAsync(this Services.BookingService bookingService, DateTime checkIn, DateTime checkOut, int guests)
        {
            // This is a placeholder implementation
            // In a real scenario, this would check against room availability
            return await Task.FromResult(true);
        }
    }
}