using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HotelBooking.Models.Entities;

namespace HotelBooking.Data.Configurations
{
    public class BookingConfiguration : IEntityTypeConfiguration<Booking>
    {
        public void Configure(EntityTypeBuilder<Booking> builder)
        {
            builder.ToTable("Bookings", "booking");

            builder.HasKey(b => b.BookingId);

            builder.Property(b => b.CustomerId)
                .IsRequired();

            builder.Property(b => b.RoomId)
                .IsRequired();

            builder.Property(b => b.CheckInDate)
                .IsRequired();

            builder.Property(b => b.CheckOutDate)
                .IsRequired();

            builder.Property(b => b.NumberOfGuests)
                .IsRequired();

            builder.Property(b => b.TotalAmount)
                .HasColumnType("decimal(10,2)")
                .IsRequired();

            builder.Property(b => b.BookingStatus)
                .HasMaxLength(20)
                .HasDefaultValue("Confirmed");

            builder.Property(b => b.IsRecurring)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(b => b.RecurrencePattern)
                .HasMaxLength(100);

            builder.Property(b => b.BookingReference)
                .HasMaxLength(20)
                .IsRequired()
                .IsUnique();

            builder.Property(b => b.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.Property(b => b.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
        }
    }
}