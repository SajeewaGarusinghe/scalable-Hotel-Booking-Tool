using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HotelBooking.Models.Entities;

namespace HotelBooking.Data.Configurations
{
    public class SpecialRequestConfiguration : IEntityTypeConfiguration<SpecialRequest>
    {
        public void Configure(EntityTypeBuilder<SpecialRequest> builder)
        {
            builder.ToTable("SpecialRequests", "booking");

            builder.HasKey(sr => sr.RequestId);

            builder.Property(sr => sr.BookingId)
                .IsRequired();

            builder.Property(sr => sr.RequestType)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(sr => sr.Description)
                .HasMaxLength(500);

            builder.Property(sr => sr.Status)
                .IsRequired()
                .HasMaxLength(20)
                .HasDefaultValue("Pending");

            builder.Property(sr => sr.RequestDate)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.Property(sr => sr.FulfilledDate);

            // Relationships
            builder.HasOne(sr => sr.Booking)
                .WithMany(b => b.SpecialRequests)
                .HasForeignKey(sr => sr.BookingId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}