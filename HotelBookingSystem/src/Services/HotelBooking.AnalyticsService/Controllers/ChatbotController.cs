using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HotelBooking.AnalyticsService.Services;
using HotelBooking.Models.DTOs;

namespace HotelBooking.AnalyticsService.Controllers
{
    [Route("api/chatbot")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {
        private readonly IChatbotService _chatbotService;

        public ChatbotController(IChatbotService chatbotService)
        {
            _chatbotService = chatbotService;
        }

        [HttpPost("query")]
        public async Task<IActionResult> SendQuery([FromBody] ChatbotQueryDto queryDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(queryDto.Query))
                {
                    return BadRequest(new { message = "Query cannot be empty" });
                }

                // Generate session ID if not provided
                if (string.IsNullOrWhiteSpace(queryDto.SessionId))
                {
                    queryDto.SessionId = Guid.NewGuid().ToString();
                }

                var response = await _chatbotService.ProcessQueryAsync(queryDto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpGet("history/{customerId}")]
        public async Task<IActionResult> GetInteractionHistory(string customerId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(customerId))
                {
                    return BadRequest(new { message = "Customer ID is required" });
                }

                var history = await _chatbotService.GetInteractionHistoryAsync(customerId);
                return Ok(history);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpGet("suggestions")]
        public async Task<IActionResult> GetSuggestions([FromQuery] string? context = null)
        {
            try
            {
                var contextDict = !string.IsNullOrWhiteSpace(context) 
                    ? new Dictionary<string, object> { ["context"] = context }
                    : null;

                var suggestions = await _chatbotService.GetSuggestionsAsync(contextDict);
                return Ok(suggestions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPost("feedback")]
        public async Task<IActionResult> SubmitFeedback([FromBody] ChatbotFeedbackDto feedbackDto)
        {
            try
            {
                // In a real implementation, this would store feedback in the database
                // For now, just return success
                return Ok(new { message = "Feedback received successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpGet("analytics")]
        public async Task<IActionResult> GetPredictiveAnalytics([FromQuery] PredictiveAnalyticsRequestDto request)
        {
            try
            {
                // This would integrate with the prediction service to provide
                // structured analytics data for the chatbot
                var result = new
                {
                    roomType = request.RoomType,
                    dateRange = request.DateRange,
                    predictions = new { /* prediction data */ },
                    trends = new { /* trend data */ },
                    recommendations = new { /* recommendation data */ }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }

    public class ChatbotFeedbackDto
    {
        public string InteractionId { get; set; } = string.Empty;
        public int Rating { get; set; } // 1-5 scale
        public string? Comments { get; set; }
        public string CustomerId { get; set; } = string.Empty;
    }

    public class PredictiveAnalyticsRequestDto
    {
        public string RoomType { get; set; } = string.Empty;
        public string DateRange { get; set; } = string.Empty;
        public string AnalysisType { get; set; } = string.Empty; // price, availability, trend
    }
}