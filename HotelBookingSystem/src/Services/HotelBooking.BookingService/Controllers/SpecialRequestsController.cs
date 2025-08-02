using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using HotelBooking.Models.Entities;
using HotelBooking.BookingService.Services;

namespace HotelBooking.BookingService.Controllers
{
    [Route("api/bookings/{bookingId}/requests")]
    [ApiController]
    public class SpecialRequestsController : ControllerBase
    {
        private readonly ISpecialRequestService _specialRequestService;

        public SpecialRequestsController(ISpecialRequestService specialRequestService)
        {
            _specialRequestService = specialRequestService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SpecialRequest>>> GetRequestsForBooking(Guid bookingId)
        {
            var requests = await _specialRequestService.GetRequestsByBookingIdAsync(bookingId);
            return Ok(requests);
        }

        [HttpPost]
        public async Task<ActionResult<SpecialRequest>> AddSpecialRequest(Guid bookingId, [FromBody] SpecialRequest request)
        {
            if (request == null || request.BookingId != bookingId)
            {
                return BadRequest("Invalid request data.");
            }

            var createdRequest = await _specialRequestService.AddSpecialRequestAsync(request);
            return CreatedAtAction(nameof(GetRequestsForBooking), new { bookingId = bookingId }, createdRequest);
        }

        [HttpPut("{requestId}")]
        public async Task<ActionResult> UpdateRequestStatus(Guid bookingId, Guid requestId, [FromBody] SpecialRequest request)
        {
            if (request == null || request.BookingId != bookingId || request.RequestId != requestId)
            {
                return BadRequest("Invalid request data.");
            }

            await _specialRequestService.UpdateRequestStatusAsync(request);
            return NoContent();
        }
    }
}