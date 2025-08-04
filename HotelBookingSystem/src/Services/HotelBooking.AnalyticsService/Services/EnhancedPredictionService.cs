using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelBooking.AnalyticsService.ML;
using HotelBooking.Models.DTOs;

namespace HotelBooking.AnalyticsService.Services
{
    public interface IPredictionService
    {
        Task<List<PricePredictionDto>> GetPricePredictionsAsync(string roomType, string startDate, string endDate);
        Task<List<AvailabilityForecastDto>> GetAvailabilityForecastAsync(string period);
        Task<List<DemandForecastDto>> GetDemandForecastAsync(string roomType, string period);
        Task<TrendAnalysisDto> GetPriceTrendsAsync(string roomType, DateTime startDate, DateTime endDate);
    }

    public class EnhancedPredictionService : IPredictionService
    {
        private readonly AdvancedPricePredictionModel _pricePredictionModel;
        private readonly AvailabilityPredictionModel _availabilityModel;

        public EnhancedPredictionService()
        {
            _pricePredictionModel = new AdvancedPricePredictionModel();
            _availabilityModel = new AvailabilityPredictionModel();
        }

        public async Task<List<PricePredictionDto>> GetPricePredictionsAsync(string roomType, string startDate, string endDate)
        {
            var predictions = new List<PricePredictionDto>();
            
            if (!DateTime.TryParse(startDate, out var start) || !DateTime.TryParse(endDate, out var end))
            {
                start = DateTime.Now.AddDays(1);
                end = DateTime.Now.AddDays(7);
            }

            var current = start;
            while (current <= end)
            {
                var input = new EnhancedPricePredictionInput
                {
                    RoomType = roomType,
                    CheckInDate = current,
                    CheckOutDate = current.AddDays(1),
                    NumberOfGuests = 2,
                    DaysInAdvance = (current - DateTime.Now).Days,
                    IsWeekend = current.DayOfWeek == DayOfWeek.Saturday || current.DayOfWeek == DayOfWeek.Sunday,
                    IsHoliday = IsHoliday(current),
                    Season = GetSeason(current),
                    HistoricalAveragePrice = GetHistoricalAveragePrice(roomType),
                    HistoricalOccupancyRate = GetHistoricalOccupancyRate(roomType),
                    LocalEvents = GetLocalEventsCount(current)
                };

                var result = await _pricePredictionModel.PredictPriceWithTrendsAsync(input);

                predictions.Add(new PricePredictionDto
                {
                    PredictionId = Guid.NewGuid(),
                    RoomType = roomType,
                    PredictionDate = current,
                    PredictedPrice = (decimal)result.PredictedPrice,
                    ConfidenceLevel = result.ConfidenceLevel,
                    ModelVersion = "v2.0",
                    CreatedAt = DateTime.UtcNow
                });

                current = current.AddDays(1);
            }

            return predictions;
        }

        public async Task<List<AvailabilityForecastDto>> GetAvailabilityForecastAsync(string period)
        {
            var forecasts = new List<AvailabilityForecastDto>();
            var roomTypes = new[] { "Standard", "Deluxe", "Suite", "Executive" };
            
            var (startDate, endDate) = ParsePeriod(period);

            foreach (var roomType in roomTypes)
            {
                var current = startDate;
                while (current <= endDate)
                {
                    var input = new AvailabilityPredictionInput
                    {
                        PredictionDate = current,
                        RoomType = roomType,
                        TotalRoomsOfType = GetTotalRoomsOfType(roomType),
                        HistoricalOccupancyRate = GetHistoricalOccupancyRate(roomType),
                        IsWeekend = current.DayOfWeek == DayOfWeek.Saturday || current.DayOfWeek == DayOfWeek.Sunday,
                        IsHoliday = IsHoliday(current),
                        Season = GetSeason(current),
                        BookingTrend = GetBookingTrend(roomType),
                        LocalEvents = GetLocalEventsCount(current)
                    };

                    var result = await _availabilityModel.PredictAvailabilityAsync(input);

                    forecasts.Add(new AvailabilityForecastDto
                    {
                        ForecastDate = current,
                        RoomType = roomType,
                        TotalRooms = input.TotalRoomsOfType,
                        PredictedAvailableRooms = result.PredictedAvailableRooms,
                        PredictedOccupancyRate = result.PredictedOccupancyRate,
                        ConfidenceLevel = result.ConfidenceLevel,
                        Factors = result.Factors
                    });

                    current = current.AddDays(1);
                }
            }

            return forecasts;
        }

