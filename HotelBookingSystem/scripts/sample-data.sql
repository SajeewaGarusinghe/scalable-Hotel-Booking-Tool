-- Sample data for the Hotel Booking System

-- Insert sample customers
INSERT INTO booking.Customers (GoogleId, Email, FirstName, LastName, PhoneNumber, Address, CreatedAt, UpdatedAt)
VALUES 
('google-id-1', 'john.doe@example.com', 'John', 'Doe', '1234567890', '123 Elm St, Springfield', GETUTCDATE(), GETUTCDATE()),
('google-id-2', 'jane.smith@example.com', 'Jane', 'Smith', '0987654321', '456 Oak St, Springfield', GETUTCDATE(), GETUTCDATE());

-- Insert sample rooms
INSERT INTO booking.Rooms (RoomNumber, RoomType, MaxOccupancy, PricePerNight, Description, Amenities, IsActive, CreatedAt, UpdatedAt)
VALUES 
('101', 'Deluxe', 2, 150.00, 'Spacious deluxe room with city view', '{"WiFi": true, "Air Conditioning": true, "Mini Bar": true}', 1, GETUTCDATE(), GETUTCDATE()),
('102', 'Standard', 2, 100.00, 'Cozy standard room', '{"WiFi": true, "Air Conditioning": false}', 1, GETUTCDATE(), GETUTCDATE()),
('201', 'Suite', 4, 250.00, 'Luxurious suite with living area', '{"WiFi": true, "Air Conditioning": true, "Mini Bar": true, "Balcony": true}', 1, GETUTCDATE(), GETUTCDATE());

-- Insert sample bookings
INSERT INTO booking.Bookings (CustomerId, RoomId, CheckInDate, CheckOutDate, NumberOfGuests, TotalAmount, BookingStatus, IsRecurring, RecurrencePattern, BookingReference, CreatedAt, UpdatedAt)
VALUES 
(NEWID(), NEWID(), '2024-03-15', '2024-03-18', 2, 450.00, 'Confirmed', 0, NULL, 'REF12345', GETUTCDATE(), GETUTCDATE()),
(NEWID(), NEWID(), '2024-03-20', '2024-03-22', 1, 200.00, 'Confirmed', 0, NULL, 'REF12346', GETUTCDATE(), GETUTCDATE());

-- Insert sample special requests
INSERT INTO booking.SpecialRequests (BookingId, RequestType, Description, Status, RequestDate, FulfilledDate)
VALUES 
(NEWID(), 'Late Checkout', 'Need to checkout at 2 PM', 'Pending', GETUTCDATE(), NULL),
(NEWID(), 'Extra Bed', 'Request for an extra bed in the room', 'Approved', GETUTCDATE(), GETUTCDATE());