using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace HotelBooking.ApiGateway.Middleware
{
    public class CorsMiddleware
    {
        private readonly RequestDelegate _next;

        public CorsMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Handle preflight OPTIONS requests
            if (context.Request.Method == "OPTIONS")
            {
                context.Response.Headers["Access-Control-Allow-Origin"] = "http://localhost:3000";
                context.Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
                context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With";
                context.Response.Headers["Access-Control-Allow-Credentials"] = "true";
                context.Response.Headers["Access-Control-Max-Age"] = "3600";
                context.Response.StatusCode = 200;
                return;
            }

            // Add CORS headers for all requests
            context.Response.OnStarting(() =>
            {
                if (!context.Response.Headers.ContainsKey("Access-Control-Allow-Origin"))
                {
                    context.Response.Headers["Access-Control-Allow-Origin"] = "http://localhost:3000";
                    context.Response.Headers["Access-Control-Allow-Credentials"] = "true";
                }
                return Task.CompletedTask;
            });

            await _next(context);
        }
    }
}
