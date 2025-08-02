using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelBooking.Models.Entities;
using HotelBooking.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Data.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly HotelBookingContext _context;

        public BookingRepository(HotelBookingContext context)
        {
            _context = context;
        }

        public async Task<Booking> GetBookingByIdAsync(Guid bookingId)
        {
            return await _context.Bookings
                .Include(b => b.SpecialRequests)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);
        }

        public async Task<IEnumerable<Booking>> GetAllBookingsAsync()
        {
            return await _context.Bookings
                .Include(b => b.SpecialRequests)
                .ToListAsync();
        }

        public async Task AddBookingAsync(Booking booking)
        {
            await _context.Bookings.AddAsync(booking);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateBookingAsync(Booking booking)
        {
            _context.Bookings.Update(booking);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBookingAsync(Guid bookingId)
        {
            var booking = await GetBookingByIdAsync(bookingId);
            if (booking != null)
            {
                _context.Bookings.Remove(booking);
                await _context.SaveChangesAsync();
            }
        }
    }
}