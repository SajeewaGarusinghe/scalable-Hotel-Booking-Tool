using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HotelBooking.Models.Entities;
using HotelBooking.Data.Repositories;
using HotelBooking.Models.DTOs;

namespace HotelBooking.BookingService.Services
{
    public class SpecialRequestService
    {
        private readonly ISpecialRequestRepository _specialRequestRepository;

        public SpecialRequestService(ISpecialRequestRepository specialRequestRepository)
        {
            _specialRequestRepository = specialRequestRepository;
        }

        public async Task<SpecialRequestDto?> GetSpecialRequestByIdAsync(Guid requestId)
        {
            var request = await _specialRequestRepository.GetByIdAsync(requestId);
            return request == null ? null : MapToDto(request);
        }

        public async Task<IEnumerable<SpecialRequestDto>> GetSpecialRequestsByBookingIdAsync(Guid bookingId)
        {
            var requests = await _specialRequestRepository.GetByBookingIdAsync(bookingId);
            return requests.Select(MapToDto);
        }

        public async Task<IEnumerable<SpecialRequestDto>> GetPendingRequestsAsync()
        {
            var requests = await _specialRequestRepository.GetPendingRequestsAsync();
            return requests.Select(MapToDto);
        }

        public async Task<SpecialRequestDto> CreateSpecialRequestAsync(Guid bookingId, CreateSpecialRequestDto createDto)
        {
            var request = new SpecialRequest
            {
                BookingId = bookingId,
                RequestType = createDto.RequestType,
                Description = createDto.Description,
                Status = "Pending",
                RequestDate = DateTime.UtcNow
            };

            var createdRequest = await _specialRequestRepository.AddAsync(request);
            return MapToDto(createdRequest);
        }

        public async Task<bool> UpdateRequestStatusAsync(Guid requestId, string status)
        {
            DateTime? fulfilledDate = status == "Fulfilled" ? DateTime.UtcNow : null;
            return await _specialRequestRepository.UpdateStatusAsync(requestId, status, fulfilledDate);
        }

        public async Task<bool> DeleteSpecialRequestAsync(Guid requestId)
        {
            return await _specialRequestRepository.DeleteAsync(requestId);
        }

        private static SpecialRequestDto MapToDto(SpecialRequest request)
        {
            return new SpecialRequestDto
            {
                RequestId = request.RequestId,
                BookingId = request.BookingId,
                RequestType = request.RequestType,
                Description = request.Description,
                Status = request.Status,
                RequestDate = request.RequestDate,
                FulfilledDate = request.FulfilledDate
            };
        }
    }
}