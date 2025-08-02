using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HotelBooking.Models.DTOs;
using HotelBooking.BookingService.Services;

namespace HotelBooking.BookingService.Controllers
{
    [ApiController]
    [Route("api/customers")]
    public class CustomersController : ControllerBase
    {
        private readonly CustomerService _customerService;

        public CustomersController(CustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetAllCustomers()
        {
            var customers = await _customerService.GetAllCustomersAsync();
            return Ok(customers);
        }

        [HttpGet("{customerId}")]
        public async Task<ActionResult<CustomerDto>> GetCustomerById(Guid customerId)
        {
            var customer = await _customerService.GetCustomerByIdAsync(customerId);
            if (customer == null)
                return NotFound($"Customer with ID {customerId} not found.");

            return Ok(customer);
        }

        [HttpGet("by-email/{email}")]
        public async Task<ActionResult<CustomerDto>> GetCustomerByEmail(string email)
        {
            var customer = await _customerService.GetCustomerByEmailAsync(email);
            if (customer == null)
                return NotFound($"Customer with email {email} not found.");

            return Ok(customer);
        }

        [HttpPost]
        public async Task<ActionResult<CustomerDto>> CreateCustomer([FromBody] CustomerDto customerDto)
        {
            try
            {
                var createdCustomer = await _customerService.CreateCustomerAsync(customerDto);
                return CreatedAtAction(nameof(GetCustomerById), 
                    new { customerId = createdCustomer.CustomerId }, createdCustomer);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating customer: {ex.Message}");
            }
        }

        [HttpPut("{customerId}")]
        public async Task<ActionResult<CustomerDto>> UpdateCustomer(Guid customerId, [FromBody] CustomerDto customerDto)
        {
            try
            {
                var updatedCustomer = await _customerService.UpdateCustomerAsync(customerId, customerDto);
                if (updatedCustomer == null)
                    return NotFound($"Customer with ID {customerId} not found.");

                return Ok(updatedCustomer);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error updating customer: {ex.Message}");
            }
        }

        [HttpDelete("{customerId}")]
        public async Task<ActionResult> DeleteCustomer(Guid customerId)
        {
            try
            {
                var result = await _customerService.DeleteCustomerAsync(customerId);
                if (!result)
                    return NotFound($"Customer with ID {customerId} not found.");

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error deleting customer: {ex.Message}");
            }
        }
    }
}