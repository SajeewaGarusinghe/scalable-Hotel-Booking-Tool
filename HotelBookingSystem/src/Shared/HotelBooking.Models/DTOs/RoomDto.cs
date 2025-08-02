using System;

namespace HotelBooking.Models.DTOs
{
    public class RoomDto
    {
        public Guid RoomId { get; set; }
        public string RoomNumber { get; set; }
        public string RoomType { get; set; }
        public int MaxOccupancy { get; set; }
        public decimal PricePerNight { get; set; }
        public string Description { get; set; }
        public string Amenities { get; set; } // JSON format
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}