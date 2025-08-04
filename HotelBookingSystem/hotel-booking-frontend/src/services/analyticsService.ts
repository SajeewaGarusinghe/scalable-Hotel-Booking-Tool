import { apiClient } from './apiClient';
import { 
  WeeklyReport, 
  MonthlyReport,
  QuickStats,
  DashboardStats,
  PricePrediction, 
  AvailabilityForecast,
  DemandForecast,
  ChatbotQuery, 
  ChatbotResponse 
} from '../types/analytics';

export class AnalyticsService {
  private static readonly REPORTS_BASE = '/api/reports';
  private static readonly PREDICTIONS_BASE = '/api/predictions';
  private static readonly STATISTICS_BASE = '/api/statistics';
  private static readonly CHATBOT_BASE = '/api/chatbot';

  // Statistics
  static async getQuickStatistics(): Promise<QuickStats> {
    return apiClient.get<QuickStats>(`${this.STATISTICS_BASE}/quick`);
  }

  static async getDashboardStatistics(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>(`${this.STATISTICS_BASE}/dashboard`);
  }

  static async getCurrentOccupancyRate(): Promise<number> {
    return apiClient.get<number>(`${this.STATISTICS_BASE}/occupancy/current`);
  }

  static async getTodayRevenue(): Promise<number> {
    return apiClient.get<number>(`${this.STATISTICS_BASE}/revenue/today`);
  }

  static async getUpcomingBookings(days: number = 7): Promise<any[]> {
    const params = new URLSearchParams({ days: days.toString() });
    return apiClient.get<any[]>(`${this.STATISTICS_BASE}/bookings/upcoming?${params}`);
  }

  // Reports
  static async getWeeklyReport(startDate: string, endDate: string): Promise<WeeklyReport> {
    const params = new URLSearchParams({ startDate, endDate });
    return apiClient.get<WeeklyReport>(`${this.REPORTS_BASE}/weekly?${params}`);
  }

  static async getMonthlyReport(year: number, month: number): Promise<MonthlyReport> {
    const params = new URLSearchParams({ 
      year: year.toString(), 
      month: month.toString() 
    });
    return apiClient.get<MonthlyReport>(`${this.REPORTS_BASE}/monthly?${params}`);
  }

  static async getOccupancyReport(roomType?: string, period?: string): Promise<any> {
    const params = new URLSearchParams();
    if (roomType) params.append('roomType', roomType);
    if (period) params.append('period', period);
    
    const queryString = params.toString();
    const url = queryString ? `${this.REPORTS_BASE}/occupancy?${queryString}` : `${this.REPORTS_BASE}/occupancy`;
    return apiClient.get(url);
  }

  static async getRevenueReport(startDate?: string, endDate?: string): Promise<any> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const url = queryString ? `${this.REPORTS_BASE}/revenue?${queryString}` : `${this.REPORTS_BASE}/revenue`;
    return apiClient.get(url);
  }

  static async generateCustomReport(reportData: any): Promise<any> {
    return apiClient.post(`${this.REPORTS_BASE}/custom`, reportData);
  }

  // Predictions
  static async getPricePredictions(roomType: string, checkInDate: string, numberOfNights: string): Promise<PricePrediction[]> {
    // Calculate end date from check-in date and number of nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + parseInt(numberOfNights));
    
    const params = new URLSearchParams({
      roomType,
      startDate: checkInDate,
      endDate: checkOut.toISOString().split('T')[0]
    });
    return apiClient.get<PricePrediction[]>(`${this.PREDICTIONS_BASE}/pricing?${params}`);
  }

  static async getAvailabilityForecast(period: string): Promise<AvailabilityForecast[]> {
    const params = new URLSearchParams({ period });
    return apiClient.get<AvailabilityForecast[]>(`${this.PREDICTIONS_BASE}/availability?${params}`);
  }

  static async getDemandForecast(roomType?: string, period?: string): Promise<DemandForecast[]> {
    const params = new URLSearchParams();
    if (roomType) params.append('roomType', roomType);
    if (period) params.append('period', period);
    
    const queryString = params.toString();
    const url = queryString ? `${this.PREDICTIONS_BASE}/demand?${queryString}` : `${this.PREDICTIONS_BASE}/demand`;
    return apiClient.get<DemandForecast[]>(url);
  }

  // Chatbot
  static async queryChatbot(query: ChatbotQuery): Promise<ChatbotResponse> {
    return apiClient.post<ChatbotResponse>(`${this.CHATBOT_BASE}/query`, query);
  }

  static async getChatbotHistory(customerId: string): Promise<any[]> {
    return apiClient.get<any[]>(`${this.CHATBOT_BASE}/history/${customerId}`);
  }

  // Utility methods
  static formatReportPeriod(startDate: Date, endDate: Date): string {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    return `${start} to ${end}`;
  }

  static getLastWeekDates(): { startDate: string; endDate: string } {
    const today = new Date();
    const endDate = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
    const startDate = new Date(endDate.getTime() - (6 * 24 * 60 * 60 * 1000));
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  }

  static getCurrentMonthDates(): { year: number; month: number } {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1
    };
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  static formatPercentage(rate: number): string {
    return `${(rate * 100).toFixed(1)}%`;
  }
}
