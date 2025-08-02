namespace HotelBooking.Data.Repositories
{
    public interface IRoomRepository
    {
        Task<Room> GetRoomByIdAsync(Guid roomId);
        Task<IEnumerable<Room>> GetAllRoomsAsync();
        Task<IEnumerable<Room>> GetAvailableRoomsAsync(DateTime checkInDate, DateTime checkOutDate, int guests);
        Task AddRoomAsync(Room room);
        Task UpdateRoomAsync(Room room);
        Task DeleteRoomAsync(Guid roomId);
    }
}