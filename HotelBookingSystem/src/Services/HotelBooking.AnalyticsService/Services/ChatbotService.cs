using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using HotelBooking.AnalyticsService.ML;
using HotelBooking.Models.DTOs;

namespace HotelBooking.AnalyticsService.Services
{
    public interface IChatbotService
    {
        Task<ChatbotResponseDto> ProcessQueryAsync(ChatbotQueryDto query);
        Task<List<ChatbotInteractionDto>> GetInteractionHistoryAsync(string customerId);
        Task<List<ChatbotSuggestionDto>> GetSuggestionsAsync(Dictionary<string, object>? context = null);
        Task LogInteractionAsync(ChatbotQueryDto query, ChatbotResponseDto response);
    }

    public class IntelligentChatbotService : IChatbotService
    {
        private readonly INLPService _nlpService;
        private readonly IPredictionService _predictionService;
        private readonly IConversationContextService _contextService;
        private readonly Dictionary<string, ConversationContextDto> _activeSessions;

        public IntelligentChatbotService(
            INLPService nlpService,
            IPredictionService predictionService,
            IConversationContextService contextService)
        {
            _nlpService = nlpService;
            _predictionService = predictionService;
            _contextService = contextService;
            _activeSessions = new Dictionary<string, ConversationContextDto>();
        }

        public async Task<ChatbotResponseDto> ProcessQueryAsync(ChatbotQueryDto query)
        {
            var stopwatch = Stopwatch.StartNew();
            
            try
            {
                // 1. Parse and understand the query
                var intent = await _nlpService.ExtractIntentAsync(query.Query);
                var entities = await _nlpService.ExtractEntitiesAsync(query.Query);
                
                // 2. Update conversation context
                await UpdateConversationContextAsync(query.SessionId, query, intent, entities);
                
                // 3. Generate appropriate response
                var response = await GenerateResponseAsync(intent, entities, query);
                
                response.ProcessingTimeMs = (int)stopwatch.ElapsedMilliseconds;
                
                // 4. Log interaction for learning
                await LogInteractionAsync(query, response);
                
                return response;
            }
            catch (Exception ex)
            {
                return new ChatbotResponseDto
                {
                    Response = "I'm sorry, I encountered an error while processing your request. Please try again.",
                    ResponseType = "error",
                    ConfidenceLevel = 0.0m,
                    ProcessingTimeMs = (int)stopwatch.ElapsedMilliseconds
                };
            }
        }

        private async Task<ChatbotResponseDto> GenerateResponseAsync(
            QueryIntentDto intent,
            Dictionary<string, object> entities,
            ChatbotQueryDto query)
        {
            return intent.Type switch
            {
                "price_prediction" => await HandlePricePredictionQuery(entities),
                "availability_forecast" => await HandleAvailabilityQuery(entities),
                "trend_analysis" => await HandleTrendAnalysisQuery(entities),
                "booking_recommendation" => await HandleBookingRecommendation(entities),
                _ => GenerateDefaultResponse()
            };
        }

