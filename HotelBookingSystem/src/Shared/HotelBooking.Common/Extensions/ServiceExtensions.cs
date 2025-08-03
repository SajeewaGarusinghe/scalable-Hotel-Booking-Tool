using Microsoft.Extensions.DependencyInjection;

namespace HotelBooking.Common.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddCustomServices(this IServiceCollection services)
        {
            // Register application services here
            // Example: services.AddScoped<IYourService, YourService>();
        }
    }
}