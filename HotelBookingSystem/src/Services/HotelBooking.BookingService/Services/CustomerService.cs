using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HotelBooking.Models.Entities;
using HotelBooking.Data.Repositories;
using HotelBooking.Models.DTOs;

namespace HotelBooking.BookingService.Services
{
    public class CustomerService
    {
        private readonly ICustomerRepository _customerRepository;

        public CustomerService(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<CustomerDto?> GetCustomerByIdAsync(Guid customerId)
        {
            var customer = await _customerRepository.GetByIdAsync(customerId);
            return customer == null ? null : MapToDto(customer);
        }

        public async Task<CustomerDto?> GetCustomerByEmailAsync(string email)
        {
            var customer = await _customerRepository.GetByEmailAsync(email);
            return customer == null ? null : MapToDto(customer);
        }

        public async Task<IEnumerable<CustomerDto>> GetAllCustomersAsync()
        {
            var customers = await _customerRepository.GetAllAsync();
            return customers.Select(MapToDto);
        }

        public async Task<CustomerDto> CreateCustomerAsync(CustomerDto customerDto)
        {
            var customer = new Customer
            {
                Email = customerDto.Email,
                FirstName = customerDto.FirstName,
                LastName = customerDto.LastName,
                PhoneNumber = customerDto.PhoneNumber,
                Address = customerDto.Address
            };

            var createdCustomer = await _customerRepository.AddAsync(customer);
            return MapToDto(createdCustomer);
        }

        public async Task<CustomerDto?> UpdateCustomerAsync(Guid customerId, CustomerDto customerDto)
        {
            var existingCustomer = await _customerRepository.GetByIdAsync(customerId);
            if (existingCustomer == null)
                return null;

            existingCustomer.FirstName = customerDto.FirstName;
            existingCustomer.LastName = customerDto.LastName;
            existingCustomer.PhoneNumber = customerDto.PhoneNumber;
            existingCustomer.Address = customerDto.Address;
            existingCustomer.UpdatedAt = DateTime.UtcNow;

            var updatedCustomer = await _customerRepository.UpdateAsync(existingCustomer);
            return MapToDto(updatedCustomer);
        }

        public async Task<bool> DeleteCustomerAsync(Guid customerId)
        {
            return await _customerRepository.DeleteAsync(customerId);
        }

        private static CustomerDto MapToDto(Customer customer)
        {
            return new CustomerDto
            {
                CustomerId = customer.CustomerId,
                Email = customer.Email,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                PhoneNumber = customer.PhoneNumber,
                Address = customer.Address,
                CreatedAt = customer.CreatedAt,
                UpdatedAt = customer.UpdatedAt
            };
        }
    }
}