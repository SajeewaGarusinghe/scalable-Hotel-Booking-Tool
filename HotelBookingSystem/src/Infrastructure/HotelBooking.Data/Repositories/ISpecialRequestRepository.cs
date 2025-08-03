using HotelBooking.Models.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelBooking.Data.Repositories
{
    public interface ISpecialRequestRepository : IGenericRepository<SpecialRequest>
    {
        Task<IEnumerable<SpecialRequest>> GetByBookingIdAsync(Guid bookingId);
        Task<IEnumerable<SpecialRequest>> GetByStatusAsync(string status);
        Task<IEnumerable<SpecialRequest>> GetPendingRequestsAsync();
        Task<bool> UpdateStatusAsync(Guid requestId, string status, DateTime? fulfilledDate = null);
    }
}