import { apiClient } from './apiClient';
import { 
  WeeklyReport, 
  MonthlyReport,
  QuickStats,
  DashboardStats,
  PricePrediction, 
  AvailabilityForecast,
  DemandForecast,
  WeeklyBookingsReport
} from '../types/analytics';
import {
  ChatbotQuery,
  ChatbotResponse,
  ChatbotMessage,
  ChatbotSuggestion,
  PredictiveChatbotData,
  ChatbotInteraction,
  PredictionRequest
} from '../types/chatbot';

export class EnhancedAnalyticsService {
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
    const stats = await this.getQuickStatistics();
    return stats.occupancyRate;
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

  static async getWeeklyBookingsReport(): Promise<WeeklyBookingsReport> {
    return apiClient.get<WeeklyBookingsReport>(`${this.REPORTS_BASE}/weekly-bookings`);
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
    const params = new URLSearchParams({
      roomType,
      startDate: checkInDate,
      endDate: new Date(new Date(checkInDate).getTime() + parseInt(numberOfNights) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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

  static async getPredictiveAnalytics(request: PredictionRequest): Promise<PredictiveChatbotData> {
    return apiClient.post<PredictiveChatbotData>(`${this.PREDICTIONS_BASE}/analytics`, request);
  }

  // Enhanced Chatbot methods
  static async queryChatbot(query: ChatbotQuery): Promise<ChatbotResponse> {
    // Ensure sessionId is set
    if (!query.sessionId) {
      query.sessionId = this.generateSessionId();
    }
    
    return apiClient.post<ChatbotResponse>(`${this.CHATBOT_BASE}/query`, query);
  }

  static async getChatbotSuggestions(context?: any): Promise<ChatbotSuggestion[]> {
    return apiClient.get<ChatbotSuggestion[]>(`${this.CHATBOT_BASE}/suggestions`, { params: context });
  }

  static async getChatbotHistory(customerId: string): Promise<ChatbotInteraction[]> {
    return apiClient.get<ChatbotInteraction[]>(`${this.CHATBOT_BASE}/history/${customerId}`);
  }

  static async submitChatbotFeedback(interactionId: string, rating: number, comments?: string): Promise<void> {
    return apiClient.post<void>(`${this.CHATBOT_BASE}/feedback`, {
      interactionId,
      rating,
      comments
    });
  }

  static async getChatbotAnalytics(params: any): Promise<PredictiveChatbotData> {
    return apiClient.get<PredictiveChatbotData>(`${this.CHATBOT_BASE}/analytics`, { params });
  }

  // Utility methods
  static formatReportPeriod(startDate: Date, endDate: Date): string {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    return `${start} to ${end}`;
  }

  static getLastWeekDates(): { startDate: string; endDate: string } {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  }

  static generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  // Chatbot message formatting
  static formatChatbotResponse(response: ChatbotResponse): ChatbotMessage {
    return {
      id: `bot_${Date.now()}`,
      type: 'bot',
      content: response.response,
      timestamp: new Date(),
      data: response.data,
      suggestions: response.suggestions,
      processingTimeMs: response.processingTimeMs
    };
  }

  static formatUserMessage(content: string): ChatbotMessage {
    return {
      id: `user_${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date()
    };
  }

  // Quick prediction helpers
  static async getQuickPricePrediction(roomType: string, checkInDate: string): Promise<number | null> {
    try {
      const predictions = await this.getPricePredictions(roomType, checkInDate, '1');
      return predictions.length > 0 ? predictions[0].predictedPrice : null;
    } catch (error) {
      console.error('Error getting quick price prediction:', error);
      return null;
    }
  }

  static async getQuickAvailabilityForecast(roomType: string): Promise<AvailabilityForecast[]> {
    try {
      const forecasts = await this.getAvailabilityForecast('next_week');
      return forecasts.filter(f => f.roomType === roomType);
    } catch (error) {
      console.error('Error getting quick availability forecast:', error);
      return [];
    }
  }

  // Chatbot conversation helpers
  static createTypingMessage(): ChatbotMessage {
    return {
      id: `typing_${Date.now()}`,
      type: 'bot',
      content: '',
      timestamp: new Date(),
      isTyping: true
    };
  }

  static getDefaultSuggestions(): string[] {
    return [
      "What will be the price for a deluxe room next weekend?",
      "Show me availability trends for standard rooms",
      "When is the cheapest time to book?",
      "What's the occupancy forecast for next week?"
    ];
  }

  // Format currency for display
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  // Format percentage for display
  static formatPercentage(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  // Format date for display
  static formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

// Export both the enhanced service and the original interface for backward compatibility
export const AnalyticsService = EnhancedAnalyticsService;
export default EnhancedAnalyticsService;
