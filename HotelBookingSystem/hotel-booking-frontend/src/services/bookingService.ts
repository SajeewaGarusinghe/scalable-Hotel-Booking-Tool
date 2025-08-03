import { apiClient } from './apiClient';
import { 
  Booking, 
  CreateBookingDto, 
  SpecialRequest, 
  CreateSpecialRequestDto 
} from '../types/booking';
import { QueryParams } from '../types/api';

export class BookingService {
  private static readonly BOOKINGS_BASE = '/api/bookings';
  private static readonly SPECIAL_REQUESTS_BASE = '/api/special-requests';

  // Booking methods
  static async getBookings(params?: QueryParams): Promise<Booking[]> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    const url = queryString ? `${this.BOOKINGS_BASE}?${queryString}` : this.BOOKINGS_BASE;
    return apiClient.get<Booking[]>(url);
  }

  static async getBookingById(bookingId: string): Promise<Booking> {
    return apiClient.get<Booking>(`${this.BOOKINGS_BASE}/${bookingId}`);
  }

  static async getBookingsByCustomer(customerId: string): Promise<Booking[]> {
    return apiClient.get<Booking[]>(`${this.BOOKINGS_BASE}/customer/${customerId}`);
  }

  static async createBooking(bookingData: CreateBookingDto): Promise<Booking> {
    return apiClient.post<Booking>(this.BOOKINGS_BASE, bookingData);
  }

  static async updateBooking(bookingId: string, bookingData: Partial<CreateBookingDto>): Promise<Booking> {
    return apiClient.put<Booking>(`${this.BOOKINGS_BASE}/${bookingId}`, bookingData);
  }

  static async cancelBooking(bookingId: string): Promise<void> {
    return apiClient.delete<void>(`${this.BOOKINGS_BASE}/${bookingId}`);
  }

  // Special Request methods
  static async getSpecialRequestsByBooking(bookingId: string): Promise<SpecialRequest[]> {
    return apiClient.get<SpecialRequest[]>(`${this.SPECIAL_REQUESTS_BASE}/booking/${bookingId}`);
  }

  static async getPendingSpecialRequests(): Promise<SpecialRequest[]> {
    return apiClient.get<SpecialRequest[]>(`${this.SPECIAL_REQUESTS_BASE}/pending`);
  }

  static async getSpecialRequestById(requestId: string): Promise<SpecialRequest> {
    return apiClient.get<SpecialRequest>(`${this.SPECIAL_REQUESTS_BASE}/${requestId}`);
  }

  static async createSpecialRequest(bookingId: string, requestData: CreateSpecialRequestDto): Promise<SpecialRequest> {
    return apiClient.post<SpecialRequest>(`${this.SPECIAL_REQUESTS_BASE}/booking/${bookingId}`, requestData);
  }

  static async updateSpecialRequestStatus(requestId: string, status: string): Promise<SpecialRequest> {
    return apiClient.put<SpecialRequest>(`${this.SPECIAL_REQUESTS_BASE}/${requestId}/status`, { status });
  }

  static async deleteSpecialRequest(requestId: string): Promise<void> {
    return apiClient.delete<void>(`${this.SPECIAL_REQUESTS_BASE}/${requestId}`);
  }

  // Utility methods
  static calculateTotalAmount(checkInDate: string, checkOutDate: string, pricePerNight: number): number {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights * pricePerNight;
  }

  static generateBookingReference(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 5);
    return `HB-${timestamp}-${random}`.toUpperCase();
  }
}

export default BookingService;
