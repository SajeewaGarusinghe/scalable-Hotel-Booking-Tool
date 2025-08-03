using HotelBooking.Models.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelBooking.Data.Repositories
{
    public interface IRoomRepository : IGenericRepository<Room>
    {
        Task<IEnumerable<Room>> GetAvailableRoomsAsync(DateTime checkInDate, DateTime checkOutDate, int guests);
        Task<IEnumerable<Room>> GetRoomsByTypeAsync(string roomType);
        Task<Room?> GetRoomByNumberAsync(string roomNumber);
        Task<IEnumerable<Room>> GetActiveRoomsAsync();
        Task<bool> IsRoomAvailableAsync(Guid roomId, DateTime checkInDate, DateTime checkOutDate);
    }
}