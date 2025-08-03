# API Documentation for the Enterprise Hotel Booking System

## Overview

The Enterprise Hotel Booking System provides a comprehensive API for managing hotel bookings, room availability, and analytics. This documentation outlines the available endpoints, request/response formats, and authentication mechanisms.

## Base URL

The base URL for the API is:

```
http://localhost:5000/api
```

## Authentication

The API uses Google OAuth 2.0 for authentication. Users must obtain a JWT token by logging in through the `/auth/google-login` endpoint. The token must be included in the `Authorization` header for all subsequent requests.

### Example of Authorization Header

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### 1. Authentication

#### POST /auth/google-login

- **Description**: Authenticates a user using Google OAuth.
- **Request Body**: None
- **Response**:
  - **200 OK**: Returns a JWT token.
  - **401 Unauthorized**: Invalid credentials.

### 2. Booking Service

#### Bookings

- **GET /bookings**

  - **Description**: Retrieves a list of bookings with optional pagination.
  - **Query Parameters**:
    - `page`: Page number (default: 1)
    - `pageSize`: Number of bookings per page (default: 10)
    - `status`: Filter by booking status (e.g., confirmed, cancelled)
  - **Response**:
    - **200 OK**: Returns a list of bookings.

- **POST /bookings**

  - **Description**: Creates a new booking.
  - **Request Body**:
    ```json
    {
      "customerId": "uuid",
      "roomId": "uuid",
      "checkInDate": "YYYY-MM-DD",
      "checkOutDate": "YYYY-MM-DD",
      "numberOfGuests": 2,
      "specialRequests": [
        {
          "requestType": "Late Checkout",
          "description": "Need to checkout at 2 PM"
        }
      ]
    }
    ```
  - **Response**:
    - **201 Created**: Returns the created booking details.

- **GET /bookings/{bookingId}**

  - **Description**: Retrieves a booking by ID.
  - **Response**:
    - **200 OK**: Returns the booking details.
    - **404 Not Found**: Booking not found.

- **PUT /bookings/{bookingId}**

  - **Description**: Updates an existing booking.
  - **Request Body**: Same as POST /bookings.
  - **Response**:
    - **200 OK**: Returns the updated booking details.

- **DELETE /bookings/{bookingId}**

  - **Description**: Cancels a booking.
  - **Response**:
    - **204 No Content**: Successfully cancelled.

#### Rooms

- **GET /rooms**

  - **Description**: Retrieves a list of rooms.
  - **Query Parameters**:
    - `roomType`: Filter by room type.
    - `available`: Filter by availability.
  - **Response**:
    - **200 OK**: Returns a list of rooms.

- **POST /rooms**

  - **Description**: Creates a new room.
  - **Request Body**:
    ```json
    {
      "roomNumber": "201",
      "roomType": "Deluxe",
      "maxOccupancy": 4,
      "pricePerNight": 150.00,
      "description": "Spacious deluxe room with city view",
      "amenities": ["WiFi", "Air Conditioning", "Mini Bar", "Balcony"]
    }
    ```
  - **Response**:
    - **201 Created**: Returns the created room details.

### 3. Analytics Service

#### Reports

- **GET /reports/weekly**

  - **Description**: Retrieves weekly booking reports.
  - **Query Parameters**:
    - `startDate`: Start date for the report.
    - `endDate`: End date for the report.
  - **Response**:
    - **200 OK**: Returns the report data.

#### Predictions

- **GET /predictions/pricing**

  - **Description**: Retrieves price predictions for a specified room type.
  - **Query Parameters**:
    - `roomType`: Type of room.
    - `startDate`: Start date for predictions.
    - `endDate`: End date for predictions.
  - **Response**:
    - **200 OK**: Returns predicted prices.

### Error Handling

All API responses include a status code and a message in case of errors. Common status codes include:

- **400 Bad Request**: Invalid request parameters.
- **401 Unauthorized**: Authentication failed.
- **404 Not Found**: Resource not found.
- **500 Internal Server Error**: Unexpected server error.

## Conclusion

This API documentation provides a comprehensive overview of the endpoints available in the Enterprise Hotel Booking System. For further details, please refer to the individual service documentation or contact the development team.