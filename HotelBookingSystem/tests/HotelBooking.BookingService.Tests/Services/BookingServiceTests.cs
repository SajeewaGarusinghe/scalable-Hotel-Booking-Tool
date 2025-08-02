using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;
using Xunit;
using HotelBooking.BookingService.Services;
using HotelBooking.Models.DTOs;
using HotelBooking.Data.Repositories;

namespace HotelBooking.BookingService.Tests.Services
{
    public class BookingServiceTests
    {
        private readonly Mock<IBookingRepository> _bookingRepositoryMock;
        private readonly BookingService _bookingService;

        public BookingServiceTests()
        {
            _bookingRepositoryMock = new Mock<IBookingRepository>();
            _bookingService = new BookingService(_bookingRepositoryMock.Object);
        }

        [Fact]
        public async Task CreateBooking_ShouldReturnBookingDto_WhenBookingIsCreated()
        {
            // Arrange
            var bookingDto = new BookingDto
            {
                CustomerId = Guid.NewGuid(),
                RoomId = Guid.NewGuid(),
                CheckInDate = DateTime.UtcNow.AddDays(1),
                CheckOutDate = DateTime.UtcNow.AddDays(3),
                NumberOfGuests = 2
            };

            _bookingRepositoryMock.Setup(repo => repo.CreateAsync(It.IsAny<Booking>()))
                .ReturnsAsync(new Booking { BookingId = Guid.NewGuid() });

            // Act
            var result = await _bookingService.CreateBooking(bookingDto);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<BookingDto>(result);
        }

        [Fact]
        public async Task GetBookingById_ShouldReturnBookingDto_WhenBookingExists()
        {
            // Arrange
            var bookingId = Guid.NewGuid();
            var booking = new Booking { BookingId = bookingId };

            _bookingRepositoryMock.Setup(repo => repo.GetByIdAsync(bookingId))
                .ReturnsAsync(booking);

            // Act
            var result = await _bookingService.GetBookingById(bookingId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(bookingId, result.BookingId);
        }

        [Fact]
        public async Task GetBookingById_ShouldReturnNull_WhenBookingDoesNotExist()
        {
            // Arrange
            var bookingId = Guid.NewGuid();

            _bookingRepositoryMock.Setup(repo => repo.GetByIdAsync(bookingId))
                .ReturnsAsync((Booking)null);

            // Act
            var result = await _bookingService.GetBookingById(bookingId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task DeleteBooking_ShouldReturnTrue_WhenBookingIsDeleted()
        {
            // Arrange
            var bookingId = Guid.NewGuid();

            _bookingRepositoryMock.Setup(repo => repo.DeleteAsync(bookingId))
                .ReturnsAsync(true);

            // Act
            var result = await _bookingService.DeleteBooking(bookingId);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task DeleteBooking_ShouldReturnFalse_WhenBookingDoesNotExist()
        {
            // Arrange
            var bookingId = Guid.NewGuid();

            _bookingRepositoryMock.Setup(repo => repo.DeleteAsync(bookingId))
                .ReturnsAsync(false);

            // Act
            var result = await _bookingService.DeleteBooking(bookingId);

            // Assert
            Assert.False(result);
        }
    }
}