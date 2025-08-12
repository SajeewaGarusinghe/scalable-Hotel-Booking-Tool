using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using HotelBooking.Models.DTOs;

namespace HotelBooking.AnalyticsService.Services
{
    public interface INLPService
    {
        Task<QueryIntentDto> ExtractIntentAsync(string query);
        Task<Dictionary<string, object>> ExtractEntitiesAsync(string query);
        Task<List<ChatbotSuggestionDto>> GenerateSuggestionsAsync(string context);
    }

    public class NLPService : INLPService
    {
        private readonly Dictionary<string, List<string>> _intentKeywords;
        private readonly List<string> _roomTypes;
        private readonly Dictionary<string, string> _timeKeywords;

        public NLPService()
        {
            _intentKeywords = InitializeIntentKeywords();
            _roomTypes = new List<string> { "standard", "deluxe", "suite", "executive", "presidential" };
            _timeKeywords = InitializeTimeKeywords();
        }

        public async Task<QueryIntentDto> ExtractIntentAsync(string query)
        {
            var normalizedQuery = NormalizeQuery(query);
            var keywords = ExtractKeywords(normalizedQuery);
            
            var intent = ClassifyIntent(keywords, normalizedQuery);
            var confidence = CalculateIntentConfidence(intent, keywords, normalizedQuery);
            
            return new QueryIntentDto
            {
                Type = intent,
                Confidence = confidence,
                OriginalQuery = query
            };
        }

        public async Task<Dictionary<string, object>> ExtractEntitiesAsync(string query)
        {
            var entities = new Dictionary<string, object>();
            var normalizedQuery = query.ToLowerInvariant();
            
            // Extract dates
            entities["dates"] = ExtractDates(query);
            
            // Extract room types
            entities["roomType"] = ExtractRoomType(normalizedQuery);
            
            // Extract guest count
            entities["guests"] = ExtractGuestCount(normalizedQuery);
            
            // Extract time periods
            entities["period"] = ExtractTimePeriod(normalizedQuery);
            
            // Extract price range
            entities["priceRange"] = ExtractPriceRange(normalizedQuery);
            
            return entities;
        }

        public async Task<List<ChatbotSuggestionDto>> GenerateSuggestionsAsync(string context)
        {
            var suggestions = new List<ChatbotSuggestionDto>();
            
            // Add common quick questions
            suggestions.AddRange(new[]
            {
                new ChatbotSuggestionDto
                {
                    Text = "What will be the price for a deluxe room next weekend?",
                    Type = "quick_question"
                },
                new ChatbotSuggestionDto
                {
                    Text = "Show me availability trends for this month",
                    Type = "quick_question"
                },
                new ChatbotSuggestionDto
                {
                    Text = "When is the cheapest time to book?",
                    Type = "quick_question"
                },
                new ChatbotSuggestionDto
                {
                    Text = "What's the occupancy forecast for next week?",
                    Type = "quick_question"
                }
            });
            
            return suggestions;
        }

        private Dictionary<string, List<string>> InitializeIntentKeywords()
        {
            return new Dictionary<string, List<string>>
            {
                ["price_prediction"] = new List<string>
                {
                    "price", "cost", "rate", "pricing", "expensive", "cheap", "affordable",
                    "how much", "what will", "predict", "forecast", "estimate"
                },
                ["availability_forecast"] = new List<string>
                {
                    "available", "availability", "rooms", "vacant", "occupied", "occupancy",
                    "book", "booking", "reserve", "free", "open"
                },
                ["trend_analysis"] = new List<string>
                {
                    "trend", "trends", "pattern", "patterns", "analysis", "statistics",
                    "historical", "past", "future", "increase", "decrease"
                },
                ["booking_recommendation"] = new List<string>
                {
                    "recommend", "suggestion", "best", "optimal", "when", "should",
                    "advice", "better", "ideal"
                },
                ["general_inquiry"] = new List<string>
                {
                    "what", "how", "when", "where", "why", "help", "information"
                }
            };
        }

        private Dictionary<string, string> InitializeTimeKeywords()
        {
            return new Dictionary<string, string>
            {
                ["next week"] = "next_week",
                ["this week"] = "this_week",
                ["next month"] = "next_month",
                ["this month"] = "this_month",
                ["weekend"] = "weekend",
                ["next weekend"] = "next_weekend",
                ["holiday"] = "holiday",
                ["summer"] = "summer",
                ["winter"] = "winter",
                ["spring"] = "spring",
                ["fall"] = "fall",
                ["autumn"] = "fall"
            };
        }

