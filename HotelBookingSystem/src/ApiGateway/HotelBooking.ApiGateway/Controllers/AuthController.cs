using Microsoft.AspNetCore.Mvc;

namespace HotelBooking.ApiGateway.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpOptions("mock-login")]
        public IActionResult MockLoginOptions()
        {
            return Ok();
        }

        [HttpPost("mock-login")]
        public IActionResult MockLogin([FromBody] MockLoginRequest request)
        {
            try
            {
                Console.WriteLine($"Mock login request: Email={request.Email}, Name={request.Name}");
                
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Name))
                {
                    return BadRequest(new { error = "Email and name are required" });
                }

                // Generate a simple mock token (just a base64 encoded string with user info)
                var userInfo = new
                {
                    email = request.Email,
                    name = request.Name,
                    id = $"mock_{Guid.NewGuid()}"
                };
                
                var mockToken = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(System.Text.Json.JsonSerializer.Serialize(userInfo)));

                var response = new
                {
                    Token = mockToken,
                    User = userInfo
                };

                Console.WriteLine($"Mock login successful for {request.Email}");
                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Mock login error: {ex.Message}");
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpGet("user-info")]
        public IActionResult GetUserInfo([FromHeader(Name = "Authorization")] string? authorization)
        {
            try
            {
                if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
                {
                    return Unauthorized(new { error = "No valid token provided" });
                }

                var token = authorization.Substring(7); // Remove "Bearer " prefix
                var userInfoJson = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(token));
                var userInfo = System.Text.Json.JsonSerializer.Deserialize<dynamic>(userInfoJson);

                return Ok(userInfo);
            }
            catch (Exception)
            {
                return Unauthorized(new { error = "Invalid token" });
            }
        }
    }

    public class MockLoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}