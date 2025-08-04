-- Extended Sample Data for Hotel Booking System
-- This script adds more customers, rooms, and over 50 historical bookings

USE HotelBookingSystem;
GO

-- Clear existing data (optional - uncomment if needed)
-- DELETE FROM booking.SpecialRequests;
-- DELETE FROM analytics.BookingAnalytics;
-- DELETE FROM booking.Bookings;
-- DELETE FROM booking.Customers;
-- DELETE FROM booking.Rooms;

-- ============================================================================
-- CUSTOMERS DATA (30+ customers)
-- ============================================================================

INSERT INTO booking.Customers (GoogleId, Email, FirstName, LastName, PhoneNumber, Address, CreatedAt, UpdatedAt)
VALUES 
-- Original customers
('google-id-1', 'john.doe@example.com', 'John', 'Doe', '1234567890', '123 Elm St, Springfield', GETUTCDATE(), GETUTCDATE()),
('google-id-2', 'jane.smith@example.com', 'Jane', 'Smith', '0987654321', '456 Oak St, Springfield', GETUTCDATE(), GETUTCDATE()),

-- Additional customers
('google-id-3', 'michael.johnson@example.com', 'Michael', 'Johnson', '5551234567', '789 Pine Ave, New York', GETUTCDATE(), GETUTCDATE()),
('google-id-4', 'sarah.williams@example.com', 'Sarah', 'Williams', '5559876543', '321 Maple Dr, Los Angeles', GETUTCDATE(), GETUTCDATE()),
('google-id-5', 'david.brown@example.com', 'David', 'Brown', '5555551234', '654 Cedar Ln, Chicago', GETUTCDATE(), GETUTCDATE()),
('google-id-6', 'emily.davis@example.com', 'Emily', 'Davis', '5554443333', '987 Birch St, Miami', GETUTCDATE(), GETUTCDATE()),
('google-id-7', 'robert.miller@example.com', 'Robert', 'Miller', '5552228888', '147 Ash Rd, Seattle', GETUTCDATE(), GETUTCDATE()),
('google-id-8', 'lisa.wilson@example.com', 'Lisa', 'Wilson', '5556667777', '258 Spruce Ave, Denver', GETUTCDATE(), GETUTCDATE()),
('google-id-9', 'james.moore@example.com', 'James', 'Moore', '5553334444', '369 Poplar St, Boston', GETUTCDATE(), GETUTCDATE()),
('google-id-10', 'jennifer.taylor@example.com', 'Jennifer', 'Taylor', '5551112222', '741 Willow Dr, San Francisco', GETUTCDATE(), GETUTCDATE()),
('google-id-11', 'christopher.anderson@example.com', 'Christopher', 'Anderson', '5558889999', '852 Elm Park, Dallas', GETUTCDATE(), GETUTCDATE()),
('google-id-12', 'amanda.thomas@example.com', 'Amanda', 'Thomas', '5550001111', '963 Oak Ridge, Phoenix', GETUTCDATE(), GETUTCDATE()),
('google-id-13', 'matthew.jackson@example.com', 'Matthew', 'Jackson', '5557778888', '159 Pine Hill, Detroit', GETUTCDATE(), GETUTCDATE()),
('google-id-14', 'ashley.white@example.com', 'Ashley', 'White', '5554445555', '753 Cedar Valley, Atlanta', GETUTCDATE(), GETUTCDATE()),
('google-id-15', 'daniel.harris@example.com', 'Daniel', 'Harris', '5556661111', '486 Maple Grove, Las Vegas', GETUTCDATE(), GETUTCDATE()),
('google-id-16', 'stephanie.martin@example.com', 'Stephanie', 'Martin', '5553337777', '951 Birch Lake, Orlando', GETUTCDATE(), GETUTCDATE()),
('google-id-17', 'kevin.thompson@example.com', 'Kevin', 'Thompson', '5558882222', '357 Ash Creek, Portland', GETUTCDATE(), GETUTCDATE()),
('google-id-18', 'rachel.garcia@example.com', 'Rachel', 'Garcia', '5551119999', '624 Spruce Bay, Nashville', GETUTCDATE(), GETUTCDATE()),
('google-id-19', 'brandon.martinez@example.com', 'Brandon', 'Martinez', '5557773333', '795 Poplar Heights, Austin', GETUTCDATE(), GETUTCDATE()),
('google-id-20', 'nicole.robinson@example.com', 'Nicole', 'Robinson', '5554446666', '268 Willow Springs, San Diego', GETUTCDATE(), GETUTCDATE()),
('google-id-21', 'tyler.clark@example.com', 'Tyler', 'Clark', '5552224444', '139 Elm Gardens, Tampa', GETUTCDATE(), GETUTCDATE()),
('google-id-22', 'megan.rodriguez@example.com', 'Megan', 'Rodriguez', '5559995555', '672 Oak Meadow, Kansas City', GETUTCDATE(), GETUTCDATE()),
('google-id-23', 'joshua.lewis@example.com', 'Joshua', 'Lewis', '5556662222', '514 Pine Forest, Columbus', GETUTCDATE(), GETUTCDATE()),
('google-id-24', 'heather.lee@example.com', 'Heather', 'Lee', '5553338888', '847 Cedar Point, Indianapolis', GETUTCDATE(), GETUTCDATE()),
('google-id-25', 'andrew.walker@example.com', 'Andrew', 'Walker', '5558881111', '290 Maple Ridge, Charlotte', GETUTCDATE(), GETUTCDATE()),
('google-id-26', 'samantha.hall@example.com', 'Samantha', 'Hall', '5551117777', '635 Birch Harbor, San Antonio', GETUTCDATE(), GETUTCDATE()),
('google-id-27', 'jeremy.allen@example.com', 'Jeremy', 'Allen', '5557774444', '108 Ash Valley, Milwaukee', GETUTCDATE(), GETUTCDATE()),
('google-id-28', 'crystal.young@example.com', 'Crystal', 'Young', '5554448888', '471 Spruce Summit, Oklahoma City', GETUTCDATE(), GETUTCDATE()),
('google-id-29', 'nathan.hernandez@example.com', 'Nathan', 'Hernandez', '5556665555', '834 Poplar Glen, Louisville', GETUTCDATE(), GETUTCDATE()),
('google-id-30', 'tiffany.king@example.com', 'Tiffany', 'King', '5552226666', '207 Willow Crest, Memphis', GETUTCDATE(), GETUTCDATE());

