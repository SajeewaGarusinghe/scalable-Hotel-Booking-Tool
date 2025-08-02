using Microsoft.EntityFrameworkCore;
using HotelBooking.Data.Context;
using HotelBooking.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelBooking.Data.Repositories
{
    public class SpecialRequestRepository : GenericRepository<SpecialRequest>, ISpecialRequestRepository
    {
        public SpecialRequestRepository(HotelBookingContext context) : base(context)
        {
        }

        public async Task<IEnumerable<SpecialRequest>> GetByBookingIdAsync(Guid bookingId)
        {
            return await _dbSet
                .Where(sr => sr.BookingId == bookingId)
                .Include(sr => sr.Booking)
                .ToListAsync();
        }

        public async Task<IEnumerable<SpecialRequest>> GetByStatusAsync(string status)
        {
            return await _dbSet
                .Where(sr => sr.Status == status)
                .Include(sr => sr.Booking)
                .ThenInclude(b => b.Customer)
                .ToListAsync();
        }

        public async Task<IEnumerable<SpecialRequest>> GetPendingRequestsAsync()
        {
            return await GetByStatusAsync("Pending");
        }

        public async Task<bool> UpdateStatusAsync(Guid requestId, string status, DateTime? fulfilledDate = null)
        {
            var request = await GetByIdAsync(requestId);
            if (request == null)
                return false;

            request.Status = status;
            if (fulfilledDate.HasValue)
                request.FulfilledDate = fulfilledDate.Value;

            await UpdateAsync(request);
            return true;
        }
    }
}