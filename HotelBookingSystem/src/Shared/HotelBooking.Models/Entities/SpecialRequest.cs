using System;

namespace HotelBooking.Models.Entities
{
    public class SpecialRequest
    {
        public Guid RequestId { get; set; }
        public Guid BookingId { get; set; }
        public string RequestType { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public DateTime RequestDate { get; set; }
        public DateTime? FulfilledDate { get; set; }
    }
}