-- ============================================================================
-- ROOMS DATA (Extended room inventory)
-- ============================================================================

INSERT INTO booking.Rooms (RoomNumber, RoomType, MaxOccupancy, PricePerNight, Description, Amenities, IsActive, CreatedAt, UpdatedAt)
VALUES 
-- Original rooms
('101', 'Deluxe', 2, 150.00, 'Spacious deluxe room with city view', '{"WiFi": true, "Air Conditioning": true, "Mini Bar": true}', 1, GETUTCDATE(), GETUTCDATE()),
('102', 'Standard', 2, 100.00, 'Cozy standard room', '{"WiFi": true, "Air Conditioning": false}', 1, GETUTCDATE(), GETUTCDATE()),
('201', 'Suite', 4, 250.00, 'Luxurious suite with living area', '{"WiFi": true, "Air Conditioning": true, "Mini Bar": true, "Balcony": true}', 1, GETUTCDATE(), GETUTCDATE()),

-- Additional rooms
('103', 'Standard', 2, 100.00, 'Standard room with garden view', '{"WiFi": true, "Air Conditioning": true}', 1, GETUTCDATE(), GETUTCDATE()),
('104', 'Deluxe', 2, 150.00, 'Deluxe room with ocean view', '{"WiFi": true, "Air Conditioning": true, "Mini Bar": true, "Ocean View": true}', 1, GETUTCDATE(), GETUTCDATE()),
('105', 'Standard', 2, 100.00, 'Standard room near elevator', '{"WiFi": true, "Air Conditioning": true}', 1, GETUTCDATE(), GETUTCDATE()),
('202', 'Deluxe', 2, 160.00, 'Deluxe room with mountain view', '{"WiFi": true, "Air Conditioning": true, "Mini Bar": true, "Mountain View": true}', 1, GETUTCDATE(), GETUTCDATE()),
('203', 'Suite', 4, 280.00, 'Presidential suite with panoramic view', '{"WiFi": true, "Air Conditioning": true, "Mini Bar": true, "Balcony": true, "Jacuzzi": true}', 1, GETUTCDATE(), GETUTCDATE()),
('204', 'Deluxe', 2, 150.00, 'Deluxe room with city skyline view', '{"WiFi": true, "Air Conditioning": true, "Mini Bar": true}', 1, GETUTCDATE(), GETUTCDATE()),
('205', 'Standard', 2, 100.00, 'Standard room with courtyard view', '{"WiFi": true, "Air Conditioning": true}', 1, GETUTCDATE(), GETUTCDATE()),
('301', 'Suite', 6, 350.00, 'Family suite with kitchenette', '{"WiFi": true, "Air Conditioning": true, "Mini Bar": true, "Kitchenette": true, "Balcony": true}', 1, GETUTCDATE(), GETUTCDATE()),
('302', 'Deluxe', 2, 170.00, 'Premium deluxe room', '{"WiFi": true, "Air Conditioning": true, "Mini Bar": true, "Premium Amenities": true}', 1, GETUTCDATE(), GETUTCDATE()),
('303', 'Standard', 2, 100.00, 'Standard room with street view', '{"WiFi": true, "Air Conditioning": true}', 1, GETUTCDATE(), GETUTCDATE()),
('304', 'Deluxe', 2, 150.00, 'Deluxe room with park view', '{"WiFi": true, "Air Conditioning": true, "Mini Bar": true}', 1, GETUTCDATE(), GETUTCDATE()),
('305', 'Suite', 4, 250.00, 'Business suite with workspace', '{"WiFi": true, "Air Conditioning": true, "Mini Bar": true, "Office Space": true}', 1, GETUTCDATE(), GETUTCDATE());

