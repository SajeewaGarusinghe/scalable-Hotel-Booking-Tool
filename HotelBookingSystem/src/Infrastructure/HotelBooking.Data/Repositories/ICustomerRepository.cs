using HotelBooking.Models.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelBooking.Data.Repositories
{
    public interface ICustomerRepository : IGenericRepository<Customer>
    {
        Task<Customer?> GetByEmailAsync(string email);
        Task<IEnumerable<Customer>> GetCustomersWithBookingsAsync();
        Task<Customer?> GetCustomerWithBookingsAsync(Guid customerId);
    }
}