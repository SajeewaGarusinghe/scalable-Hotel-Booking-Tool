using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HotelBooking.Models.DTOs;
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
            return MapToRoomDto(rooms);
        }

        public async Task<RoomDto> GetRoomByIdAsync(Guid roomId)
        {
            var room = await _roomRepository.GetByIdAsync(roomId);
            return MapToRoomDto(room);
        }

        public async Task<RoomDto> CreateRoomAsync(RoomDto roomDto)
        {
            var room = MapToRoomEntity(roomDto);
            var createdRoom = await _roomRepository.AddAsync(room);
            return MapToRoomDto(createdRoom);
        }

        public async Task<RoomDto> UpdateRoomAsync(Guid roomId, RoomDto roomDto)
        {
            var room = MapToRoomEntity(roomDto);
            room.Id = roomId;
            var updatedRoom = await _roomRepository.UpdateAsync(room);
            return MapToRoomDto(updatedRoom);
        }

        public async Task DeleteRoomAsync(Guid roomId)
        {
            await _roomRepository.DeleteAsync(roomId);
        }

        private RoomDto MapToRoomDto(Room room)
        {
            return new RoomDto
            {
                Id = room.Id,
                RoomNumber = room.RoomNumber,
                RoomType = room.RoomType,
                MaxOccupancy = room.MaxOccupancy,
                PricePerNight = room.PricePerNight,
                Description = room.Description,
                Amenities = room.Amenities
            };
        }

        private Room MapToRoomEntity(RoomDto roomDto)
        {
            return new Room
            {
                RoomNumber = roomDto.RoomNumber,
                RoomType = roomDto.RoomType,
                MaxOccupancy = roomDto.MaxOccupancy,
                PricePerNight = roomDto.PricePerNight,
                Description = roomDto.Description,
                Amenities = roomDto.Amenities
            };
        }
    }
}