using System;

namespace HotelBooking.Models.DTOs
{
    public class SpecialRequestDto
    {
        public Guid RequestId { get; set; }
        public Guid BookingId { get; set; }
        public string RequestType { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime RequestDate { get; set; }
        public DateTime? FulfilledDate { get; set; }
    }
}