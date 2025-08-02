using Microsoft.EntityFrameworkCore;
using HotelBooking.Data.Context;
using HotelBooking.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelBooking.Data.Repositories
{
    public class BookingRepository : GenericRepository<Booking>, IBookingRepository
    {
        public BookingRepository(HotelBookingContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Booking>> GetBookingsByCustomerIdAsync(Guid customerId)
        {
            return await _dbSet
                .Where(b => b.CustomerId == customerId)
                .Include(b => b.Room)
                .Include(b => b.SpecialRequests)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetBookingsByRoomIdAsync(Guid roomId)
        {
            return await _dbSet
                .Where(b => b.RoomId == roomId)
                .Include(b => b.Customer)
                .Include(b => b.SpecialRequests)
                .OrderByDescending(b => b.CheckInDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetBookingsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _dbSet
                .Where(b => b.CheckInDate >= startDate && b.CheckOutDate <= endDate)
                .Include(b => b.Customer)
                .Include(b => b.Room)
                .Include(b => b.SpecialRequests)
                .OrderBy(b => b.CheckInDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetBookingsByStatusAsync(string status)
        {
            return await _dbSet
                .Where(b => b.BookingStatus == status)
                .Include(b => b.Customer)
                .Include(b => b.Room)
                .Include(b => b.SpecialRequests)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<Booking?> GetBookingByReferenceAsync(string bookingReference)
        {
            return await _dbSet
                .Include(b => b.Customer)
                .Include(b => b.Room)
                .Include(b => b.SpecialRequests)
                .FirstOrDefaultAsync(b => b.BookingReference == bookingReference);
        }

        public async Task<Booking?> GetBookingWithDetailsAsync(Guid bookingId)
        {
            return await _dbSet
                .Include(b => b.Customer)
                .Include(b => b.Room)
                .Include(b => b.SpecialRequests)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);
        }

        public async Task<IEnumerable<Booking>> GetConflictingBookingsAsync(Guid roomId, DateTime checkInDate, DateTime checkOutDate, Guid? excludeBookingId = null)
        {
            var query = _dbSet
                .Where(b => b.RoomId == roomId && 
                           b.BookingStatus != "Cancelled" &&
                           ((b.CheckInDate <= checkInDate && b.CheckOutDate > checkInDate) ||
                            (b.CheckInDate < checkOutDate && b.CheckOutDate >= checkOutDate) ||
                            (b.CheckInDate >= checkInDate && b.CheckOutDate <= checkOutDate)));

            if (excludeBookingId.HasValue)
            {
                query = query.Where(b => b.BookingId != excludeBookingId.Value);
            }

            return await query.ToListAsync();
        }

        public async Task<string> GenerateBookingReferenceAsync()
        {
            string reference;
            bool exists;
            
            do
            {
                reference = $"HB{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                exists = await _dbSet.AnyAsync(b => b.BookingReference == reference);
            } while (exists);

            return reference;
        }
    }
}