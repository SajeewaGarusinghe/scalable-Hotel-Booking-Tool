using Microsoft.AspNetCore.Authentication;
using System.Text.Json;

namespace HotelBooking.ApiGateway.Middleware
{
    public class AuthenticationErrorMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<AuthenticationErrorMiddleware> _logger;

        public AuthenticationErrorMiddleware(RequestDelegate next, ILogger<AuthenticationErrorMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during authentication");
                
                if (context.Request.Path.StartsWithSegments("/api/auth") || 
                    context.Request.Path.StartsWithSegments("/signin-google"))
                {
                    await HandleAuthenticationErrorAsync(context, ex);
                }
                else
                {
                    throw;
                }
            }
        }

        private static async Task HandleAuthenticationErrorAsync(HttpContext context, Exception ex)
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";

            var response = new
            {
                error = "Authentication error occurred",
                message = ex.Message,
                details = ex.StackTrace
            };

            var jsonResponse = JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(jsonResponse);
        }
    }
}
