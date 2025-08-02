using System;

namespace HotelBooking.Models.Entities
{
    public class Room
    {
        public Guid RoomId { get; set; } = Guid.NewGuid();
        public string RoomNumber { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public int MaxOccupancy { get; set; }
        public decimal PricePerNight { get; set; }
        public string? Description { get; set; }
        public string? Amenities { get; set; } // JSON format
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}