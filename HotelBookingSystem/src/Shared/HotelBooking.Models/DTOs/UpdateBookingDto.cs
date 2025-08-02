using System;
using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Models.DTOs
{
    public class UpdateBookingDto
    {
        public DateTime? CheckInDate { get; set; }

        public DateTime? CheckOutDate { get; set; }

        [Range(1, 10)]
        public int? NumberOfGuests { get; set; }

        public string? BookingStatus { get; set; }

        public bool? IsRecurring { get; set; }

        public string? RecurrencePattern { get; set; }
    }
}