-- ============================================================================
-- HISTORICAL BOOKINGS DATA (50+ bookings from 2023-2024)
-- ============================================================================

-- Declare variables to store customer and room IDs
DECLARE @Customer1 UNIQUEIDENTIFIER, @Customer2 UNIQUEIDENTIFIER, @Customer3 UNIQUEIDENTIFIER, @Customer4 UNIQUEIDENTIFIER, @Customer5 UNIQUEIDENTIFIER;
DECLARE @Customer6 UNIQUEIDENTIFIER, @Customer7 UNIQUEIDENTIFIER, @Customer8 UNIQUEIDENTIFIER, @Customer9 UNIQUEIDENTIFIER, @Customer10 UNIQUEIDENTIFIER;
DECLARE @Customer11 UNIQUEIDENTIFIER, @Customer12 UNIQUEIDENTIFIER, @Customer13 UNIQUEIDENTIFIER, @Customer14 UNIQUEIDENTIFIER, @Customer15 UNIQUEIDENTIFIER;
DECLARE @Customer16 UNIQUEIDENTIFIER, @Customer17 UNIQUEIDENTIFIER, @Customer18 UNIQUEIDENTIFIER, @Customer19 UNIQUEIDENTIFIER, @Customer20 UNIQUEIDENTIFIER;
DECLARE @Customer21 UNIQUEIDENTIFIER, @Customer22 UNIQUEIDENTIFIER, @Customer23 UNIQUEIDENTIFIER, @Customer24 UNIQUEIDENTIFIER, @Customer25 UNIQUEIDENTIFIER;
DECLARE @Customer26 UNIQUEIDENTIFIER, @Customer27 UNIQUEIDENTIFIER, @Customer28 UNIQUEIDENTIFIER, @Customer29 UNIQUEIDENTIFIER, @Customer30 UNIQUEIDENTIFIER;

DECLARE @Room101 UNIQUEIDENTIFIER, @Room102 UNIQUEIDENTIFIER, @Room103 UNIQUEIDENTIFIER, @Room104 UNIQUEIDENTIFIER, @Room105 UNIQUEIDENTIFIER;
DECLARE @Room201 UNIQUEIDENTIFIER, @Room202 UNIQUEIDENTIFIER, @Room203 UNIQUEIDENTIFIER, @Room204 UNIQUEIDENTIFIER, @Room205 UNIQUEIDENTIFIER;
DECLARE @Room301 UNIQUEIDENTIFIER, @Room302 UNIQUEIDENTIFIER, @Room303 UNIQUEIDENTIFIER, @Room304 UNIQUEIDENTIFIER, @Room305 UNIQUEIDENTIFIER;

