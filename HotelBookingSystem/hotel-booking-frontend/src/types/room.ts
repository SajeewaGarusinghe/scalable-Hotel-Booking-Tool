export interface Room {
  roomId: string;
  roomNumber: string;
  roomType: string;
  maxOccupancy: number;
  pricePerNight: number;
  description: string;
  amenities: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomDto {
  roomNumber: string;
  roomType: string;
  maxOccupancy: number;
  pricePerNight: number;
  description: string;
  amenities: string[];
  isActive?: boolean;
}

export interface RoomAvailabilityQuery {
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
}

export interface RoomAvailability {
  roomId: string;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  isAvailable: boolean;
  totalPrice: number;
}
