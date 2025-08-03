import { apiClient } from './apiClient';
import { 
  Room, 
  CreateRoomDto, 
  RoomAvailabilityQuery, 
  RoomAvailability 
} from '../types/room';
import { ApiResponse, PaginatedResponse, QueryParams } from '../types/api';

export class RoomService {
  private static readonly ROOMS_BASE = '/api/rooms';

  static async getRooms(params?: QueryParams): Promise<Room[]> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    const url = queryString ? `${this.ROOMS_BASE}?${queryString}` : this.ROOMS_BASE;
    return apiClient.get<Room[]>(url);
  }

  static async getActiveRooms(): Promise<Room[]> {
    return apiClient.get<Room[]>(`${this.ROOMS_BASE}/active`);
  }

  static async getRoomsByType(roomType: string): Promise<Room[]> {
    return apiClient.get<Room[]>(`${this.ROOMS_BASE}/by-type/${encodeURIComponent(roomType)}`);
  }

  static async getRoomById(roomId: string): Promise<Room> {
    return apiClient.get<Room>(`${this.ROOMS_BASE}/${roomId}`);
  }

  static async checkAvailability(query: RoomAvailabilityQuery): Promise<RoomAvailability[]> {
    const params = new URLSearchParams({
      checkInDate: query.checkInDate,
      checkOutDate: query.checkOutDate,
      numberOfGuests: query.numberOfGuests.toString()
    });
    
    return apiClient.get<RoomAvailability[]>(`${this.ROOMS_BASE}/availability?${params}`);
  }

  static async createRoom(roomData: CreateRoomDto): Promise<Room> {
    return apiClient.post<Room>(this.ROOMS_BASE, roomData);
  }

  static async updateRoom(roomId: string, roomData: Partial<CreateRoomDto>): Promise<Room> {
    return apiClient.put<Room>(`${this.ROOMS_BASE}/${roomId}`, roomData);
  }

  static async deleteRoom(roomId: string): Promise<void> {
    return apiClient.delete<void>(`${this.ROOMS_BASE}/${roomId}`);
  }

  static async getRoomTypes(): Promise<string[]> {
    const rooms = await this.getRooms();
    const typeSet = new Set(rooms.map(room => room.roomType));
    const types = Array.from(typeSet);
    return types.sort();
  }
}

export default RoomService;