-- Get Customer IDs
SELECT @Customer1 = CustomerId FROM booking.Customers WHERE Email = 'john.doe@example.com';
SELECT @Customer2 = CustomerId FROM booking.Customers WHERE Email = 'jane.smith@example.com';
SELECT @Customer3 = CustomerId FROM booking.Customers WHERE Email = 'michael.johnson@example.com';
SELECT @Customer4 = CustomerId FROM booking.Customers WHERE Email = 'sarah.williams@example.com';
SELECT @Customer5 = CustomerId FROM booking.Customers WHERE Email = 'david.brown@example.com';
SELECT @Customer6 = CustomerId FROM booking.Customers WHERE Email = 'emily.davis@example.com';
SELECT @Customer7 = CustomerId FROM booking.Customers WHERE Email = 'robert.miller@example.com';
SELECT @Customer8 = CustomerId FROM booking.Customers WHERE Email = 'lisa.wilson@example.com';
SELECT @Customer9 = CustomerId FROM booking.Customers WHERE Email = 'james.moore@example.com';
SELECT @Customer10 = CustomerId FROM booking.Customers WHERE Email = 'jennifer.taylor@example.com';
SELECT @Customer11 = CustomerId FROM booking.Customers WHERE Email = 'christopher.anderson@example.com';
SELECT @Customer12 = CustomerId FROM booking.Customers WHERE Email = 'amanda.thomas@example.com';
SELECT @Customer13 = CustomerId FROM booking.Customers WHERE Email = 'matthew.jackson@example.com';
SELECT @Customer14 = CustomerId FROM booking.Customers WHERE Email = 'ashley.white@example.com';
SELECT @Customer15 = CustomerId FROM booking.Customers WHERE Email = 'daniel.harris@example.com';
SELECT @Customer16 = CustomerId FROM booking.Customers WHERE Email = 'stephanie.martin@example.com';
SELECT @Customer17 = CustomerId FROM booking.Customers WHERE Email = 'kevin.thompson@example.com';
SELECT @Customer18 = CustomerId FROM booking.Customers WHERE Email = 'rachel.garcia@example.com';
SELECT @Customer19 = CustomerId FROM booking.Customers WHERE Email = 'brandon.martinez@example.com';
SELECT @Customer20 = CustomerId FROM booking.Customers WHERE Email = 'nicole.robinson@example.com';
SELECT @Customer21 = CustomerId FROM booking.Customers WHERE Email = 'tyler.clark@example.com';
SELECT @Customer22 = CustomerId FROM booking.Customers WHERE Email = 'megan.rodriguez@example.com';
SELECT @Customer23 = CustomerId FROM booking.Customers WHERE Email = 'joshua.lewis@example.com';
SELECT @Customer24 = CustomerId FROM booking.Customers WHERE Email = 'heather.lee@example.com';
SELECT @Customer25 = CustomerId FROM booking.Customers WHERE Email = 'andrew.walker@example.com';
SELECT @Customer26 = CustomerId FROM booking.Customers WHERE Email = 'samantha.hall@example.com';
SELECT @Customer27 = CustomerId FROM booking.Customers WHERE Email = 'jeremy.allen@example.com';
SELECT @Customer28 = CustomerId FROM booking.Customers WHERE Email = 'crystal.young@example.com';
SELECT @Customer29 = CustomerId FROM booking.Customers WHERE Email = 'nathan.hernandez@example.com';
SELECT @Customer30 = CustomerId FROM booking.Customers WHERE Email = 'tiffany.king@example.com';

-- Get Room IDs
SELECT @Room101 = RoomId FROM booking.Rooms WHERE RoomNumber = '101';
SELECT @Room102 = RoomId FROM booking.Rooms WHERE RoomNumber = '102';
SELECT @Room103 = RoomId FROM booking.Rooms WHERE RoomNumber = '103';
SELECT @Room104 = RoomId FROM booking.Rooms WHERE RoomNumber = '104';
SELECT @Room105 = RoomId FROM booking.Rooms WHERE RoomNumber = '105';
SELECT @Room201 = RoomId FROM booking.Rooms WHERE RoomNumber = '201';
SELECT @Room202 = RoomId FROM booking.Rooms WHERE RoomNumber = '202';
SELECT @Room203 = RoomId FROM booking.Rooms WHERE RoomNumber = '203';
SELECT @Room204 = RoomId FROM booking.Rooms WHERE RoomNumber = '204';
SELECT @Room205 = RoomId FROM booking.Rooms WHERE RoomNumber = '205';
SELECT @Room301 = RoomId FROM booking.Rooms WHERE RoomNumber = '301';
SELECT @Room302 = RoomId FROM booking.Rooms WHERE RoomNumber = '302';
SELECT @Room303 = RoomId FROM booking.Rooms WHERE RoomNumber = '303';
SELECT @Room304 = RoomId FROM booking.Rooms WHERE RoomNumber = '304';
SELECT @Room305 = RoomId FROM booking.Rooms WHERE RoomNumber = '305';

