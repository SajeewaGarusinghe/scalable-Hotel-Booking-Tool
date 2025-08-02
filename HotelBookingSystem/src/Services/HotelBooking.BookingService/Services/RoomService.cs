using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelBooking.Models.DTOs;
using HotelBooking.Models.Entities;
using HotelBooking.Data.Repositories;

namespace HotelBooking.BookingService.Services
{
    public class RoomService
    {
        private readonly IRoomRepository _roomRepository;

        public RoomService(IRoomRepository roomRepository)
        {
            _roomRepository = roomRepository;
        }

        public async Task<IEnumerable<RoomDto>> GetAllRoomsAsync()
        {
            var rooms = await _roomRepository.GetAllAsync();
            return rooms.Select(MapToRoomDto);
        }

        public async Task<IEnumerable<RoomDto>> GetActiveRoomsAsync()
        {
            var rooms = await _roomRepository.GetActiveRoomsAsync();
            return rooms.Select(MapToRoomDto);
        }

        public async Task<IEnumerable<RoomDto>> GetRoomsByTypeAsync(string roomType)
        {
            var rooms = await _roomRepository.GetRoomsByTypeAsync(roomType);
            return rooms.Select(MapToRoomDto);
        }

        public async Task<RoomDto?> GetRoomByIdAsync(Guid roomId)
        {
            var room = await _roomRepository.GetByIdAsync(roomId);
            return room == null ? null : MapToRoomDto(room);
        }

        public async Task<IEnumerable<AvailableRoomDto>> GetAvailableRoomsAsync(DateTime checkInDate, DateTime checkOutDate, int guests)
        {
            var rooms = await _roomRepository.GetAvailableRoomsAsync(checkInDate, checkOutDate, guests);
            var numberOfNights = (checkOutDate - checkInDate).Days;
            
            return rooms.Select(room => new AvailableRoomDto
            {
                RoomId = room.RoomId,
                RoomNumber = room.RoomNumber,
                RoomType = room.RoomType,
                MaxOccupancy = room.MaxOccupancy,
                PricePerNight = room.PricePerNight,
                Description = room.Description,
                Amenities = room.Amenities,
                NumberOfNights = numberOfNights,
                TotalPrice = room.PricePerNight * numberOfNights
            });
        }

        public async Task<RoomDto> CreateRoomAsync(CreateRoomDto createRoomDto)
        {
            var room = new Room
            {
                RoomNumber = createRoomDto.RoomNumber,
                RoomType = createRoomDto.RoomType,
                MaxOccupancy = createRoomDto.MaxOccupancy,
                PricePerNight = createRoomDto.PricePerNight,
                Description = createRoomDto.Description,
                Amenities = createRoomDto.Amenities,
                IsActive = createRoomDto.IsActive
            };

            var createdRoom = await _roomRepository.AddAsync(room);
            return MapToRoomDto(createdRoom);
        }

        public async Task<RoomDto?> UpdateRoomAsync(Guid roomId, CreateRoomDto updateRoomDto)
        {
            var existingRoom = await _roomRepository.GetByIdAsync(roomId);
            if (existingRoom == null)
                return null;

            existingRoom.RoomNumber = updateRoomDto.RoomNumber;
            existingRoom.RoomType = updateRoomDto.RoomType;
            existingRoom.MaxOccupancy = updateRoomDto.MaxOccupancy;
            existingRoom.PricePerNight = updateRoomDto.PricePerNight;
            existingRoom.Description = updateRoomDto.Description;
            existingRoom.Amenities = updateRoomDto.Amenities;
            existingRoom.IsActive = updateRoomDto.IsActive;
            existingRoom.UpdatedAt = DateTime.UtcNow;

            var updatedRoom = await _roomRepository.UpdateAsync(existingRoom);
            return MapToRoomDto(updatedRoom);
        }

        public async Task<bool> DeleteRoomAsync(Guid roomId)
        {
            return await _roomRepository.DeleteAsync(roomId);
        }

        public async Task<bool> IsRoomAvailableAsync(Guid roomId, DateTime checkInDate, DateTime checkOutDate)
        {
            return await _roomRepository.IsRoomAvailableAsync(roomId, checkInDate, checkOutDate);
        }

        private static RoomDto MapToRoomDto(Room room)
        {
            return new RoomDto
            {
                RoomId = room.RoomId,
                RoomNumber = room.RoomNumber,
                RoomType = room.RoomType,
                MaxOccupancy = room.MaxOccupancy,
                PricePerNight = room.PricePerNight,
                Description = room.Description,
                Amenities = room.Amenities,
                IsActive = room.IsActive,
                CreatedAt = room.CreatedAt,
                UpdatedAt = room.UpdatedAt
            };
        }
    }
}