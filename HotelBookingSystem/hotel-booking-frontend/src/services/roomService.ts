import { apiClient } from './apiClient';
import { Room, CreateRoomDto, UpdateRoomDto } from '../types/room';

export class RoomService {
  private static baseUrl = '/api/rooms';

  static async getAllRooms(): Promise<Room[]> {
    return await apiClient.get<Room[]>(this.baseUrl);
  }

  static async getRoomById(id: number): Promise<Room> {
    return await apiClient.get<Room>(`${this.baseUrl}/${id}`);
  }

  static async createRoom(roomData: CreateRoomDto): Promise<Room> {
    try {
      // Convert amenities array to JSON string if it's an array
      const formattedData = {
        ...roomData,
        amenities: Array.isArray(roomData.amenities) 
          ? JSON.stringify(roomData.amenities)
          : roomData.amenities
      };

      console.log('Sending room data:', formattedData);

      return await apiClient.post<Room>(this.baseUrl, formattedData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  static async updateRoom(id: number, roomData: UpdateRoomDto): Promise<Room> {
    try {
      // Convert amenities array to JSON string if it's an array
      const formattedData = {
        ...roomData,
        amenities: Array.isArray(roomData.amenities) 
          ? JSON.stringify(roomData.amenities)
          : roomData.amenities
      };

      return await apiClient.put<Room>(`${this.baseUrl}/${id}`, formattedData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  }

  static async deleteRoom(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  static async getRoomsByType(roomType: string): Promise<Room[]> {
    return await apiClient.get<Room[]>(`${this.baseUrl}/type/${roomType}`);
  }

  static async getAvailableRooms(checkIn?: string, checkOut?: string): Promise<Room[]> {
    const params = new URLSearchParams();
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    
    return await apiClient.get<Room[]>(`${this.baseUrl}/available?${params.toString()}`);
  }
}

export default RoomService;
