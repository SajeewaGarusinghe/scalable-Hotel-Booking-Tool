using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HotelBooking.AnalyticsService.Controllers
{
    [Route("api/chatbot")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {
        private readonly ChatbotService _chatbotService;

        public ChatbotController(ChatbotService chatbotService)
        {
            _chatbotService = chatbotService;
        }

        [HttpPost("query")]
        public async Task<IActionResult> SendQuery([FromBody] ChatbotQueryDto queryDto)
        {
            var response = await _chatbotService.ProcessQueryAsync(queryDto);
            return Ok(response);
        }

        [HttpGet("history/{customerId}")]
        public async Task<IActionResult> GetInteractionHistory(string customerId)
        {
            var history = await _chatbotService.GetInteractionHistoryAsync(customerId);
            return Ok(history);
        }
    }

    public class ChatbotQueryDto
    {
        public string CustomerId { get; set; }
        public string Query { get; set; }
        public object Context { get; set; }
    }
}