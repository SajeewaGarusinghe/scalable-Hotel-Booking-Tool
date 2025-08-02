using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelBooking.Models.Entities;
using HotelBooking.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Data.Repositories
{
    public class RoomRepository : IRoomRepository
    {
        private readonly HotelBookingContext _context;

        public RoomRepository(HotelBookingContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Room>> GetAllRoomsAsync()
        {
            return await _context.Rooms.ToListAsync();
        }

        public async Task<Room> GetRoomByIdAsync(Guid roomId)
        {
            return await _context.Rooms.FindAsync(roomId);
        }

        public async Task AddRoomAsync(Room room)
        {
            await _context.Rooms.AddAsync(room);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateRoomAsync(Room room)
        {
            _context.Rooms.Update(room);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRoomAsync(Guid roomId)
        {
            var room = await GetRoomByIdAsync(roomId);
            if (room != null)
            {
                _context.Rooms.Remove(room);
                await _context.SaveChangesAsync();
            }
        }
    }
}