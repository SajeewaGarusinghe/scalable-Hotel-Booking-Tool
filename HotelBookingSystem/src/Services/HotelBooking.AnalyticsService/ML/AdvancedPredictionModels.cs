using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.ML;
using Microsoft.ML.Data;

namespace HotelBooking.AnalyticsService.ML
{
    public class EnhancedPricePredictionInput
    {
        public string RoomType { get; set; } = string.Empty;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfGuests { get; set; }
        public int DaysInAdvance { get; set; }
        public bool IsWeekend { get; set; }
        public bool IsHoliday { get; set; }
        public string Season { get; set; } = string.Empty;
        public float HistoricalAveragePrice { get; set; }
        public float HistoricalOccupancyRate { get; set; }
        public int LocalEvents { get; set; }
    }

    public class EnhancedPricePredictionOutput
    {
        [ColumnName("Score")]
        public float PredictedPrice { get; set; }
    }

    public class AvailabilityPredictionInput
    {
        public DateTime PredictionDate { get; set; }
        public string RoomType { get; set; } = string.Empty;
        public int TotalRoomsOfType { get; set; }
        public float HistoricalOccupancyRate { get; set; }
        public bool IsWeekend { get; set; }
        public bool IsHoliday { get; set; }
        public string Season { get; set; } = string.Empty;
        public int BookingTrend { get; set; }
        public int LocalEvents { get; set; }
    }

    public class AvailabilityPredictionOutput
    {
        [ColumnName("Score")]
        public float PredictedOccupancyRate { get; set; }
    }

    public class AdvancedPricePredictionModel
    {
        private readonly MLContext _mlContext;
        private ITransformer? _priceModel;
        private ITransformer? _trendModel;

        public AdvancedPricePredictionModel()
        {
            _mlContext = new MLContext(seed: 0);
            LoadModels();
        }

        private void LoadModels()
        {
            try
            {
                // Load pre-trained models if they exist
                // For now, we'll create simple models
                _priceModel = CreateBasicPriceModel();
                _trendModel = CreateBasicTrendModel();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Model loading failed: {ex.Message}");
                // Fall back to basic prediction logic
            }
        }

        public async Task<PricePredictionResult> PredictPriceWithTrendsAsync(EnhancedPricePredictionInput input)
        {
            var basePrice = PredictBasePrice(input);
            var seasonalAdjustment = PredictSeasonalAdjustment(input);
            var demandAdjustment = PredictDemandAdjustment(input);

            var finalPrice = basePrice * seasonalAdjustment * demandAdjustment;

            return new PricePredictionResult
            {
                PredictedPrice = finalPrice,
                ConfidenceLevel = CalculateConfidence(input),
                TrendDirection = PredictTrendDirection(input),
                Factors = GetPriceFactors(input)
            };
        }

        private float PredictBasePrice(EnhancedPricePredictionInput input)
        {
            // Base pricing logic based on room type
            return input.RoomType switch
            {
                "Standard" => 100.0f,
                "Deluxe" => 150.0f,
                "Suite" => 250.0f,
                "Executive" => 200.0f,
                "Presidential Suite" => 500.0f,
                _ => 100.0f
            };
        }

        private float PredictSeasonalAdjustment(EnhancedPricePredictionInput input)
        {
            return input.Season switch
            {
                "Winter" => 0.8f,
                "Spring" => 1.0f,
                "Summer" => 1.3f,
                "Fall" => 1.1f,
                _ => 1.0f
            };
        }

        private float PredictDemandAdjustment(EnhancedPricePredictionInput input)
        {
            var adjustment = 1.0f;
            
            // Weekend premium
            if (input.IsWeekend) adjustment += 0.2f;
            
            // Holiday premium
            if (input.IsHoliday) adjustment += 0.3f;
            
            // Advance booking discount
            if (input.DaysInAdvance > 30) adjustment -= 0.1f;
            else if (input.DaysInAdvance < 7) adjustment += 0.15f;
            
            // Local events premium
            if (input.LocalEvents > 0) adjustment += 0.1f * input.LocalEvents;

            return Math.Max(0.5f, Math.Min(2.0f, adjustment));
        }

        private decimal CalculateConfidence(EnhancedPricePredictionInput input)
        {
            var confidence = 0.7m;
            
            // Higher confidence for closer dates
            if (input.DaysInAdvance <= 30) confidence += 0.2m;
            
            // Higher confidence if we have historical data
            if (input.HistoricalAveragePrice > 0) confidence += 0.1m;
            
            return Math.Min(1.0m, confidence);
        }

        private string PredictTrendDirection(EnhancedPricePredictionInput input)
        {
            if (input.IsHoliday || input.LocalEvents > 0) return "Increasing";
            if (input.DaysInAdvance > 60) return "Decreasing";
            return "Stable";
        }