-- Insert Historical Bookings (2023)
INSERT INTO booking.Bookings (CustomerId, RoomId, CheckInDate, CheckOutDate, NumberOfGuests, TotalAmount, BookingStatus, BookingReference, CreatedAt, UpdatedAt)
VALUES 
-- January 2023
(@Customer1, @Room101, '2023-01-05', '2023-01-08', 2, 450.00, 'CheckedOut', 'REF230101', '2023-01-05', '2023-01-08'),
(@Customer2, @Room102, '2023-01-10', '2023-01-12', 1, 200.00, 'CheckedOut', 'REF230102', '2023-01-10', '2023-01-12'),
(@Customer3, @Room201, '2023-01-15', '2023-01-18', 4, 750.00, 'CheckedOut', 'REF230103', '2023-01-15', '2023-01-18'),
(@Customer4, @Room103, '2023-01-20', '2023-01-23', 2, 300.00, 'CheckedOut', 'REF230104', '2023-01-20', '2023-01-23'),

-- February 2023
(@Customer5, @Room104, '2023-02-01', '2023-02-04', 2, 450.00, 'CheckedOut', 'REF230201', '2023-02-01', '2023-02-04'),
(@Customer6, @Room202, '2023-02-05', '2023-02-07', 2, 320.00, 'CheckedOut', 'REF230202', '2023-02-05', '2023-02-07'),
(@Customer7, @Room105, '2023-02-10', '2023-02-13', 2, 300.00, 'CheckedOut', 'REF230203', '2023-02-10', '2023-02-13'),
(@Customer8, @Room203, '2023-02-14', '2023-02-17', 4, 840.00, 'CheckedOut', 'REF230204', '2023-02-14', '2023-02-17'),

-- March 2023
(@Customer9, @Room204, '2023-03-01', '2023-03-04', 2, 450.00, 'CheckedOut', 'REF230301', '2023-03-01', '2023-03-04'),
(@Customer10, @Room205, '2023-03-05', '2023-03-08', 2, 300.00, 'CheckedOut', 'REF230302', '2023-03-05', '2023-03-08'),
(@Customer11, @Room301, '2023-03-10', '2023-03-13', 6, 1050.00, 'CheckedOut', 'REF230303', '2023-03-10', '2023-03-13'),
(@Customer12, @Room302, '2023-03-15', '2023-03-18', 2, 510.00, 'CheckedOut', 'REF230304', '2023-03-15', '2023-03-18'),

-- April 2023
(@Customer13, @Room303, '2023-04-01', '2023-04-04', 2, 300.00, 'CheckedOut', 'REF230401', '2023-04-01', '2023-04-04'),
(@Customer14, @Room304, '2023-04-05', '2023-04-08', 2, 450.00, 'CheckedOut', 'REF230402', '2023-04-05', '2023-04-08'),
(@Customer15, @Room305, '2023-04-10', '2023-04-13', 4, 750.00, 'CheckedOut', 'REF230403', '2023-04-10', '2023-04-13'),
(@Customer16, @Room101, '2023-04-15', '2023-04-18', 2, 450.00, 'CheckedOut', 'REF230404', '2023-04-15', '2023-04-18'),

-- May 2023
(@Customer17, @Room102, '2023-05-01', '2023-05-04', 1, 300.00, 'CheckedOut', 'REF230501', '2023-05-01', '2023-05-04'),
(@Customer18, @Room103, '2023-05-05', '2023-05-08', 2, 300.00, 'CheckedOut', 'REF230502', '2023-05-05', '2023-05-08'),
(@Customer19, @Room104, '2023-05-10', '2023-05-13', 2, 450.00, 'CheckedOut', 'REF230503', '2023-05-10', '2023-05-13'),
(@Customer20, @Room201, '2023-05-15', '2023-05-18', 4, 750.00, 'CheckedOut', 'REF230504', '2023-05-15', '2023-05-18'),

-- June 2023
(@Customer21, @Room202, '2023-06-01', '2023-06-05', 2, 640.00, 'CheckedOut', 'REF230601', '2023-06-01', '2023-06-05'),
(@Customer22, @Room203, '2023-06-06', '2023-06-09', 4, 840.00, 'CheckedOut', 'REF230602', '2023-06-06', '2023-06-09'),
(@Customer23, @Room204, '2023-06-10', '2023-06-13', 2, 450.00, 'CheckedOut', 'REF230603', '2023-06-10', '2023-06-13'),
(@Customer24, @Room205, '2023-06-15', '2023-06-18', 2, 300.00, 'CheckedOut', 'REF230604', '2023-06-15', '2023-06-18'),

