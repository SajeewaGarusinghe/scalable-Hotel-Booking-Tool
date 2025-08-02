using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HotelBooking.Models.Entities;

namespace HotelBooking.Data.Configurations
{
    public class RoomConfiguration : IEntityTypeConfiguration<Room>
    {
        public void Configure(EntityTypeBuilder<Room> builder)
        {
            builder.ToTable("Rooms");

            builder.HasKey(r => r.RoomId);

            builder.Property(r => r.RoomNumber)
                .IsRequired()
                .HasMaxLength(10)
                .IsUnique();

            builder.Property(r => r.RoomType)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(r => r.MaxOccupancy)
                .IsRequired();

            builder.Property(r => r.PricePerNight)
                .IsRequired()
                .HasColumnType("decimal(10,2)");

            builder.Property(r => r.Description)
                .HasMaxLength(500);

            builder.Property(r => r.Amenities)
                .HasColumnType("nvarchar(max)");

            builder.Property(r => r.IsActive)
                .HasDefaultValue(true);

            builder.Property(r => r.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.Property(r => r.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
        }
    }
}