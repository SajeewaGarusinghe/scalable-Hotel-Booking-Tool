using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Models.DTOs
{
    public class CreateRoomDto
    {
        [Required]
        [StringLength(10)]
        public string RoomNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string RoomType { get; set; } = string.Empty;

        [Required]
        [Range(1, 10)]
        public int MaxOccupancy { get; set; }

        [Required]
        [Range(0, 10000)]
        public decimal PricePerNight { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public string? Amenities { get; set; } // JSON format

        public bool IsActive { get; set; } = true;
    }
}