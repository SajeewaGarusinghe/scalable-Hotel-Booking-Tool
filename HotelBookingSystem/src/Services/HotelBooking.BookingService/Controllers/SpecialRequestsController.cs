using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HotelBooking.Models.DTOs;
using HotelBooking.BookingService.Services;

namespace HotelBooking.BookingService.Controllers
{
    [Route("api/special-requests")]
    [ApiController]
    public class SpecialRequestsController : ControllerBase
    {
        private readonly SpecialRequestService _specialRequestService;

        public SpecialRequestsController(SpecialRequestService specialRequestService)
        {
            _specialRequestService = specialRequestService;
        }

        [HttpGet("booking/{bookingId}")]
        public async Task<ActionResult<IEnumerable<SpecialRequestDto>>> GetRequestsByBookingId(Guid bookingId)
        {
            var requests = await _specialRequestService.GetSpecialRequestsByBookingIdAsync(bookingId);
            return Ok(requests);
        }

        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<SpecialRequestDto>>> GetPendingRequests()
        {
            var requests = await _specialRequestService.GetPendingRequestsAsync();
            return Ok(requests);
        }

        [HttpGet("{requestId}")]
        public async Task<ActionResult<SpecialRequestDto>> GetSpecialRequestById(Guid requestId)
        {
            var request = await _specialRequestService.GetSpecialRequestByIdAsync(requestId);
            if (request == null)
                return NotFound($"Special request with ID {requestId} not found.");

            return Ok(request);
        }

        [HttpPost("booking/{bookingId}")]
        public async Task<ActionResult<SpecialRequestDto>> CreateSpecialRequest(Guid bookingId, [FromBody] CreateSpecialRequestDto createDto)
        {
            try
            {
                var createdRequest = await _specialRequestService.CreateSpecialRequestAsync(bookingId, createDto);
                return CreatedAtAction(nameof(GetSpecialRequestById), 
                    new { requestId = createdRequest.RequestId }, createdRequest);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating special request: {ex.Message}");
            }
        }

        [HttpPut("{requestId}/status")]
        public async Task<ActionResult> UpdateRequestStatus(Guid requestId, [FromBody] UpdateRequestStatusDto statusDto)
        {
            try
            {
                var result = await _specialRequestService.UpdateRequestStatusAsync(requestId, statusDto.Status);
                if (!result)
                    return NotFound($"Special request with ID {requestId} not found.");

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error updating request status: {ex.Message}");
            }
        }

        [HttpDelete("{requestId}")]
        public async Task<ActionResult> DeleteSpecialRequest(Guid requestId)
        {
            try
            {
                var result = await _specialRequestService.DeleteSpecialRequestAsync(requestId);
                if (!result)
                    return NotFound($"Special request with ID {requestId} not found.");

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error deleting special request: {ex.Message}");
            }
        }
    }

    public class UpdateRequestStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }
}