        private async Task<ChatbotResponseDto> HandlePricePredictionQuery(Dictionary<string, object> entities)
        {
            try
            {
                var roomType = entities.GetValueOrDefault("roomType", "Standard").ToString();
                var dates = entities.GetValueOrDefault("dates") as List<DateTime> ?? new List<DateTime> { DateTime.Now.AddDays(7) };
                var guests = Convert.ToInt32(entities.GetValueOrDefault("guests", 1));

                var checkInDate = dates.FirstOrDefault();
                if (checkInDate == default)
                    checkInDate = DateTime.Now.AddDays(7);

                // Get price predictions
                var predictions = await _predictionService.GetPricePredictionsAsync(
                    roomType!, 
                    checkInDate.ToString("yyyy-MM-dd"), 
                    checkInDate.AddDays(1).ToString("yyyy-MM-dd"));

                if (predictions.Any())
                {
                    var prediction = predictions.First();
                    var response = $"Based on historical data and current trends, I predict the price for a {roomType} room on {checkInDate:MMM dd, yyyy} will be around ${prediction.PredictedPrice:F2} per night.";
                    
                    if (prediction.ConfidenceLevel.HasValue)
                    {
                        response += $" I'm {(prediction.ConfidenceLevel.Value * 100):F0}% confident in this prediction.";
                    }

                    return new ChatbotResponseDto
                    {
                        Response = response,
                        ResponseType = "prediction",
                        ConfidenceLevel = prediction.ConfidenceLevel ?? 0.7m,
                        Data = new PredictiveChatbotDataDto
                        {
                            Type = "price",
                            RoomType = roomType!,
                            PricePredictions = predictions.ToList()
                        },
                        Suggestions = new List<string>
                        {
                            "Show me availability for this date",
                            "When is the cheapest time to book?",
                            "Compare prices for different room types"
                        }
                    };
                }

                return new ChatbotResponseDto
                {
                    Response = "I don't have enough data to predict pricing for that specific request. Please try with different dates or room types.",
                    ResponseType = "information",
                    ConfidenceLevel = 0.3m
                };
            }
            catch (Exception ex)
            {
                return new ChatbotResponseDto
                {
                    Response = "I encountered an issue while predicting prices. Please try again with a simpler query.",
                    ResponseType = "error",
                    ConfidenceLevel = 0.0m
                };
            }
        }

        private async Task<ChatbotResponseDto> HandleAvailabilityQuery(Dictionary<string, object> entities)
        {
            try
            {
                var roomType = entities.GetValueOrDefault("roomType", "Standard").ToString();
                var period = entities.GetValueOrDefault("period", "next_week").ToString();

                var forecasts = await _predictionService.GetAvailabilityForecastAsync(period!);

                if (forecasts.Any())
                {
                    var relevantForecasts = forecasts.Where(f => f.RoomType.Equals(roomType, StringComparison.OrdinalIgnoreCase)).ToList();
                    
                    if (relevantForecasts.Any())
                    {
                        var avgAvailability = relevantForecasts.Average(f => f.PredictedAvailableRooms);
                        var avgOccupancy = relevantForecasts.Average(f => f.PredictedOccupancyRate) * 100;

                        var response = $"For {roomType} rooms in the {period?.Replace("_", " ")}, I forecast an average of {avgAvailability:F0} rooms will be available, with an occupancy rate of {avgOccupancy:F1}%.";

                        return new ChatbotResponseDto
                        {
                            Response = response,
                            ResponseType = "prediction",
                            ConfidenceLevel = 0.8m,
                            Data = new PredictiveChatbotDataDto
                            {
                                Type = "availability",
                                RoomType = roomType!,
                                AvailabilityForecasts = relevantForecasts
                            },
                            Suggestions = new List<string>
                            {
                                "Show me price trends for this period",
                                "When should I book for the best availability?",
                                "Compare availability across room types"
                            }
                        };
                    }
                }

                return new ChatbotResponseDto
                {
                    Response = "I don't have availability forecast data for that specific request. Please try with different criteria.",
                    ResponseType = "information",
                    ConfidenceLevel = 0.3m
                };
            }
            catch (Exception ex)
            {
                return new ChatbotResponseDto
                {
                    Response = "I encountered an issue while forecasting availability. Please try again.",
                    ResponseType = "error",
                    ConfidenceLevel = 0.0m
                };
            }
        }

        private async Task<ChatbotResponseDto> HandleTrendAnalysisQuery(Dictionary<string, object> entities)
        {
            var roomType = entities.GetValueOrDefault("roomType", "Standard").ToString();
            var period = entities.GetValueOrDefault("period", "this_month").ToString();

            // For now, provide a general trend analysis response
            var response = $"Based on historical booking patterns, {roomType} rooms typically show seasonal variations. " +
                          $"Summer months generally have higher demand and pricing, while winter months offer better deals. " +
                          $"Weekends typically see 20-30% higher rates than weekdays.";

            return new ChatbotResponseDto
            {
                Response = response,
                ResponseType = "information",
                ConfidenceLevel = 0.75m,
                Data = new PredictiveChatbotDataDto
                {
                    Type = "trend",
                    RoomType = roomType!
                },
                Suggestions = new List<string>
                {
                    "Show me specific price predictions",
                    "When is the best time to book?",
                    "Compare trends across room types"
                }
            };
        }

