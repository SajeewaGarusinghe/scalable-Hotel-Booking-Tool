using Microsoft.EntityFrameworkCore;
using HotelBooking.Data.Context;
using HotelBooking.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelBooking.Data.Repositories
{
    public class RoomRepository : GenericRepository<Room>, IRoomRepository
    {
        public RoomRepository(HotelBookingContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Room>> GetAvailableRoomsAsync(DateTime checkInDate, DateTime checkOutDate, int guests)
        {
            return await _dbSet
                .Where(r => r.IsActive && 
                           r.MaxOccupancy >= guests &&
                           !r.Bookings.Any(b => 
                               b.BookingStatus != "Cancelled" &&
                               ((b.CheckInDate <= checkInDate && b.CheckOutDate > checkInDate) ||
                                (b.CheckInDate < checkOutDate && b.CheckOutDate >= checkOutDate) ||
                                (b.CheckInDate >= checkInDate && b.CheckOutDate <= checkOutDate))))
                .ToListAsync();
        }

        public async Task<IEnumerable<Room>> GetRoomsByTypeAsync(string roomType)
        {
            return await _dbSet
                .Where(r => r.RoomType == roomType && r.IsActive)
                .ToListAsync();
        }

        public async Task<Room?> GetRoomByNumberAsync(string roomNumber)
        {
            return await _dbSet
                .FirstOrDefaultAsync(r => r.RoomNumber == roomNumber);
        }

        public async Task<IEnumerable<Room>> GetActiveRoomsAsync()
        {
            return await _dbSet
                .Where(r => r.IsActive)
                .ToListAsync();
        }

        public async Task<bool> IsRoomAvailableAsync(Guid roomId, DateTime checkInDate, DateTime checkOutDate)
        {
            var room = await _dbSet
                .Include(r => r.Bookings)
                .FirstOrDefaultAsync(r => r.RoomId == roomId && r.IsActive);

            if (room == null)
                return false;

            return !room.Bookings.Any(b => 
                b.BookingStatus != "Cancelled" &&
                ((b.CheckInDate <= checkInDate && b.CheckOutDate > checkInDate) ||
                 (b.CheckInDate < checkOutDate && b.CheckOutDate >= checkOutDate) ||
                 (b.CheckInDate >= checkInDate && b.CheckOutDate <= checkOutDate)));
        }
    }
}