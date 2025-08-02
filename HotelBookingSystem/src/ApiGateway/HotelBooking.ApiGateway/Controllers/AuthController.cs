using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HotelBooking.ApiGateway.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JwtTokenService _jwtTokenService;

        public AuthController(JwtTokenService jwtTokenService)
        {
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto loginDto)
        {
            // Implement Google login logic here
            // Validate the token and generate JWT token
            return Ok(new { Token = "generated-jwt-token" });
        }

        [HttpPost("refresh-token")]
        public IActionResult RefreshToken([FromBody] RefreshTokenDto refreshTokenDto)
        {
            // Implement refresh token logic here
            return Ok(new { Token = "new-generated-jwt-token" });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Implement logout logic here
            return NoContent();
        }
    }

    public class GoogleLoginDto
    {
        public string IdToken { get; set; }
    }

    public class RefreshTokenDto
    {
        public string Token { get; set; }
    }
}