        private async Task<ChatbotResponseDto> HandleBookingRecommendation(Dictionary<string, object> entities)
        {
            var roomType = entities.GetValueOrDefault("roomType", "Standard").ToString();
            var priceRange = entities.GetValueOrDefault("priceRange", "any").ToString();

            var response = "Based on current trends, I recommend: ";

            switch (priceRange)
            {
                case "low":
                    response += "Book 2-3 weeks in advance for weekdays to get the best rates. Avoid holiday periods and major local events.";
                    break;
                case "high":
                    response += "Book premium suites during peak season or special events for the best experience, even if rates are higher.";
                    break;
                default:
                    response += "Book 1-2 weeks in advance for a good balance of price and availability. Consider weekday stays for better rates.";
                    break;
            }

            return new ChatbotResponseDto
            {
                Response = response,
                ResponseType = "suggestion",
                ConfidenceLevel = 0.8m,
                Suggestions = new List<string>
                {
                    "Show me current available rooms",
                    "What are the prices for next week?",
                    "Compare different room types"
                }
            };
        }

        private ChatbotResponseDto GenerateDefaultResponse()
        {
            return new ChatbotResponseDto
            {
                Response = "I can help you with pricing predictions, availability forecasts, and booking recommendations. " +
                          "Try asking me questions like 'What will be the price for a deluxe room next weekend?' or " +
                          "'Show me availability trends for this month'.",
                ResponseType = "information",
                ConfidenceLevel = 0.9m,
                Suggestions = new List<string>
                {
                    "What will be the price for a deluxe room next weekend?",
                    "Show me availability trends for standard rooms",
                    "When is the cheapest time to book?",
                    "What's the occupancy forecast for next week?"
                }
            };
        }

        private async Task UpdateConversationContextAsync(
            string sessionId,
            ChatbotQueryDto query,
            QueryIntentDto intent,
            Dictionary<string, object> entities)
        {
            if (!_activeSessions.ContainsKey(sessionId))
            {
                _activeSessions[sessionId] = new ConversationContextDto
                {
                    SessionId = sessionId,
                    CustomerId = query.CustomerId
                };
            }

            var context = _activeSessions[sessionId];
            context.RecentQueries.Add(query.Query);
            context.LastIntent = intent.Type;
            context.LastInteraction = DateTime.UtcNow;

            // Merge entities with existing context
            foreach (var entity in entities)
            {
                context.ExtractedEntities[entity.Key] = entity.Value;
            }

            // Keep only last 5 queries for context
            if (context.RecentQueries.Count > 5)
            {
                context.RecentQueries.RemoveAt(0);
            }
        }

        public async Task<List<ChatbotInteractionDto>> GetInteractionHistoryAsync(string customerId)
        {
            // In a real implementation, this would query the database
            // For now, return empty list
            return new List<ChatbotInteractionDto>();
        }

        public async Task<List<ChatbotSuggestionDto>> GetSuggestionsAsync(Dictionary<string, object>? context = null)
        {
            return await _nlpService.GenerateSuggestionsAsync(context?.ToString() ?? "");
        }

        public async Task LogInteractionAsync(ChatbotQueryDto query, ChatbotResponseDto response)
        {
            // In a real implementation, this would log to the database
            // For now, just log to console for debugging
            Console.WriteLine($"Chatbot Interaction - Query: {query.Query}, Response: {response.Response}");
        }
    }

    public interface IConversationContextService
    {
        Task<ConversationContextDto> GetContextAsync(string sessionId);
        Task UpdateContextAsync(ConversationContextDto context);
    }

    public class ConversationContextService : IConversationContextService
    {
        private readonly Dictionary<string, ConversationContextDto> _contexts = new();

        public async Task<ConversationContextDto> GetContextAsync(string sessionId)
        {
            return _contexts.GetValueOrDefault(sessionId, new ConversationContextDto { SessionId = sessionId });
        }

        public async Task UpdateContextAsync(ConversationContextDto context)
        {
            _contexts[context.SessionId] = context;
        }
    }
}