using System;
using System.Collections.Generic;

namespace HotelBooking.Models.DTOs
{
    public class ChatbotQueryDto
    {
        public string CustomerId { get; set; } = string.Empty;
        public string SessionId { get; set; } = string.Empty;
        public string Query { get; set; } = string.Empty;
        public Dictionary<string, object>? Context { get; set; }
    }

    public class ChatbotResponseDto
    {
        public string Response { get; set; } = string.Empty;
        public string ResponseType { get; set; } = string.Empty; // prediction, information, suggestion
        public decimal ConfidenceLevel { get; set; }
        public object? Data { get; set; }
        public List<string> Suggestions { get; set; } = new();
        public List<ChatbotChartDataDto>? Charts { get; set; }
        public int ProcessingTimeMs { get; set; }
    }

    public class QueryIntentDto
    {
        public string Type { get; set; } = string.Empty; // price_prediction, availability_forecast, trend_analysis, booking_recommendation
        public decimal Confidence { get; set; }
        public string OriginalQuery { get; set; } = string.Empty;
        public Dictionary<string, object> Entities { get; set; } = new();
    }

    public class ChatbotInteractionDto
    {
        public Guid InteractionId { get; set; }
        public string SessionId { get; set; } = string.Empty;
        public string CustomerId { get; set; } = string.Empty;
        public string Query { get; set; } = string.Empty;
        public string QueryIntent { get; set; } = string.Empty;
        public string ExtractedEntities { get; set; } = string.Empty;
        public string Response { get; set; } = string.Empty;
        public string ResponseType { get; set; } = string.Empty;
        public decimal ConfidenceLevel { get; set; }
        public int ProcessingTimeMs { get; set; }
        public int? UserFeedback { get; set; }
        public DateTime Timestamp { get; set; }
    }

    public class PredictiveChatbotDataDto
    {
        public string Type { get; set; } = string.Empty; // price, availability, trend
        public string RoomType { get; set; } = string.Empty;
        public DateRangeDto? DateRange { get; set; }
        public List<PricePredictionDto>? PricePredictions { get; set; }
        public List<AvailabilityForecastDto>? AvailabilityForecasts { get; set; }
        public List<DemandForecastDto>? DemandForecasts { get; set; }
        public TrendAnalysisDto? TrendAnalysis { get; set; }
    }

    public class DateRangeDto
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }

    public class ChatbotChartDataDto
    {
        public string Type { get; set; } = string.Empty; // line, bar, pie
        public string Title { get; set; } = string.Empty;
        public List<ChartPointDto> Data { get; set; } = new();
    }

    public class ChartPointDto
    {
        public string Label { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public DateTime? Date { get; set; }
    }

    public class ConversationContextDto
    {
        public string SessionId { get; set; } = string.Empty;
        public string CustomerId { get; set; } = string.Empty;
        public List<string> RecentQueries { get; set; } = new();
        public Dictionary<string, object> ExtractedEntities { get; set; } = new();
        public string LastIntent { get; set; } = string.Empty;
        public DateTime LastInteraction { get; set; }
    }

    public class ChatbotSuggestionDto
    {
        public string Text { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // quick_question, follow_up, related_query
        public Dictionary<string, object>? Parameters { get; set; }
    }
}
