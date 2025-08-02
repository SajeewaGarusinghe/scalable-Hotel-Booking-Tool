namespace HotelBooking.Data.Repositories
{
    public interface IBookingRepository
    {
        Task<Booking> GetBookingByIdAsync(Guid bookingId);
        Task<IEnumerable<Booking>> GetAllBookingsAsync();
        Task CreateBookingAsync(Booking booking);
        Task UpdateBookingAsync(Booking booking);
        Task DeleteBookingAsync(Guid bookingId);
        Task<IEnumerable<Booking>> GetBookingsByCustomerIdAsync(Guid customerId);
    }
}