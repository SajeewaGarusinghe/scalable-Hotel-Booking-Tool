using HotelBooking.Models.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelBooking.Data.Repositories
{
    public interface IBookingRepository : IGenericRepository<Booking>
    {
        Task<IEnumerable<Booking>> GetBookingsByCustomerIdAsync(Guid customerId);
        Task<IEnumerable<Booking>> GetBookingsByRoomIdAsync(Guid roomId);
        Task<IEnumerable<Booking>> GetBookingsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<Booking>> GetBookingsByStatusAsync(string status);
        Task<Booking?> GetBookingByReferenceAsync(string bookingReference);
        Task<Booking?> GetBookingWithDetailsAsync(Guid bookingId);
        Task<IEnumerable<Booking>> GetConflictingBookingsAsync(Guid roomId, DateTime checkInDate, DateTime checkOutDate, Guid? excludeBookingId = null);
        Task<string> GenerateBookingReferenceAsync();
    }
}