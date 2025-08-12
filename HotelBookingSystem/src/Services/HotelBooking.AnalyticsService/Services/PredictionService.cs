using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelBooking.Models.DTOs;
using HotelBooking.Data.Repositories;

namespace HotelBooking.AnalyticsService.Services
{
    public class PredictionService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IRoomRepository _roomRepository;

        public PredictionService(IBookingRepository bookingRepository, IRoomRepository roomRepository)
        {
            _bookingRepository = bookingRepository;
            _roomRepository = roomRepository;
        }

        public async Task<List<PricePredictionDto>> GetPricePredictionsAsync(string roomType, string startDate, string endDate)
        {
            var start = DateTime.Parse(startDate);
            var end = DateTime.Parse(endDate);
            
            // Get historical data for the same period in previous years
            var historicalBookings = await GetHistoricalBookingsAsync(roomType, start, end);
            var basePrice = await GetBasePriceForRoomTypeAsync(roomType);
            
            var predictions = new List<PricePredictionDto>();
            
            for (var date = start; date <= end; date = date.AddDays(1))
            {
                var predictedPrice = CalculatePredictedPrice(basePrice, date, historicalBookings);
                var confidenceLevel = CalculateConfidenceLevel(historicalBookings, date);
                var priceFactors = GetPriceFactors(date, historicalBookings);

                predictions.Add(new PricePredictionDto
                {
                    PredictionId = Guid.NewGuid(),
                    RoomType = roomType,
                    PredictionDate = date,
                    PredictedPrice = predictedPrice,
                    ConfidenceLevel = confidenceLevel,
                    ModelVersion = "v1.2",
                    CreatedAt = DateTime.UtcNow,
                    PriceFactors = priceFactors
                });
            }

            return predictions;
        }

        public async Task<List<AvailabilityForecastDto>> GetAvailabilityForecastAsync(string period)
        {
            var (startDate, endDate) = ParsePeriod(period);
            var allRooms = await _roomRepository.GetAllRoomsAsync();
            var roomTypes = allRooms.GroupBy(r => r.RoomType).ToDictionary(g => g.Key, g => g.Count());
            
            var forecasts = new List<AvailabilityForecastDto>();
            
            foreach (var roomType in roomTypes)
            {
                for (var date = startDate; date <= endDate; date = date.AddDays(1))
                {
                    var currentBookings = await _bookingRepository.GetBookingsForDateAsync(date);
                    var bookedRoomsOfType = currentBookings.Count(b => b.Room?.RoomType == roomType.Key);
                    var availableRooms = roomType.Value - bookedRoomsOfType;
                    var occupancyRate = roomType.Value > 0 ? (double)bookedRoomsOfType / roomType.Value : 0;
                    
                    // Predict future availability based on historical trends
                    var historicalOccupancy = await GetHistoricalOccupancyAsync(roomType.Key, date);
                    var predictedOccupancy = CalculatePredictedOccupancy(occupancyRate, historicalOccupancy);
                    var predictedAvailableRooms = (int)(roomType.Value * (1 - predictedOccupancy));
                    
                    forecasts.Add(new AvailabilityForecastDto
                    {
                        ForecastDate = date,
                        RoomType = roomType.Key,
                        TotalRooms = roomType.Value,
                        PredictedAvailableRooms = Math.Max(0, predictedAvailableRooms),
                        PredictedOccupancyRate = predictedOccupancy,
                        ConfidenceLevel = CalculateAvailabilityConfidence(historicalOccupancy),
                        Factors = GetAvailabilityFactors(date)
                    });
                }
            }

            return forecasts.OrderBy(f => f.ForecastDate).ThenBy(f => f.RoomType).ToList();
        }

        public async Task<List<DemandForecastDto>> GetDemandForecastAsync(string roomType, string period)
        {
            var (startDate, endDate) = ParsePeriod(period);
            var historicalBookings = await GetHistoricalBookingsAsync(roomType, startDate, endDate);
            
            var forecasts = new List<DemandForecastDto>();
            
            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var historicalDemand = GetHistoricalDemandForDate(historicalBookings, date);
                var averageDemand = historicalDemand.Any() ? (int)historicalDemand.Average() : 0;
                var predictedDemand = CalculatePredictedDemand(averageDemand, date);
                var demandVariation = historicalDemand.Any() ? CalculateVariation(historicalDemand) : 0;
                var trendDirection = DetermineTrendDirection(historicalDemand);
                var demandFactors = GetDemandFactors(date, roomType);

                forecasts.Add(new DemandForecastDto
                {
                    ForecastDate = date,
                    RoomType = roomType,
                    PredictedDemand = predictedDemand,
                    HistoricalAverage = averageDemand,
                    DemandVariation = demandVariation,
                    TrendDirection = trendDirection,
                    ConfidenceLevel = CalculateDemandConfidence(historicalDemand),
                    DemandFactors = demandFactors
                });
            }

