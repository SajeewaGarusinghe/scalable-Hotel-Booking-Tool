export interface WeeklyReport {
  weekStartDate: string;
  weekEndDate: string;
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  totalGuests: number;
  roomTypeStats: RoomTypeStats[];
}

export interface MonthlyReport {
  year: number;
  month: number;
  totalBookings: number;
  totalRevenue: number;
  averageOccupancyRate: number;
  totalGuests: number;
  dailyStats: DailyStats[];
}

export interface RoomTypeStats {
  roomType: string;
  bookingCount: number;
  revenue: number;
  occupancyRate: number;
}

export interface DailyStats {
  date: string;
  bookings: number;
  revenue: number;
  occupancyRate: number;
}

export interface QuickStats {
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  availableRooms: number;
  totalRooms: number;
  totalGuests: number;
  lastUpdated: string;
  roomTypeStats: RoomTypeQuickStats[];
}

export interface RoomTypeQuickStats {
  roomType: string;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  occupancyRate: number;
  averageRate: number;
}

export interface DashboardStats {
  currentStats: QuickStats;
  revenueTrend?: TrendData[];
  revenueTrind?: TrendData[]; // Handle typo in API response
  occupancyTrend: TrendData[];
  upcomingBookings: UpcomingBooking[];
  recentActivities: RecentActivity[];
}

export interface TrendData {
  date: string;
  value: number;
  label: string;
}

export interface UpcomingBooking {
  bookingId: string;
  customerName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
}

export interface RecentActivity {
  activityType: string;
  description: string;
  timestamp: string;
  customerName?: string;
  roomNumber?: string;
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
  customerName: string;
  requestType: string;
  description?: string;
  status: string;
  requestDate: string;
  fulfilledDate?: string;
}

export interface PricePrediction {
  predictionId: string;
  roomType: string;
  predictionDate: string;
  predictedPrice: number;
  confidenceLevel: number;
  modelVersion: string;
  createdAt: string;
  priceFactors: PriceFactor[];
}

export interface PriceFactor {
  factorName: string;
  impact: number;
  description: string;
}

export interface AvailabilityForecast {
  forecastDate: string;
  roomType: string;
  totalRooms: number;
  predictedAvailableRooms: number;
  predictedOccupancyRate: number;
  confidenceLevel: number;
  factors: string[];
}

export interface DemandForecast {
  forecastDate: string;
  roomType: string;
  predictedDemand: number;
  historicalAverage: number;
  demandVariation: number;
  trendDirection: string;
  confidenceLevel: number;
  demandFactors: DemandFactor[];
}

export interface DemandFactor {
  factorName: string;
  impact: number;
  description: string;
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

export interface WeeklyBookingsReport {
  weekStartDate: string;
  weekEndDate: string;
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  totalGuests: number;
  dailyDetails: DailyBookingsDetail[];
  roomTypeStats: RoomTypeStats[];
  generatedAt: string;
}

export interface DailyBookingsDetail {
  date: string;
  dayOfWeek: string;
  totalBookings: number;
  dayRevenue: number;
  dayOccupancyRate: number;
  totalGuests: number;
  bookings: BookingSummary[];
  specialRequests: SpecialRequestSummary[];
}

export interface BookingSummary {
  bookingId: string;
  bookingReference: string;
  customerName: string;
  roomNumber: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  status: string;
}
