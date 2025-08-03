export interface WeeklyReport {
  reportId?: string;
  startDate?: string;
  endDate?: string;
  totalBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  occupancyRate: number;
  bookings?: BookingSummary[];
  specialRequests?: SpecialRequestSummary[];
}

export interface BookingSummary {
  bookingId: string;
  customerName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: string;
}

export interface SpecialRequestSummary {
  requestId: string;
  bookingReference: string;
  requestType: string;
  status: string;
  requestDate: string;
}

export interface PricePrediction {
  roomType?: string;
  checkInDate?: string;
  numberOfNights?: number;
  predictedPrice: number;
  confidenceLevel?: number;
  factors?: string[];
}

export interface AvailabilityForecast {
  date: string;
  roomType: string;
  predictedAvailability: number;
  demandLevel: 'Low' | 'Medium' | 'High';
}

export interface ChatbotQuery {
  query: string;
  customerId?: string;
}

export interface ChatbotResponse {
  response: string;
  data?: any;
  suggestions?: string[];
}
