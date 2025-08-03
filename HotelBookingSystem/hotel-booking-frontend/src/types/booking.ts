export interface Booking {
  bookingId: string;
  customerId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  bookingStatus: 'Confirmed' | 'Cancelled' | 'Pending' | 'CheckedIn' | 'CheckedOut';
  isRecurring: boolean;
  recurrencePattern?: string;
  bookingReference: string;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  room?: Room;
  specialRequests?: SpecialRequest[];
}

export interface CreateBookingDto {
  customerId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  isRecurring?: boolean;
  recurrencePattern?: string;
}

export interface SpecialRequest {
  requestId: string;
  bookingId: string;
  requestType: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Fulfilled' | 'Rejected';
  requestDate: string;
  fulfilledDate?: string;
}

export interface CreateSpecialRequestDto {
  requestType: string;
  description: string;
}

import { Customer } from './customer';
import { Room } from './room';