-- July 2023 (Summer season - higher rates)
(@Customer25, @Room301, '2023-07-01', '2023-07-05', 6, 1400.00, 'CheckedOut', 'REF230701', '2023-07-01', '2023-07-05'),
(@Customer26, @Room302, '2023-07-06', '2023-07-09', 2, 510.00, 'CheckedOut', 'REF230702', '2023-07-06', '2023-07-09'),
(@Customer27, @Room303, '2023-07-10', '2023-07-14', 2, 400.00, 'CheckedOut', 'REF230703', '2023-07-10', '2023-07-14'),
(@Customer28, @Room304, '2023-07-15', '2023-07-18', 2, 450.00, 'CheckedOut', 'REF230704', '2023-07-15', '2023-07-18'),

-- August 2023 (Peak summer)
(@Customer29, @Room305, '2023-08-01', '2023-08-05', 4, 1000.00, 'CheckedOut', 'REF230801', '2023-08-01', '2023-08-05'),
(@Customer30, @Room101, '2023-08-06', '2023-08-09', 2, 450.00, 'CheckedOut', 'REF230802', '2023-08-06', '2023-08-09'),
(@Customer1, @Room102, '2023-08-10', '2023-08-13', 1, 300.00, 'CheckedOut', 'REF230803', '2023-08-10', '2023-08-13'),
(@Customer2, @Room103, '2023-08-15', '2023-08-18', 2, 300.00, 'CheckedOut', 'REF230804', '2023-08-15', '2023-08-18'),

-- September 2023
(@Customer3, @Room104, '2023-09-01', '2023-09-04', 2, 450.00, 'CheckedOut', 'REF230901', '2023-09-01', '2023-09-04'),
(@Customer4, @Room201, '2023-09-05', '2023-09-08', 4, 750.00, 'CheckedOut', 'REF230902', '2023-09-05', '2023-09-08'),
(@Customer5, @Room202, '2023-09-10', '2023-09-13', 2, 480.00, 'CheckedOut', 'REF230903', '2023-09-10', '2023-09-13'),
(@Customer6, @Room203, '2023-09-15', '2023-09-18', 4, 840.00, 'CheckedOut', 'REF230904', '2023-09-15', '2023-09-18'),

-- October 2023
(@Customer7, @Room204, '2023-10-01', '2023-10-04', 2, 450.00, 'CheckedOut', 'REF231001', '2023-10-01', '2023-10-04'),
(@Customer8, @Room205, '2023-10-05', '2023-10-08', 2, 300.00, 'CheckedOut', 'REF231002', '2023-10-05', '2023-10-08'),
(@Customer9, @Room301, '2023-10-10', '2023-10-14', 6, 1400.00, 'CheckedOut', 'REF231003', '2023-10-10', '2023-10-14'),
(@Customer10, @Room302, '2023-10-15', '2023-10-18', 2, 510.00, 'CheckedOut', 'REF231004', '2023-10-15', '2023-10-18'),

-- November 2023
(@Customer11, @Room303, '2023-11-01', '2023-11-04', 2, 300.00, 'CheckedOut', 'REF231101', '2023-11-01', '2023-11-04'),
(@Customer12, @Room304, '2023-11-05', '2023-11-08', 2, 450.00, 'CheckedOut', 'REF231102', '2023-11-05', '2023-11-08'),
(@Customer13, @Room305, '2023-11-10', '2023-11-13', 4, 750.00, 'CheckedOut', 'REF231103', '2023-11-10', '2023-11-13'),
(@Customer14, @Room101, '2023-11-15', '2023-11-18', 2, 450.00, 'CheckedOut', 'REF231104', '2023-11-15', '2023-11-18'),

-- December 2023 (Holiday season)
(@Customer15, @Room102, '2023-12-01', '2023-12-04', 1, 300.00, 'CheckedOut', 'REF231201', '2023-12-01', '2023-12-04'),
(@Customer16, @Room103, '2023-12-05', '2023-12-08', 2, 300.00, 'CheckedOut', 'REF231202', '2023-12-05', '2023-12-08'),
(@Customer17, @Room201, '2023-12-20', '2023-12-27', 4, 1750.00, 'CheckedOut', 'REF231203', '2023-12-20', '2023-12-27'),
(@Customer18, @Room203, '2023-12-28', '2024-01-02', 4, 1400.00, 'CheckedOut', 'REF231204', '2023-12-28', '2024-01-02'),

