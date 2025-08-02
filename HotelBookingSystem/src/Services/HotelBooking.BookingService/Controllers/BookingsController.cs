using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HotelBooking.Models.DTOs;
using HotelBooking.BookingService.Services;

namespace HotelBooking.BookingService.Controllers
{
    [ApiController]
    [Route("api/bookings")]
    public class BookingsController : ControllerBase
    {
        private readonly BookingService _bookingService;

        public BookingsController(BookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetAllBookings(int page = 1, int pageSize = 10, string status = "confirmed")
        {
            var bookings = await _bookingService.GetAllBookingsAsync(page, pageSize, status);
            return Ok(bookings);
        }

        [HttpGet("{bookingId}")]
        public async Task<ActionResult<BookingDto>> GetBookingById(Guid bookingId)
        {
            var booking = await _bookingService.GetBookingByIdAsync(bookingId);
            if (booking == null)
            {
                return NotFound();
            }
            return Ok(booking);
        }

        [HttpPost]
        public async Task<ActionResult<BookingDto>> CreateBooking([FromBody] BookingDto bookingDto)
        {
            var createdBooking = await _bookingService.CreateBookingAsync(bookingDto);
            return CreatedAtAction(nameof(GetBookingById), new { bookingId = createdBooking.BookingId }, createdBooking);
        }

        [HttpPut("{bookingId}")]
        public async Task<IActionResult> UpdateBooking(Guid bookingId, [FromBody] BookingDto bookingDto)
        {
            if (bookingId != bookingDto.BookingId)
            {
                return BadRequest();
            }

            await _bookingService.UpdateBookingAsync(bookingDto);
            return NoContent();
        }

        [HttpDelete("{bookingId}")]
        public async Task<IActionResult> CancelBooking(Guid bookingId)
        {
            await _bookingService.CancelBookingAsync(bookingId);
            return NoContent();
        }

        [HttpGet("availability")]
        public async Task<ActionResult<bool>> CheckRoomAvailability(DateTime checkIn, DateTime checkOut, int guests)
        {
            var isAvailable = await _bookingService.CheckRoomAvailabilityAsync(checkIn, checkOut, guests);
            return Ok(isAvailable);
        }
    }
}