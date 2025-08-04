-- Create main database
CREATE DATABASE HotelBookingSystem;

-- Create schemas
USE HotelBookingSystem;
GO

CREATE SCHEMA booking;
GO

CREATE SCHEMA analytics;
GO

-- Create Rooms Table
CREATE TABLE booking.Rooms (
    RoomId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RoomNumber NVARCHAR(10) NOT NULL UNIQUE,
    RoomType NVARCHAR(50) NOT NULL,
    MaxOccupancy INT NOT NULL,
    PricePerNight DECIMAL(10,2) NOT NULL,
    Description NVARCHAR(500),
    Amenities NVARCHAR(MAX), -- JSON format
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Create Room Types Table
CREATE TABLE booking.RoomTypes (
    RoomTypeId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TypeName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(500),
    BasePrice DECIMAL(10,2) NOT NULL,
    MaxOccupancy INT NOT NULL
);

-- Create Bookings Table
CREATE TABLE booking.Bookings (
    BookingId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CustomerId UNIQUEIDENTIFIER NOT NULL,
    RoomId UNIQUEIDENTIFIER NOT NULL,
    CheckInDate DATE NOT NULL,
    CheckOutDate DATE NOT NULL,
    NumberOfGuests INT NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    BookingStatus NVARCHAR(20) DEFAULT 'Confirmed', -- Confirmed, Cancelled, CheckedIn, CheckedOut
    IsRecurring BIT DEFAULT 0,
    RecurrencePattern NVARCHAR(100), -- Weekly, Monthly, etc.
    BookingReference NVARCHAR(20) UNIQUE,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (RoomId) REFERENCES booking.Rooms(RoomId)
);

-- Create Special Requests Table
CREATE TABLE booking.SpecialRequests (
    RequestId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BookingId UNIQUEIDENTIFIER NOT NULL,
    RequestType NVARCHAR(50) NOT NULL, -- Extra Bed, Late Checkout, Early Checkin, etc.
    Description NVARCHAR(500),
    Status NVARCHAR(20) DEFAULT 'Pending', -- Pending, Approved, Denied, Fulfilled
    RequestDate DATETIME2 DEFAULT GETUTCDATE(),
    FulfilledDate DATETIME2,
    FOREIGN KEY (BookingId) REFERENCES booking.Bookings(BookingId)
);

-- Create Customers Table
CREATE TABLE booking.Customers (
    CustomerId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    GoogleId NVARCHAR(100) UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    PhoneNumber NVARCHAR(20),
    Address NVARCHAR(200),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Create Booking Analytics Table
CREATE TABLE analytics.BookingAnalytics (
    AnalyticsId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BookingId UNIQUEIDENTIFIER NOT NULL,
    BookingDate DATE NOT NULL,
    CheckInDate DATE NOT NULL,
    CheckOutDate DATE NOT NULL,
    RoomType NVARCHAR(50) NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    NumberOfNights INT NOT NULL,
    SeasonalFactor DECIMAL(5,2),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Create Price Predictions Table
CREATE TABLE analytics.PricePredictions (
    PredictionId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RoomType NVARCHAR(50) NOT NULL,
    PredictionDate DATE NOT NULL,
    PredictedPrice DECIMAL(10,2) NOT NULL,
    ConfidenceLevel DECIMAL(5,2),
    ModelVersion NVARCHAR(20),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Create Reports Table
CREATE TABLE analytics.Reports (
    ReportId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ReportType NVARCHAR(50) NOT NULL, -- Weekly, Monthly, Yearly
    ReportPeriodStart DATE NOT NULL,
    ReportPeriodEnd DATE NOT NULL,
    ReportData NVARCHAR(MAX), -- JSON format
    GeneratedAt DATETIME2 DEFAULT GETUTCDATE(),
    GeneratedBy NVARCHAR(100)
);

-- Enhanced Chatbot Interactions Table
CREATE TABLE analytics.ChatbotInteractions (
    InteractionId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SessionId UNIQUEIDENTIFIER,
    CustomerId UNIQUEIDENTIFIER,
    Query NVARCHAR(1000) NOT NULL,
    QueryIntent NVARCHAR(100), -- pricing, availability, trends, booking
    ExtractedEntities NVARCHAR(MAX), -- JSON format
    Response NVARCHAR(MAX) NOT NULL,
    ResponseType NVARCHAR(50), -- prediction, information, suggestion
    ConfidenceLevel DECIMAL(5,2),
    ProcessingTimeMs INT,
    UserFeedback INT, -- 1-5 rating
    Timestamp DATETIME2 DEFAULT GETUTCDATE()
);

-- Booking Patterns Analysis Table
CREATE TABLE analytics.BookingPatterns (
    PatternId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RoomType NVARCHAR(50),
    BookingDate DATE,
    CheckInDate DATE,
    DaysInAdvance INT,
    SeasonalFactor DECIMAL(5,2),
    WeekdayFactor DECIMAL(5,2),
    EventFactor DECIMAL(5,2),
    PricePaid DECIMAL(10,2),
    OccupancyRate DECIMAL(5,2),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- External Factors Table (for enhanced predictions)
CREATE TABLE analytics.ExternalFactors (
    FactorId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    FactorDate DATE,
    WeatherScore DECIMAL(3,1), -- 1-10 scale
    LocalEvents INT, -- number of events
    CompetitorPricing DECIMAL(10,2),
    EconomicIndex DECIMAL(5,2),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);