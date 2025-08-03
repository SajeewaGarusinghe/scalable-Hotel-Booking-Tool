using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using HotelBooking.Models.DTOs;

namespace HotelBooking.AnalyticsService.Controllers
{
    [Route("api/predictions")]
    [ApiController]
    public class PredictionsController : ControllerBase
    {
        private readonly Services.PredictionService _predictionService;

        public PredictionsController(Services.PredictionService predictionService)
        {
            _predictionService = predictionService;
        }

        [HttpGet("pricing")]
        public async Task<IActionResult> GetPricePredictions(string roomType, string startDate, string endDate)
        {
            var predictions = await _predictionService.GetPricePredictionsAsync(roomType, startDate, endDate);
            return Ok(predictions);
        }

        [HttpGet("availability")]
        public async Task<IActionResult> GetAvailabilityForecast(string period)
        {
            var forecast = await _predictionService.GetAvailabilityForecastAsync(period);
            return Ok(forecast);
        }

        [HttpGet("demand")]
        public async Task<IActionResult> GetDemandForecast(string roomType, string period)
        {
            var demandForecast = await _predictionService.GetDemandForecastAsync(roomType, period);
            return Ok(demandForecast);
        }
    }
}