        private List<string> GetPriceFactors(EnhancedPricePredictionInput input)
        {
            var factors = new List<string>();
            
            if (input.IsWeekend) factors.Add("Weekend premium");
            if (input.IsHoliday) factors.Add("Holiday premium");
            if (input.LocalEvents > 0) factors.Add("Local events");
            if (input.DaysInAdvance < 7) factors.Add("Last-minute booking");
            if (input.DaysInAdvance > 30) factors.Add("Early booking discount");
            
            return factors;
        }

        private ITransformer CreateBasicPriceModel()
        {
            // Create a simple pipeline for basic price prediction
            var pipeline = _mlContext.Transforms.Text.FeaturizeText("RoomTypeFeaturized", nameof(EnhancedPricePredictionInput.RoomType))
                .Append(_mlContext.Transforms.Text.FeaturizeText("SeasonFeaturized", nameof(EnhancedPricePredictionInput.Season)))
                .Append(_mlContext.Transforms.Concatenate("Features",
                    "RoomTypeFeaturized", "SeasonFeaturized",
                    nameof(EnhancedPricePredictionInput.NumberOfGuests),
                    nameof(EnhancedPricePredictionInput.DaysInAdvance),
                    nameof(EnhancedPricePredictionInput.HistoricalAveragePrice),
                    nameof(EnhancedPricePredictionInput.HistoricalOccupancyRate),
                    nameof(EnhancedPricePredictionInput.LocalEvents)))
                .Append(_mlContext.Regression.Trainers.Sdca());

            // For now, return a simple identity transformer
            return _mlContext.Transforms.CustomMapping<EnhancedPricePredictionInput, EnhancedPricePredictionOutput>(
                (input, output) => output.PredictedPrice = PredictBasePrice(input), "PricePredictor").Fit(_mlContext.Data.LoadFromEnumerable(new List<EnhancedPricePredictionInput>()));
        }

        private ITransformer CreateBasicTrendModel()
        {
            // Simple trend model - can be enhanced later
            return CreateBasicPriceModel();
        }
    }

    public class PricePredictionResult
    {
        public float PredictedPrice { get; set; }
        public decimal ConfidenceLevel { get; set; }
        public string TrendDirection { get; set; } = string.Empty;
        public List<string> Factors { get; set; } = new();
    }

    public class AvailabilityPredictionModel
    {
        private readonly MLContext _mlContext;

        public AvailabilityPredictionModel()
        {
            _mlContext = new MLContext(seed: 0);
        }

        public async Task<AvailabilityForecastResult> PredictAvailabilityAsync(AvailabilityPredictionInput input)
        {
            var baseOccupancy = PredictBaseOccupancy(input);
            var seasonalAdjustment = GetSeasonalAdjustment(input);
            var eventAdjustment = GetEventAdjustment(input);

            var predictedOccupancy = Math.Min(1.0f, baseOccupancy * seasonalAdjustment * eventAdjustment);
            var availableRooms = (int)(input.TotalRoomsOfType * (1 - predictedOccupancy));

            return new AvailabilityForecastResult
            {
                PredictedOccupancyRate = predictedOccupancy,
                PredictedAvailableRooms = availableRooms,
                ConfidenceLevel = 0.8m,
                Factors = GetAvailabilityFactors(input)
            };
        }

        private float PredictBaseOccupancy(AvailabilityPredictionInput input)
        {
            return input.HistoricalOccupancyRate > 0 ? input.HistoricalOccupancyRate : 0.7f;
        }

        private float GetSeasonalAdjustment(AvailabilityPredictionInput input)
        {
            return input.Season switch
            {
                "Winter" => 0.8f,
                "Spring" => 1.0f,
                "Summer" => 1.2f,
                "Fall" => 1.1f,
                _ => 1.0f
            };
        }

        private float GetEventAdjustment(AvailabilityPredictionInput input)
        {
            return input.LocalEvents > 0 ? 1.0f + (0.1f * input.LocalEvents) : 1.0f;
        }

        private List<string> GetAvailabilityFactors(AvailabilityPredictionInput input)
        {
            var factors = new List<string>();
            
            if (input.IsWeekend) factors.Add("Weekend demand");
            if (input.IsHoliday) factors.Add("Holiday period");
            if (input.LocalEvents > 0) factors.Add("Local events");
            
            return factors;
        }
    }

    public class AvailabilityForecastResult
    {
        public float PredictedOccupancyRate { get; set; }
        public int PredictedAvailableRooms { get; set; }
        public decimal ConfidenceLevel { get; set; }
        public List<string> Factors { get; set; } = new();
    }
}
