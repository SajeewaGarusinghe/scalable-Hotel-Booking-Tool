// Enhanced analytics types for chatbot functionality
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
  recentActivity: RecentActivity[];
}

export interface TrendData {
  date: string;
  value: number;
  label?: string;
}

export interface UpcomingBooking {
  bookingId: string;
  customerName: string;
  roomNumber: string;
  checkInDate: string;
  totalAmount: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

// Chatbot-specific interfaces
export interface ChatbotQuery {
  query: string;
  customerId?: string;
  sessionId?: string;
  context?: Record<string, any>;
}

export interface ChatbotResponse {
  response: string;
  responseType: string; // prediction, information, suggestion, error
  confidenceLevel: number;
  data?: PredictiveChatbotData;
  suggestions?: string[];
  charts?: ChartData[];
  processingTimeMs: number;
}

export interface PredictiveChatbotData {
  type: 'price' | 'availability' | 'trend';
  roomType?: string;
  dateRange?: { start: string; end: string };
  pricePredictions?: PricePrediction[];
  availabilityForecasts?: AvailabilityForecast[];
  demandForecasts?: DemandForecast[];
  trendAnalysis?: TrendAnalysis;
}

export interface PricePrediction {
  predictionId?: string;
  roomType: string;
  predictionDate: string;
  predictedPrice: number;
  confidenceLevel?: number;
  modelVersion?: string;
  createdAt?: string;
  factors?: string[];
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

export interface TrendAnalysis {
  roomType: string;
  analysisDate: string;
  trendDirection: string;
  trendStrength: number;
  trendPoints: TrendPoint[];
  insights: string[];
}

export interface TrendPoint {
  date: string;
  value: number;
  label: string;
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie';
  title: string;
  data: ChartPoint[];
}

export interface ChartPoint {
  label: string;
  value: number;
  date?: string;
}

export interface ChatbotMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  data?: PredictiveChatbotData;
  suggestions?: string[];
  isTyping?: boolean;
  processingTimeMs?: number;
}

export interface ChatbotSuggestion {
  text: string;
  type: 'quick_question' | 'follow_up' | 'related_query';
  parameters?: Record<string, any>;
}

export interface ChatbotInteraction {
  interactionId: string;
  sessionId: string;
  customerId: string;
  query: string;
  queryIntent: string;
  extractedEntities: string;
  response: string;
  responseType: string;
  confidenceLevel: number;
  processingTimeMs: number;
  userFeedback?: number;
  timestamp: string;
}

export interface ConversationContext {
  sessionId: string;
  customerId: string;
  recentQueries: string[];
  extractedEntities: Record<string, any>;
  lastIntent: string;
  lastInteraction: string;
}

// Prediction request/response interfaces
export interface PredictionRequest {
  roomType: string;
  startDate: string;
  endDate: string;
  predictionType: 'price' | 'availability' | 'demand';
  parameters?: PredictionParameters;
}

export interface PredictionParameters {
  includeSeasonality: boolean;
  includeEvents: boolean;
  includeWeatherImpact: boolean;
  historicalDays: number;
  confidenceThreshold: number;
}
