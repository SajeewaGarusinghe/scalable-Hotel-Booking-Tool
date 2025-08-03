using Microsoft.AspNetCore.Mvc;
using HotelBooking.Models.DTOs;
using HotelBooking.BookingService.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelBooking.BookingService.Controllers
{
    [Route("api/rooms")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly RoomService _roomService;

        public RoomsController(RoomService roomService)
        {
            _roomService = roomService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetAllRooms()
        {
            var rooms = await _roomService.GetAllRoomsAsync();
            return Ok(rooms);
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetActiveRooms()
        {
            var rooms = await _roomService.GetActiveRoomsAsync();
            return Ok(rooms);
        }

        [HttpGet("by-type/{roomType}")]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetRoomsByType(string roomType)
        {
            var rooms = await _roomService.GetRoomsByTypeAsync(roomType);
            return Ok(rooms);
        }

        [HttpGet("{roomId}")]
        public async Task<ActionResult<RoomDto>> GetRoomById(Guid roomId)
        {
            var room = await _roomService.GetRoomByIdAsync(roomId);
            if (room == null)
                return NotFound($"Room with ID {roomId} not found.");

            return Ok(room);
        }

        [HttpGet("availability")]
        public async Task<ActionResult<IEnumerable<AvailableRoomDto>>> GetAvailableRooms([FromQuery] RoomAvailabilityDto availabilityDto)
        {
            try
            {
                var availableRooms = await _roomService.GetAvailableRoomsAsync(
                    availabilityDto.CheckInDate, 
                    availabilityDto.CheckOutDate, 
                    availabilityDto.NumberOfGuests);
                return Ok(availableRooms);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error getting available rooms: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<RoomDto>> CreateRoom([FromBody] CreateRoomDto createRoomDto)
        {
            try
            {
                var createdRoom = await _roomService.CreateRoomAsync(createRoomDto);
                return CreatedAtAction(nameof(GetRoomById), 
                    new { roomId = createdRoom.RoomId }, createdRoom);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating room: {ex.Message}");
            }
        }

        [HttpPut("{roomId}")]
        public async Task<ActionResult<RoomDto>> UpdateRoom(Guid roomId, [FromBody] CreateRoomDto updateRoomDto)
        {
            try
            {
                var updatedRoom = await _roomService.UpdateRoomAsync(roomId, updateRoomDto);
                if (updatedRoom == null)
                    return NotFound($"Room with ID {roomId} not found.");

                return Ok(updatedRoom);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error updating room: {ex.Message}");
            }
        }

        [HttpDelete("{roomId}")]
        public async Task<ActionResult> DeleteRoom(Guid roomId)
        {
            try
            {
                var result = await _roomService.DeleteRoomAsync(roomId);
                if (!result)
                    return NotFound($"Room with ID {roomId} not found.");

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error deleting room: {ex.Message}");
            }
        }
    }
}