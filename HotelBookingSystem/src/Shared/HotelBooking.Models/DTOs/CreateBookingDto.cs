using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Models.DTOs
{
    public class CreateBookingDto
    {
        [Required]
        public Guid CustomerId { get; set; }

        [Required]
        public Guid RoomId { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }

        [Required]
        public DateTime CheckOutDate { get; set; }

        [Required]
        [Range(1, 10)]
        public int NumberOfGuests { get; set; }

        public bool IsRecurring { get; set; } = false;

        public string? RecurrencePattern { get; set; }

        public List<CreateSpecialRequestDto>? SpecialRequests { get; set; }
    }

    public class CreateSpecialRequestDto
    {
        [Required]
        public string RequestType { get; set; } = string.Empty;

        public string? Description { get; set; }
    }
}