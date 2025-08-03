using Microsoft.EntityFrameworkCore;
using HotelBooking.Data.Context;
using HotelBooking.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelBooking.Data.Repositories
{
    public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
    {
        public CustomerRepository(HotelBookingContext context) : base(context)
        {
        }

        public async Task<Customer?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.Email == email);
        }

        public async Task<IEnumerable<Customer>> GetCustomersWithBookingsAsync()
        {
            return await _dbSet
                .Include(c => c.Bookings)
                .ThenInclude(b => b.Room)
                .ToListAsync();
        }

        public async Task<Customer?> GetCustomerWithBookingsAsync(Guid customerId)
        {
            return await _dbSet
                .Include(c => c.Bookings)
                .ThenInclude(b => b.Room)
                .Include(c => c.Bookings)
                .ThenInclude(b => b.SpecialRequests)
                .FirstOrDefaultAsync(c => c.CustomerId == customerId);
        }
    }
}