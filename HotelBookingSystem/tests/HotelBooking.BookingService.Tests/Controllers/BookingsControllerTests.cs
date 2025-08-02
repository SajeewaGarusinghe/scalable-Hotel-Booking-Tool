using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using HotelBooking.BookingService.Controllers;
using HotelBooking.BookingService.Services;
using HotelBooking.Models.DTOs;

namespace HotelBooking.BookingService.Tests.Controllers
{
    public class BookingsControllerTests
    {
        private readonly Mock<IBookingService> _bookingServiceMock;
        private readonly BookingsController _controller;

        public BookingsControllerTests()
        {
            _bookingServiceMock = new Mock<IBookingService>();
            _controller = new BookingsController(_bookingServiceMock.Object);
        }

        [Fact]
        public async Task GetBooking_ReturnsBooking_WhenBookingExists()
        {
            // Arrange
            var bookingId = Guid.NewGuid();
            var bookingDto = new BookingDto { BookingId = bookingId, CustomerId = Guid.NewGuid(), RoomId = Guid.NewGuid() };
            _bookingServiceMock.Setup(service => service.GetBookingByIdAsync(bookingId)).ReturnsAsync(bookingDto);

            // Act
            var result = await _controller.GetBooking(bookingId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedBooking = Assert.IsType<BookingDto>(okResult.Value);
            Assert.Equal(bookingId, returnedBooking.BookingId);
        }

        [Fact]
        public async Task GetBooking_ReturnsNotFound_WhenBookingDoesNotExist()
        {
            // Arrange
            var bookingId = Guid.NewGuid();
            _bookingServiceMock.Setup(service => service.GetBookingByIdAsync(bookingId)).ReturnsAsync((BookingDto)null);

            // Act
            var result = await _controller.GetBooking(bookingId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task CreateBooking_ReturnsCreatedBooking_WhenSuccessful()
        {
            // Arrange
            var newBookingDto = new BookingDto { CustomerId = Guid.NewGuid(), RoomId = Guid.NewGuid() };
            _bookingServiceMock.Setup(service => service.CreateBookingAsync(newBookingDto)).ReturnsAsync(newBookingDto);

            // Act
            var result = await _controller.CreateBooking(newBookingDto);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            var returnedBooking = Assert.IsType<BookingDto>(createdResult.Value);
            Assert.Equal(newBookingDto.CustomerId, returnedBooking.CustomerId);
        }

        [Fact]
        public async Task CancelBooking_ReturnsNoContent_WhenSuccessful()
        {
            // Arrange
            var bookingId = Guid.NewGuid();
            _bookingServiceMock.Setup(service => service.CancelBookingAsync(bookingId)).ReturnsAsync(true);

            // Act
            var result = await _controller.CancelBooking(bookingId);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task CancelBooking_ReturnsNotFound_WhenBookingDoesNotExist()
        {
            // Arrange
            var bookingId = Guid.NewGuid();
            _bookingServiceMock.Setup(service => service.CancelBookingAsync(bookingId)).ReturnsAsync(false);

            // Act
            var result = await _controller.CancelBooking(bookingId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}