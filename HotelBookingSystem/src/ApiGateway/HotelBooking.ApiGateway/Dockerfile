# Use the official .NET runtime as a parent image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["src/ApiGateway/HotelBooking.ApiGateway/HotelBooking.ApiGateway.csproj", "src/ApiGateway/HotelBooking.ApiGateway/"]
COPY ["src/Shared/HotelBooking.Common/HotelBooking.Common.csproj", "src/Shared/HotelBooking.Common/"]
COPY ["src/Shared/HotelBooking.Models/HotelBooking.Models.csproj", "src/Shared/HotelBooking.Models/"]

RUN dotnet restore "src/ApiGateway/HotelBooking.ApiGateway/HotelBooking.ApiGateway.csproj"

# Copy the rest of the application code
COPY . .

# Build the application
WORKDIR "/src/src/ApiGateway/HotelBooking.ApiGateway"
RUN dotnet build "HotelBooking.ApiGateway.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "HotelBooking.ApiGateway.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_URLS=http://+:80

ENTRYPOINT ["dotnet", "HotelBooking.ApiGateway.dll"]
