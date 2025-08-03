# Use the official .NET runtime as a parent image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["src/Services/HotelBooking.BookingService/HotelBooking.BookingService.csproj", "src/Services/HotelBooking.BookingService/"]
COPY ["src/Shared/HotelBooking.Common/HotelBooking.Common.csproj", "src/Shared/HotelBooking.Common/"]
COPY ["src/Shared/HotelBooking.Models/HotelBooking.Models.csproj", "src/Shared/HotelBooking.Models/"]
COPY ["src/Infrastructure/HotelBooking.Data/HotelBooking.Data.csproj", "src/Infrastructure/HotelBooking.Data/"]

RUN dotnet restore "src/Services/HotelBooking.BookingService/HotelBooking.BookingService.csproj"

# Copy the rest of the application code
COPY . .

# Build the application
WORKDIR "/src/src/Services/HotelBooking.BookingService"
RUN dotnet build "HotelBooking.BookingService.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "HotelBooking.BookingService.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_URLS=http://+:80

ENTRYPOINT ["dotnet", "HotelBooking.BookingService.dll"]
