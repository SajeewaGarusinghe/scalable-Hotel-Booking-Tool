using System;
using System.Collections.Generic;

namespace HotelBooking.Models.DTOs
{
    public class PricePredictionDto
    {
        public Guid PredictionId { get; set; }
        public string RoomType { get; set; } = string.Empty;
        public DateTime PredictionDate { get; set; }
        public decimal PredictedPrice { get; set; }
        public decimal ConfidenceLevel { get; set; }
        public string ModelVersion { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<PriceFactorDto> PriceFactors { get; set; } = new();
    }

    public class AvailabilityForecastDto
    {
        public DateTime ForecastDate { get; set; }
        public string RoomType { get; set; } = string.Empty;
        public int TotalRooms { get; set; }
        public int PredictedAvailableRooms { get; set; }
        public double PredictedOccupancyRate { get; set; }
        public decimal ConfidenceLevel { get; set; }
        public List<string> Factors { get; set; } = new();
    }

    public class DemandForecastDto
    {
        public DateTime ForecastDate { get; set; }
        public string RoomType { get; set; } = string.Empty;
        public int PredictedDemand { get; set; }
        public int HistoricalAverage { get; set; }
        public decimal DemandVariation { get; set; }
        public string TrendDirection { get; set; } = string.Empty; // Increasing, Decreasing, Stable
        public decimal ConfidenceLevel { get; set; }
        public List<DemandFactorDto> DemandFactors { get; set; } = new();
    }

    public class PriceFactorDto
    {
        public string FactorName { get; set; } = string.Empty;
        public decimal Impact { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    public class DemandFactorDto
    {
        public string FactorName { get; set; } = string.Empty;
        public decimal Impact { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    public class PredictionRequestDto
    {
        public string RoomType { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string PredictionType { get; set; } = string.Empty; // Price, Availability, Demand
        public PredictionParametersDto Parameters { get; set; } = new();
    }

    public class PredictionParametersDto
    {
        public bool IncludeSeasonality { get; set; } = true;
        public bool IncludeEvents { get; set; } = true;
        public bool IncludeWeatherImpact { get; set; } = false;
        public int HistoricalDays { get; set; } = 365;
        public decimal ConfidenceThreshold { get; set; } = 0.8m;
    }

    public class TrendAnalysisDto
    {
        public string RoomType { get; set; } = string.Empty;
        public DateTime AnalysisDate { get; set; }
        public string TrendDirection { get; set; } = string.Empty;
        public decimal TrendStrength { get; set; }
        public List<TrendPointDto> TrendPoints { get; set; } = new();
        public List<string> Insights { get; set; } = new();
    }

    public class TrendPointDto
    {
        public DateTime Date { get; set; }
        public decimal Value { get; set; }
        public string Metric { get; set; } = string.Empty; // Price, Occupancy, Demand
    }
}