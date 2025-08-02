using System;

namespace HotelBooking.BookingService.DTOs
{
    public class BookingDto
    {
        public Guid BookingId { get; set; }
        public Guid CustomerId { get; set; }
        public Guid RoomId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfGuests { get; set; }
        public decimal TotalAmount { get; set; }
        public string BookingStatus { get; set; }
        public bool IsRecurring { get; set; }
        public string RecurrencePattern { get; set; }
        public string BookingReference { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}