        public async Task<List<DemandForecastDto>> GetDemandForecastAsync(string roomType, string period)
        {
            var (startDate, endDate) = ParsePeriod(period);
            var forecasts = new List<DemandForecastDto>();

            var current = startDate;
            while (current <= endDate)
            {
                var historicalDemand = GetHistoricalDemand(roomType, current);
                var seasonalFactor = GetSeasonalFactor(current);
                var eventFactor = GetLocalEventsCount(current) > 0 ? 1.2m : 1.0m;

                var predictedDemand = (int)(historicalDemand * seasonalFactor * eventFactor);
                var variation = Math.Abs(predictedDemand - historicalDemand) / (decimal)historicalDemand;

                forecasts.Add(new DemandForecastDto
                {
                    ForecastDate = current,
                    RoomType = roomType,
                    PredictedDemand = predictedDemand,
                    HistoricalAverage = historicalDemand,
                    DemandVariation = variation,
                    TrendDirection = GetTrendDirection(variation),
                    ConfidenceLevel = 0.75m,
                    DemandFactors = GetDemandFactors(current, roomType)
                });

                current = current.AddDays(1);
            }

            return forecasts;
        }

        public async Task<TrendAnalysisDto> GetPriceTrendsAsync(string roomType, DateTime startDate, DateTime endDate)
        {
            var predictions = await GetPricePredictionsAsync(roomType, startDate.ToString("yyyy-MM-dd"), endDate.ToString("yyyy-MM-dd"));
            
            var trendPoints = predictions.Select(p => new TrendPointDto
            {
                Date = p.PredictionDate,
                Value = p.PredictedPrice,
                Metric = "Price"
            }).ToList();

            var trendDirection = AnalyzeTrendDirection(predictions);
            var trendStrength = CalculateTrendStrength(predictions);

            return new TrendAnalysisDto
            {
                RoomType = roomType,
                AnalysisDate = DateTime.UtcNow,
                TrendDirection = trendDirection,
                TrendStrength = trendStrength,
                TrendPoints = trendPoints,
                Insights = GenerateTrendInsights(predictions, trendDirection)
            };
        }

        // Helper methods
        private (DateTime startDate, DateTime endDate) ParsePeriod(string period)
        {
            var now = DateTime.Now;
            return period?.ToLowerInvariant() switch
            {
                "next_week" => (now.AddDays(1), now.AddDays(7)),
                "this_week" => (now, now.AddDays(7)),
                "next_month" => (now.AddDays(1), now.AddMonths(1)),
                "this_month" => (now, now.AddDays(30)),
                "next30days" => (now.AddDays(1), now.AddDays(30)),
                _ => (now.AddDays(1), now.AddDays(7))
            };
        }

        private bool IsHoliday(DateTime date)
        {
            // Simple holiday detection - can be enhanced with actual holiday data
            var holidays = new[]
            {
                new DateTime(date.Year, 1, 1),   // New Year
                new DateTime(date.Year, 7, 4),   // Independence Day
                new DateTime(date.Year, 12, 25), // Christmas
            };

            return holidays.Any(h => h.Date == date.Date);
        }

        private string GetSeason(DateTime date)
        {
            return date.Month switch
            {
                12 or 1 or 2 => "Winter",
                3 or 4 or 5 => "Spring",
                6 or 7 or 8 => "Summer",
                9 or 10 or 11 => "Fall",
                _ => "Spring"
            };
        }

