using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HotelBooking.Models.Entities;
using HotelBooking.Data.Repositories;
using HotelBooking.Models.DTOs;

namespace HotelBooking.BookingService.Services
{
    public class BookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IRoomRepository _roomRepository;

        public BookingService(IBookingRepository bookingRepository, IRoomRepository roomRepository)
        {
            _bookingRepository = bookingRepository;
            _roomRepository = roomRepository;
        }

        public async Task<BookingDto> CreateBookingAsync(BookingDto bookingDto)
        {
            var booking = new Booking
            {
                CustomerId = bookingDto.CustomerId,
                RoomId = bookingDto.RoomId,
                CheckInDate = bookingDto.CheckInDate,
                CheckOutDate = bookingDto.CheckOutDate,
                NumberOfGuests = bookingDto.NumberOfGuests,
                TotalAmount = bookingDto.TotalAmount,
                BookingStatus = bookingDto.BookingStatus,
                IsRecurring = bookingDto.IsRecurring,
                RecurrencePattern = bookingDto.RecurrencePattern,
                BookingReference = bookingDto.BookingReference,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _bookingRepository.AddAsync(booking);
            return bookingDto;
        }

        public async Task<BookingDto> GetBookingByIdAsync(Guid bookingId)
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            return new BookingDto
            {
                BookingId = booking.BookingId,
                CustomerId = booking.CustomerId,
                RoomId = booking.RoomId,
                CheckInDate = booking.CheckInDate,
                CheckOutDate = booking.CheckOutDate,
                NumberOfGuests = booking.NumberOfGuests,
                TotalAmount = booking.TotalAmount,
                BookingStatus = booking.BookingStatus,
                IsRecurring = booking.IsRecurring,
                RecurrencePattern = booking.RecurrencePattern,
                BookingReference = booking.BookingReference,
                CreatedAt = booking.CreatedAt,
                UpdatedAt = booking.UpdatedAt
            };
        }

        public async Task<IEnumerable<BookingDto>> GetAllBookingsAsync()
        {
            var bookings = await _bookingRepository.GetAllAsync();
            var bookingDtos = new List<BookingDto>();

            foreach (var booking in bookings)
            {
                bookingDtos.Add(new BookingDto
                {
                    BookingId = booking.BookingId,
                    CustomerId = booking.CustomerId,
                    RoomId = booking.RoomId,
                    CheckInDate = booking.CheckInDate,
                    CheckOutDate = booking.CheckOutDate,
                    NumberOfGuests = booking.NumberOfGuests,
                    TotalAmount = booking.TotalAmount,
                    BookingStatus = booking.BookingStatus,
                    IsRecurring = booking.IsRecurring,
                    RecurrencePattern = booking.RecurrencePattern,
                    BookingReference = booking.BookingReference,
                    CreatedAt = booking.CreatedAt,
                    UpdatedAt = booking.UpdatedAt
                });
            }

            return bookingDtos;
        }

        public async Task UpdateBookingAsync(Guid bookingId, BookingDto bookingDto)
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking != null)
            {
                booking.CheckInDate = bookingDto.CheckInDate;
                booking.CheckOutDate = bookingDto.CheckOutDate;
                booking.NumberOfGuests = bookingDto.NumberOfGuests;
                booking.TotalAmount = bookingDto.TotalAmount;
                booking.UpdatedAt = DateTime.UtcNow;

                await _bookingRepository.UpdateAsync(booking);
            }
        }

        public async Task DeleteBookingAsync(Guid bookingId)
        {
            await _bookingRepository.DeleteAsync(bookingId);
        }
    }
}