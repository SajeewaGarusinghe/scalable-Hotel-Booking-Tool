using System;
using System.Collections.Generic;

namespace HotelBooking.Models.Entities
{
    public class Booking
    {
        public Guid BookingId { get; set; } = Guid.NewGuid();
        public Guid CustomerId { get; set; }
        public Guid RoomId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfGuests { get; set; }
        public decimal TotalAmount { get; set; }
        public string BookingStatus { get; set; } = "Confirmed"; // Confirmed, Cancelled, CheckedIn, CheckedOut
        public bool IsRecurring { get; set; } = false;
        public string? RecurrencePattern { get; set; } // Weekly, Monthly, etc.
        public string BookingReference { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Customer Customer { get; set; } = null!;
        public virtual Room Room { get; set; } = null!;
        public virtual ICollection<SpecialRequest> SpecialRequests { get; set; } = new List<SpecialRequest>();
    }
}