        private string NormalizeQuery(string query)
        {
            return query.ToLowerInvariant().Trim();
        }

        private List<string> ExtractKeywords(string normalizedQuery)
        {
            // Simple keyword extraction - split by spaces and remove common words
            var commonWords = new HashSet<string> { "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "is", "are", "was", "were" };
            
            return normalizedQuery
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Where(word => !commonWords.Contains(word) && word.Length > 2)
                .ToList();
        }

        private string ClassifyIntent(List<string> keywords, string normalizedQuery)
        {
            var intentScores = new Dictionary<string, int>();
            
            foreach (var intent in _intentKeywords.Keys)
            {
                intentScores[intent] = 0;
                
                foreach (var keyword in _intentKeywords[intent])
                {
                    if (normalizedQuery.Contains(keyword))
                    {
                        intentScores[intent] += keyword.Length; // Longer matches get higher scores
                    }
                }
            }
            
            var bestIntent = intentScores.OrderByDescending(kvp => kvp.Value).FirstOrDefault();
            return bestIntent.Value > 0 ? bestIntent.Key : "general_inquiry";
        }

        private decimal CalculateIntentConfidence(string intent, List<string> keywords, string normalizedQuery)
        {
            if (!_intentKeywords.ContainsKey(intent))
                return 0.5m;
            
            var matchedKeywords = _intentKeywords[intent]
                .Count(keyword => normalizedQuery.Contains(keyword));
            
            var confidence = (decimal)matchedKeywords / _intentKeywords[intent].Count;
            return Math.Min(1.0m, Math.Max(0.3m, confidence));
        }

        private List<DateTime> ExtractDates(string query)
        {
            var dates = new List<DateTime>();
            
            // Extract explicit dates (YYYY-MM-DD format)
            var datePattern = @"\b\d{4}-\d{2}-\d{2}\b";
            var dateMatches = Regex.Matches(query, datePattern);
            
            foreach (Match match in dateMatches)
            {
                if (DateTime.TryParseExact(match.Value, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
                {
                    dates.Add(date);
                }
            }
            
            // Extract relative dates
            var now = DateTime.Now;
            var lowerQuery = query.ToLowerInvariant();
            
            if (lowerQuery.Contains("tomorrow"))
                dates.Add(now.AddDays(1));
            else if (lowerQuery.Contains("next week"))
                dates.Add(now.AddDays(7));
            else if (lowerQuery.Contains("next month"))
                dates.Add(now.AddMonths(1));
            else if (lowerQuery.Contains("next weekend"))
            {
                var daysUntilWeekend = ((int)DayOfWeek.Saturday - (int)now.DayOfWeek + 7) % 7;
                dates.Add(now.AddDays(daysUntilWeekend));
            }
            
            return dates;
        }

        private string ExtractRoomType(string normalizedQuery)
        {
            foreach (var roomType in _roomTypes)
            {
                if (normalizedQuery.Contains(roomType))
                {
                    return char.ToUpperInvariant(roomType[0]) + roomType.Substring(1);
                }
            }
            
            return "Standard"; // Default room type
        }

        private int ExtractGuestCount(string normalizedQuery)
        {
            // Look for numbers followed by "guest", "person", "people"
            var guestPattern = @"(\d+)\s*(guest|person|people)";
            var match = Regex.Match(normalizedQuery, guestPattern);
            
            if (match.Success && int.TryParse(match.Groups[1].Value, out var count))
            {
                return count;
            }
            
            // Look for standalone numbers (1-10)
            var numberPattern = @"\b([1-9]|10)\b";
            var numberMatch = Regex.Match(normalizedQuery, numberPattern);
            
            if (numberMatch.Success && int.TryParse(numberMatch.Groups[1].Value, out var number))
            {
                return number;
            }
            
            return 1; // Default guest count
        }

        private string ExtractTimePeriod(string normalizedQuery)
        {
            foreach (var timeKeyword in _timeKeywords)
            {
                if (normalizedQuery.Contains(timeKeyword.Key))
                {
                    return timeKeyword.Value;
                }
            }
            
            return "general";
        }

        private string ExtractPriceRange(string normalizedQuery)
        {
            if (normalizedQuery.Contains("cheap") || normalizedQuery.Contains("affordable") || normalizedQuery.Contains("budget"))
                return "low";
            else if (normalizedQuery.Contains("expensive") || normalizedQuery.Contains("luxury") || normalizedQuery.Contains("premium"))
                return "high";
            else if (normalizedQuery.Contains("mid") || normalizedQuery.Contains("moderate"))
                return "medium";
            
            return "any";
        }
    }
}
