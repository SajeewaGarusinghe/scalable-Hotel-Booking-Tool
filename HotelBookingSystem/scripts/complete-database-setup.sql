-- Hotel Booking System Database Setup Script
-- Run this script in Azure SQL Database Management Studio

USE [hotel-booking-db];
GO

-- Create schemas if they don't exist
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'booking')
BEGIN
    EXEC('CREATE SCHEMA booking')
END
GO

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'analytics')
BEGIN
    EXEC('CREATE SCHEMA analytics')
END
GO

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS booking.SpecialRequests;
DROP TABLE IF EXISTS booking.Bookings;
DROP TABLE IF EXISTS booking.Rooms;
DROP TABLE IF EXISTS booking.Customers;
DROP TABLE IF EXISTS analytics.BookingAnalytics;
DROP TABLE IF EXISTS analytics.Reports;
GO

-- Create booking schema tables
CREATE TABLE booking.Customers (
    CustomerId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    GoogleId NVARCHAR(100),
    Email NVARCHAR(100) NOT NULL UNIQUE,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    PhoneNumber NVARCHAR(20),
    Address NVARCHAR(200),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE TABLE booking.Rooms (
    RoomId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RoomNumber NVARCHAR(10) NOT NULL UNIQUE,
    RoomType NVARCHAR(50) NOT NULL,
    MaxOccupancy INT NOT NULL,
    PricePerNight DECIMAL(10,2) NOT NULL,
    Description NVARCHAR(500),
    Amenities NVARCHAR(MAX),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE TABLE booking.Bookings (
    BookingId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CustomerId UNIQUEIDENTIFIER NOT NULL,
    RoomId UNIQUEIDENTIFIER NOT NULL,
    CheckInDate DATE NOT NULL,
    CheckOutDate DATE NOT NULL,
    NumberOfGuests INT NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    BookingStatus NVARCHAR(20) DEFAULT 'Confirmed',
    IsRecurring BIT DEFAULT 0,
    RecurrencePattern NVARCHAR(100),
    BookingReference NVARCHAR(20) UNIQUE,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (CustomerId) REFERENCES booking.Customers(CustomerId),
    FOREIGN KEY (RoomId) REFERENCES booking.Rooms(RoomId)
);

CREATE TABLE booking.SpecialRequests (
    RequestId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BookingId UNIQUEIDENTIFIER NOT NULL,
    RequestType NVARCHAR(50) NOT NULL,
    Description NVARCHAR(500),
    Status NVARCHAR(20) DEFAULT 'Pending',
    RequestDate DATETIME2 DEFAULT GETUTCDATE(),
    FulfilledDate DATETIME2,
    FOREIGN KEY (BookingId) REFERENCES booking.Bookings(BookingId)
);

-- Create analytics schema tables
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

CREATE TABLE analytics.Reports (
    ReportId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ReportType NVARCHAR(50) NOT NULL,
    ReportPeriodStart DATE NOT NULL,
    ReportPeriodEnd DATE NOT NULL,
    ReportData NVARCHAR(MAX),
    GeneratedAt DATETIME2 DEFAULT GETUTCDATE(),
    GeneratedBy NVARCHAR(100)
);

-- Insert sample data
INSERT INTO booking.Customers (Email, FirstName, LastName, PhoneNumber, Address) VALUES
('john.doe@example.com', 'John', 'Doe', '+1234567890', '123 Main St, City, State 12345'),
('jane.smith@example.com', 'Jane', 'Smith', '+9876543210', '456 Oak Ave, City, State 67890'),
('test@example.com', 'Test', 'User', '+1111111111', '789 Test Ave, Test City, TC 12345');

INSERT INTO booking.Rooms (RoomNumber, RoomType, MaxOccupancy, PricePerNight, Description, Amenities) VALUES
('101', 'Standard', 2, 100.00, 'Comfortable standard room', '["WiFi", "Air Conditioning", "TV"]'),
('102', 'Standard', 2, 100.00, 'Comfortable standard room', '["WiFi", "Air Conditioning", "TV"]'),
('201', 'Deluxe', 4, 150.00, 'Spacious deluxe room with balcony', '["WiFi", "Air Conditioning", "TV", "Balcony", "Mini Bar"]'),
('301', 'Suite', 6, 250.00, 'Luxury suite with city view', '["WiFi", "Air Conditioning", "TV", "Balcony", "Mini Bar", "Jacuzzi"]');

PRINT 'Database schema and sample data created successfully!';