            return forecasts;
        }

        private async Task<IEnumerable<HotelBooking.Models.Entities.Booking>> GetHistoricalBookingsAsync(string roomType, DateTime startDate, DateTime endDate)
        {
            var historicalStart = startDate.AddYears(-2);
            var historicalEnd = endDate.AddYears(-1);
            
            var bookings = await _bookingRepository.GetBookingsByDateRangeAsync(historicalStart, DateTime.Today);
            return bookings.Where(b => string.IsNullOrEmpty(roomType) || b.Room?.RoomType == roomType);
        }

        private async Task<decimal> GetBasePriceForRoomTypeAsync(string roomType)
        {
            var rooms = await _roomRepository.GetRoomsByTypeAsync(roomType);
            return rooms.Any() ? rooms.Average(r => r.PricePerNight) : 100m;
        }

        private decimal CalculatePredictedPrice(decimal basePrice, DateTime date, IEnumerable<HotelBooking.Models.Entities.Booking> historicalBookings)
        {
            var seasonalMultiplier = GetSeasonalMultiplier(date);
            var dayOfWeekMultiplier = GetDayOfWeekMultiplier(date.DayOfWeek);
            var demandMultiplier = GetDemandMultiplier(historicalBookings, date);

            return basePrice * seasonalMultiplier * dayOfWeekMultiplier * demandMultiplier;
        }

        private decimal GetSeasonalMultiplier(DateTime date)
        {
            // Higher prices during peak seasons (summer, holidays)
            return date.Month switch
            {
                6 or 7 or 8 => 1.3m,  // Summer
                12 or 1 => 1.2m,      // Holiday season
                3 or 4 or 5 => 1.1m,  // Spring
                _ => 1.0m             // Off-season
            };
        }

        private decimal GetDayOfWeekMultiplier(DayOfWeek dayOfWeek)
        {
            return dayOfWeek switch
            {
                DayOfWeek.Friday or DayOfWeek.Saturday => 1.2m,
                DayOfWeek.Sunday => 1.1m,
                _ => 1.0m
            };
        }

        private decimal GetDemandMultiplier(IEnumerable<HotelBooking.Models.Entities.Booking> historicalBookings, DateTime date)
        {
            var sameDateBookings = historicalBookings
                .Where(b => b.CheckInDate.Month == date.Month && b.CheckInDate.Day == date.Day)
                .Count();

            return sameDateBookings switch
            {
                > 10 => 1.3m,
                > 5 => 1.2m,
                > 2 => 1.1m,
                _ => 1.0m
            };
        }

        private decimal CalculateConfidenceLevel(IEnumerable<HotelBooking.Models.Entities.Booking> historicalBookings, DateTime date)
        {
            var relevantBookings = historicalBookings
                .Where(b => Math.Abs((b.CheckInDate - date).Days) <= 30)
                .Count();

            return relevantBookings switch
            {
                > 50 => 0.95m,
                > 20 => 0.85m,
                > 10 => 0.75m,
                > 5 => 0.65m,
                _ => 0.50m
            };
        }

        private List<PriceFactorDto> GetPriceFactors(DateTime date, IEnumerable<HotelBooking.Models.Entities.Booking> historicalBookings)
        {
            var factors = new List<PriceFactorDto>
            {
                new PriceFactorDto
                {
                    FactorName = "Seasonal Demand",
                    Impact = GetSeasonalMultiplier(date) - 1,
                    Description = $"Seasonal pricing adjustment for {date:MMMM}"
                },
                new PriceFactorDto
                {
                    FactorName = "Day of Week",
                    Impact = GetDayOfWeekMultiplier(date.DayOfWeek) - 1,
                    Description = $"Weekend/weekday pricing for {date.DayOfWeek}"
                }
            };

            return factors;
        }

        private (DateTime start, DateTime end) ParsePeriod(string period)
        {
            var today = DateTime.Today;
            return period.ToLower() switch
            {
                "next7days" => (today, today.AddDays(7)),
                "next30days" => (today, today.AddDays(30)),
                "nextmonth" => (today, today.AddMonths(1)),
                "nextquarter" => (today, today.AddMonths(3)),
                _ => (today, today.AddDays(7))
            };
        }

        private async Task<List<double>> GetHistoricalOccupancyAsync(string roomType, DateTime date)
        {
            var occupancyRates = new List<double>();
            
            // Get occupancy for the same date in previous years
            for (int yearOffset = 1; yearOffset <= 3; yearOffset++)
            {
                var historicalDate = date.AddYears(-yearOffset);
                var bookings = await _bookingRepository.GetBookingsForDateAsync(historicalDate);
                var roomsOfType = await _roomRepository.GetRoomsByTypeAsync(roomType);
                var totalRooms = roomsOfType.Count();
                var occupiedRooms = bookings.Count(b => b.Room?.RoomType == roomType);
                
                if (totalRooms > 0)
                {
                    occupancyRates.Add((double)occupiedRooms / totalRooms);
                }
            }
            
            return occupancyRates;
        }

        private double CalculatePredictedOccupancy(double currentOccupancy, List<double> historicalOccupancy)
        {
            if (!historicalOccupancy.Any())
                return currentOccupancy;
            
            var historicalAverage = historicalOccupancy.Average();
            // Weight current occupancy more heavily than historical average
            return (currentOccupancy * 0.6) + (historicalAverage * 0.4);
        }

        private decimal CalculateAvailabilityConfidence(List<double> historicalOccupancy)
        {
            if (!historicalOccupancy.Any())
                return 0.5m;
            
            var variance = CalculateVariance(historicalOccupancy);
            return variance < 0.1 ? 0.9m : variance < 0.2 ? 0.7m : 0.5m;
        }

        private List<string> GetAvailabilityFactors(DateTime date)
        {
            var factors = new List<string>();
            
            if (date.DayOfWeek == DayOfWeek.Friday || date.DayOfWeek == DayOfWeek.Saturday)
                factors.Add("Weekend demand");
            
            if (date.Month >= 6 && date.Month <= 8)
                factors.Add("Summer season");
            
            if (date.Month == 12 || date.Month == 1)
                factors.Add("Holiday season");
            
            return factors;
        }

        private List<int> GetHistoricalDemandForDate(IEnumerable<HotelBooking.Models.Entities.Booking> historicalBookings, DateTime date)
        {
            var demandByYear = new List<int>();
            
            for (int yearOffset = 1; yearOffset <= 3; yearOffset++)
            {
                var historicalDate = date.AddYears(-yearOffset);
                var demand = historicalBookings
                    .Count(b => b.CheckInDate.Date == historicalDate.Date);
                demandByYear.Add(demand);
            }
            
            return demandByYear;
        }

        private int CalculatePredictedDemand(int averageDemand, DateTime date)
        {
            var baselineDemand = averageDemand;
            var seasonalAdjustment = GetSeasonalDemandAdjustment(date);
            var dayOfWeekAdjustment = GetDayOfWeekDemandAdjustment(date.DayOfWeek);
            
            return Math.Max(0, (int)(baselineDemand * seasonalAdjustment * dayOfWeekAdjustment));
        }

        private decimal GetSeasonalDemandAdjustment(DateTime date)
        {
            return date.Month switch
            {
                6 or 7 or 8 => 1.4m,
                12 or 1 => 1.3m,
                3 or 4 or 5 => 1.1m,
                _ => 1.0m
            };
        }

        private decimal GetDayOfWeekDemandAdjustment(DayOfWeek dayOfWeek)
        {
            return dayOfWeek switch
            {
                DayOfWeek.Friday or DayOfWeek.Saturday => 1.3m,
                DayOfWeek.Sunday => 1.1m,
                _ => 1.0m
            };
        }

        private decimal CalculateVariation(List<int> values)
        {
            if (!values.Any()) return 0;
            
            var average = values.Average();
            var variance = values.Sum(v => Math.Pow(v - average, 2)) / values.Count;
            return (decimal)(Math.Sqrt(variance) / average);
        }

        private double CalculateVariance(List<double> values)
        {
            if (!values.Any()) return 0;
            
            var average = values.Average();
            return values.Sum(v => Math.Pow(v - average, 2)) / values.Count;
        }

        private string DetermineTrendDirection(List<int> historicalDemand)
        {
            if (historicalDemand.Count < 2) return "Stable";
            
            var recent = historicalDemand.TakeLast(2).ToList();
            if (recent[1] > recent[0]) return "Increasing";
            if (recent[1] < recent[0]) return "Decreasing";
            return "Stable";
        }

        private List<DemandFactorDto> GetDemandFactors(DateTime date, string roomType)
        {
            var factors = new List<DemandFactorDto>
            {
                new DemandFactorDto
                {
                    FactorName = "Seasonal Pattern",
                    Impact = GetSeasonalDemandAdjustment(date) - 1,
                    Description = $"Seasonal demand variation for {date:MMMM}"
                },
                new DemandFactorDto
                {
                    FactorName = "Day Pattern",
                    Impact = GetDayOfWeekDemandAdjustment(date.DayOfWeek) - 1,
                    Description = $"Weekly pattern impact for {date.DayOfWeek}"
                }
            };

            return factors;
        }

        private decimal CalculateDemandConfidence(List<int> historicalDemand)
        {
            if (!historicalDemand.Any()) return 0.5m;
            
            var variation = CalculateVariation(historicalDemand);
            return variation < 0.2m ? 0.9m : variation < 0.4m ? 0.7m : 0.5m;
        }
    }
}