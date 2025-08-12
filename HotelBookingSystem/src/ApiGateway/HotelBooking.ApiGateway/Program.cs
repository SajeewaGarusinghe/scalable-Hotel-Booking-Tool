using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Microsoft.OpenApi.Models;
using HotelBooking.ApiGateway.Middleware;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// Configure forwarded headers for proxy scenarios
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// Add Ocelot configuration
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// Add services to the container
builder.Services.AddControllers();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
    
    options.AddPolicy("DevelopmentCors", builder =>
    {
        builder.SetIsOriginAllowed(origin => true) // Allow any origin in development
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

// Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Hotel Booking API Gateway", 
        Version = "v1"
    });
});

// Add Ocelot
builder.Services.AddOcelot();

// Health Checks
builder.Services.AddHealthChecks();
var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use forwarded headers (important for HTTPS behind proxy)
app.UseForwardedHeaders();

// Use CORS before any other middleware
if (app.Environment.IsDevelopment())
{
    app.UseCors("DevelopmentCors");
}
else
{
    app.UseCors("AllowAll");
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Map controllers for auth routes before Ocelot
app.UseWhen(context => 
    context.Request.Path.StartsWithSegments("/api/auth") || 
    context.Request.Path.StartsWithSegments("/health"), 
    appBuilder =>
{
    appBuilder.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
        endpoints.MapHealthChecks("/health");
    });
});

await app.UseOcelot();

app.Run();
