using System;

namespace HotelBooking.Models.Entities
{
    public class Booking
    {
        public Guid BookingId { get; set; }
        public Guid CustomerId { get; set; }
        public Guid RoomId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfGuests { get; set; }
        public decimal TotalAmount { get; set; }
        public string BookingStatus { get; set; } // Confirmed, Cancelled, CheckedIn, CheckedOut
        public bool IsRecurring { get; set; }
        public string RecurrencePattern { get; set; } // Weekly, Monthly, etc.
        public string BookingReference { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}