using System;

namespace HotelBooking.Models.Entities
{
    public class SpecialRequest
    {
        public Guid RequestId { get; set; } = Guid.NewGuid();
        public Guid BookingId { get; set; }
        public string RequestType { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Approved, Denied, Fulfilled
        public DateTime RequestDate { get; set; } = DateTime.UtcNow;
        public DateTime? FulfilledDate { get; set; }

        // Navigation properties
        public virtual Booking Booking { get; set; } = null!;
    }
}