-- 2024 Bookings
-- January 2024
(@Customer19, @Room104, '2024-01-03', '2024-01-06', 2, 450.00, 'CheckedOut', 'REF240101', '2024-01-03', '2024-01-06'),
(@Customer20, @Room202, '2024-01-08', '2024-01-11', 2, 480.00, 'CheckedOut', 'REF240102', '2024-01-08', '2024-01-11'),
(@Customer21, @Room301, '2024-01-15', '2024-01-19', 6, 1400.00, 'CheckedOut', 'REF240103', '2024-01-15', '2024-01-19'),

-- February 2024
(@Customer22, @Room105, '2024-02-01', '2024-02-04', 2, 300.00, 'CheckedOut', 'REF240201', '2024-02-01', '2024-02-04'),
(@Customer23, @Room204, '2024-02-10', '2024-02-14', 2, 600.00, 'CheckedOut', 'REF240202', '2024-02-10', '2024-02-14'),
(@Customer24, @Room302, '2024-02-20', '2024-02-23', 2, 510.00, 'CheckedOut', 'REF240203', '2024-02-20', '2024-02-23'),

-- March 2024 (Recent bookings)
(@Customer25, @Room205, '2024-03-01', '2024-03-04', 2, 300.00, 'CheckedOut', 'REF240301', '2024-03-01', '2024-03-04'),
(@Customer26, @Room303, '2024-03-10', '2024-03-13', 2, 300.00, 'CheckedOut', 'REF240302', '2024-03-10', '2024-03-13'),
(@Customer27, @Room304, '2024-03-15', '2024-03-18', 2, 450.00, 'CheckedOut', 'REF240303', '2024-03-15', '2024-03-18'),
(@Customer28, @Room305, '2024-03-20', '2024-03-23', 4, 750.00, 'CheckedOut', 'REF240304', '2024-03-20', '2024-03-23'),

-- April 2024 - May 2024 (Spring bookings)
(@Customer29, @Room101, '2024-04-05', '2024-04-08', 2, 450.00, 'CheckedOut', 'REF240401', '2024-04-05', '2024-04-08'),
(@Customer30, @Room102, '2024-04-12', '2024-04-15', 1, 300.00, 'CheckedOut', 'REF240402', '2024-04-12', '2024-04-15'),
(@Customer1, @Room201, '2024-05-18', '2024-05-21', 4, 750.00, 'CheckedOut', 'REF240501', '2024-05-18', '2024-05-21'),
(@Customer2, @Room202, '2024-05-25', '2024-05-28', 2, 480.00, 'CheckedOut', 'REF240502', '2024-05-25', '2024-05-28'),

-- June 2025 (Recent summer bookings - 10 bookings)
(@Customer3, @Room101, '2025-06-02', '2025-06-05', 2, 450.00, 'CheckedOut', 'REF250601', '2025-06-02', '2025-06-05'),
(@Customer4, @Room102, '2025-06-07', '2025-06-10', 1, 300.00, 'CheckedOut', 'REF250602', '2025-06-07', '2025-06-10'),
(@Customer5, @Room201, '2025-06-12', '2025-06-16', 4, 1000.00, 'CheckedOut', 'REF250603', '2025-06-12', '2025-06-16'),
(@Customer6, @Room202, '2025-06-14', '2025-06-17', 2, 480.00, 'CheckedOut', 'REF250604', '2025-06-14', '2025-06-17'),
(@Customer7, @Room203, '2025-06-18', '2025-06-22', 4, 1120.00, 'CheckedOut', 'REF250605', '2025-06-18', '2025-06-22'),
(@Customer8, @Room301, '2025-06-20', '2025-06-24', 6, 1400.00, 'CheckedOut', 'REF250606', '2025-06-20', '2025-06-24'),
(@Customer9, @Room103, '2025-06-23', '2025-06-26', 2, 300.00, 'CheckedOut', 'REF250607', '2025-06-23', '2025-06-26'),
(@Customer10, @Room104, '2025-06-25', '2025-06-28', 2, 450.00, 'CheckedOut', 'REF250608', '2025-06-25', '2025-06-28'),
(@Customer11, @Room204, '2025-06-27', '2025-06-30', 2, 450.00, 'CheckedOut', 'REF250609', '2025-06-27', '2025-06-30'),
(@Customer12, @Room302, '2025-06-29', '2025-07-02', 2, 510.00, 'CheckedOut', 'REF250610', '2025-06-29', '2025-07-02'),

