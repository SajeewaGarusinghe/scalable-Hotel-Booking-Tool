using System;

namespace HotelBooking.Models.DTOs
{
    public class RoomAvailabilityDto
    {
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfGuests { get; set; }
        public string? RoomType { get; set; }
    }

    public class AvailableRoomDto
    {
        public Guid RoomId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public int MaxOccupancy { get; set; }
        public decimal PricePerNight { get; set; }
        public string? Description { get; set; }
        public string? Amenities { get; set; }
        public decimal TotalPrice { get; set; }
        public int NumberOfNights { get; set; }
    }
}