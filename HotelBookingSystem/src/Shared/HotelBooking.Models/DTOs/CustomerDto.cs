using System;
using System.Collections.Generic;

namespace HotelBooking.Models.DTOs
{
    public class CustomerDto
    {
        public Guid CustomerId { get; set; }
        public string? GoogleId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}