        private float GetHistoricalAveragePrice(string roomType)
        {
            // Simulated historical data - in real implementation, query database
            return roomType switch
            {
                "Standard" => 100.0f,
                "Deluxe" => 150.0f,
                "Suite" => 250.0f,
                "Executive" => 200.0f,
                "Presidential Suite" => 500.0f,
                _ => 100.0f
            };
        }

        private float GetHistoricalOccupancyRate(string roomType)
        {
            // Simulated data - in real implementation, calculate from database
            return roomType switch
            {
                "Standard" => 0.75f,
                "Deluxe" => 0.70f,
                "Suite" => 0.60f,
                "Executive" => 0.65f,
                _ => 0.70f
            };
        }

        private int GetLocalEventsCount(DateTime date)
        {
            // Simulated event data - in real implementation, integrate with events API
            return date.DayOfWeek == DayOfWeek.Saturday ? 1 : 0;
        }

        private int GetTotalRoomsOfType(string roomType)
        {
            return roomType switch
            {
                "Standard" => 20,
                "Deluxe" => 15,
                "Suite" => 8,
                "Executive" => 10,
                _ => 15
            };
        }

        private int GetBookingTrend(string roomType)
        {
            // Simulated trend data - positive for increasing, negative for decreasing
            return new Random().Next(-2, 3);
        }

        private int GetHistoricalDemand(string roomType, DateTime date)
        {
            var baseDemand = GetTotalRoomsOfType(roomType);
            var occupancyRate = GetHistoricalOccupancyRate(roomType);
            return (int)(baseDemand * occupancyRate);
        }

        private decimal GetSeasonalFactor(DateTime date)
        {
            return GetSeason(date) switch
            {
                "Winter" => 0.8m,
                "Spring" => 1.0m,
                "Summer" => 1.3m,
                "Fall" => 1.1m,
                _ => 1.0m
            };
        }

        private string GetTrendDirection(decimal variation)
        {
            return variation switch
            {
                > 0.15m => "Increasing",
                < -0.15m => "Decreasing",
                _ => "Stable"
            };
        }

        private List<DemandFactorDto> GetDemandFactors(DateTime date, string roomType)
        {
            var factors = new List<DemandFactorDto>();

            if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
            {
                factors.Add(new DemandFactorDto
                {
                    FactorName = "Weekend",
                    Impact = 0.2m,
                    Description = "Weekend dates typically have higher demand"
                });
            }

            if (IsHoliday(date))
            {
                factors.Add(new DemandFactorDto
                {
                    FactorName = "Holiday",
                    Impact = 0.3m,
                    Description = "Holiday periods show increased booking demand"
                });
            }

            return factors;
        }

        private string AnalyzeTrendDirection(List<PricePredictionDto> predictions)
        {
            if (predictions.Count < 2) return "Stable";

            var firstPrice = predictions.First().PredictedPrice;
            var lastPrice = predictions.Last().PredictedPrice;
            var change = (lastPrice - firstPrice) / firstPrice;

            return change switch
            {
                > 0.1m => "Increasing",
                < -0.1m => "Decreasing",
                _ => "Stable"
            };
        }

        private decimal CalculateTrendStrength(List<PricePredictionDto> predictions)
        {
            if (predictions.Count < 2) return 0m;

            var changes = new List<decimal>();
            for (int i = 1; i < predictions.Count; i++)
            {
                var change = Math.Abs(predictions[i].PredictedPrice - predictions[i - 1].PredictedPrice) / predictions[i - 1].PredictedPrice;
                changes.Add(change);
            }

            return changes.Average();
        }

        private List<string> GenerateTrendInsights(List<PricePredictionDto> predictions, string trendDirection)
        {
            var insights = new List<string>();

            switch (trendDirection)
            {
                case "Increasing":
                    insights.Add("Prices are expected to rise over this period");
                    insights.Add("Consider booking earlier for better rates");
                    break;
                case "Decreasing":
                    insights.Add("Prices are expected to decline over this period");
                    insights.Add("You might get better deals by waiting");
                    break;
                default:
                    insights.Add("Prices are expected to remain stable");
                    insights.Add("Current timing appears optimal for booking");
                    break;
            }

            return insights;
        }
    }
}
