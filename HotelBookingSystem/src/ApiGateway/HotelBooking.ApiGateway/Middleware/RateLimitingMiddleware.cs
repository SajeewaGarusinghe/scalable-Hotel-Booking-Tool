using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;

namespace HotelBooking.ApiGateway.Middleware
{
    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private static readonly Dictionary<string, (int Count, Stopwatch Timer)> _clientRequests = new();
        private const int _requestLimit = 100; // Max requests per time frame
        private const int _timeFrameInSeconds = 60; // Time frame in seconds

        public RateLimitingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var clientIp = context.Connection.RemoteIpAddress?.ToString();

            if (clientIp != null)
            {
                if (!_clientRequests.ContainsKey(clientIp))
                {
                    _clientRequests[clientIp] = (0, Stopwatch.StartNew());
                }

                var (count, timer) = _clientRequests[clientIp];

                if (timer.Elapsed.TotalSeconds > _timeFrameInSeconds)
                {
                    // Reset the count and timer
                    _clientRequests[clientIp] = (1, Stopwatch.StartNew());
                }
                else
                {
                    if (count >= _requestLimit)
                    {
                        context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                        await context.Response.WriteAsync("Too many requests. Please try again later.");
                        return;
                    }

                    // Increment the request count
                    _clientRequests[clientIp] = (count + 1, timer);
                }
            }

            await _next(context);
        }
    }
}