-- July 2025 (Peak summer bookings - 10 bookings)
(@Customer13, @Room105, '2025-07-01', '2025-07-05', 2, 400.00, 'CheckedOut', 'REF250701', '2025-07-01', '2025-07-05'),
(@Customer14, @Room205, '2025-07-03', '2025-07-07', 2, 400.00, 'CheckedOut', 'REF250702', '2025-07-03', '2025-07-07'),
(@Customer15, @Room303, '2025-07-06', '2025-07-09', 2, 300.00, 'CheckedOut', 'REF250703', '2025-07-06', '2025-07-09'),
(@Customer16, @Room304, '2025-07-08', '2025-07-12', 2, 600.00, 'CheckedOut', 'REF250704', '2025-07-08', '2025-07-12'),
(@Customer17, @Room305, '2025-07-10', '2025-07-14', 4, 1000.00, 'CheckedOut', 'REF250705', '2025-07-10', '2025-07-14'),
(@Customer18, @Room101, '2025-07-15', '2025-07-19', 2, 600.00, 'CheckedOut', 'REF250706', '2025-07-15', '2025-07-19'),
(@Customer19, @Room102, '2025-07-17', '2025-07-21', 1, 400.00, 'CheckedOut', 'REF250707', '2025-07-17', '2025-07-21'),
(@Customer20, @Room201, '2025-07-20', '2025-07-25', 4, 1250.00, 'CheckedOut', 'REF250708', '2025-07-20', '2025-07-25'),
(@Customer21, @Room203, '2025-07-22', '2025-07-26', 4, 1120.00, 'CheckedOut', 'REF250709', '2025-07-22', '2025-07-26'),
(@Customer22, @Room301, '2025-07-28', '2025-08-01', 6, 1400.00, 'Confirmed', 'REF250710', '2025-07-28', '2025-08-01');

-- ============================================================================
-- SPECIAL REQUESTS DATA
-- ============================================================================

-- Get some booking IDs for special requests
DECLARE @Booking1 UNIQUEIDENTIFIER, @Booking2 UNIQUEIDENTIFIER, @Booking3 UNIQUEIDENTIFIER, @Booking4 UNIQUEIDENTIFIER, @Booking5 UNIQUEIDENTIFIER;

SELECT TOP 1 @Booking1 = BookingId FROM booking.Bookings WHERE BookingReference = 'REF230101';
SELECT TOP 1 @Booking2 = BookingId FROM booking.Bookings WHERE BookingReference = 'REF230203';
SELECT TOP 1 @Booking3 = BookingId FROM booking.Bookings WHERE BookingReference = 'REF230501';
SELECT TOP 1 @Booking4 = BookingId FROM booking.Bookings WHERE BookingReference = 'REF230701';
SELECT TOP 1 @Booking5 = BookingId FROM booking.Bookings WHERE BookingReference = 'REF240301';

INSERT INTO booking.SpecialRequests (BookingId, RequestType, Description, Status, RequestDate, FulfilledDate)
VALUES 
(@Booking1, 'Late Checkout', 'Need to checkout at 2 PM', 'Fulfilled', '2023-01-05', '2023-01-08'),
(@Booking2, 'Extra Bed', 'Request for an extra bed in the room', 'Fulfilled', '2023-02-10', '2023-02-10'),
(@Booking3, 'Early Checkin', 'Arriving early, need 11 AM checkin', 'Fulfilled', '2023-05-01', '2023-05-01'),
(@Booking4, 'Airport Shuttle', 'Need pickup from airport', 'Fulfilled', '2023-07-01', '2023-07-01'),
(@Booking5, 'Room Service', 'Special dietary requirements', 'Pending', '2024-03-01', NULL),
(@Booking1, 'Spa Services', 'Book spa appointment for 2 people', 'Approved', '2023-01-06', '2023-01-07'),
(@Booking3, 'Car Rental', 'Need car rental information', 'Fulfilled', '2023-05-02', '2023-05-02'),
(@Booking4, 'Restaurant Reservation', 'Table for 6 at hotel restaurant', 'Fulfilled', '2023-07-02', '2023-07-02');

PRINT 'Extended sample data inserted successfully!';
PRINT 'Total customers: 30+';
PRINT 'Total rooms: 15';
PRINT 'Total historical bookings: 70+';
PRINT 'Booking date range: January 2023 - July 2025';
PRINT 'Recent bookings include: 10 June 2025 and 10 July 2025 summer bookings';
