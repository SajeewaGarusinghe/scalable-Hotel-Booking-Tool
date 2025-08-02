using System;

namespace HotelBooking.Common.Constants
{
    public static class BookingConstants
    {
        public const string BookingConfirmed = "Confirmed";
        public const string BookingCancelled = "Cancelled";
        public const string BookingCheckedIn = "CheckedIn";
        public const string BookingCheckedOut = "CheckedOut";

        public const string SpecialRequestPending = "Pending";
        public const string SpecialRequestApproved = "Approved";
        public const string SpecialRequestDenied = "Denied";
        public const string SpecialRequestFulfilled = "Fulfilled";

        public const int MaxOccupancyStandardRoom = 2;
        public const int MaxOccupancyDeluxeRoom = 4;
        public const int MaxOccupancySuiteRoom = 6;

        public const decimal DefaultPricePerNightStandard = 100.00m;
        public const decimal DefaultPricePerNightDeluxe = 150.00m;
        public const decimal DefaultPricePerNightSuite = 250.00m;

        public static readonly DateTime DefaultCheckInTime = new DateTime(1, 1, 1, 15, 0, 0); // 3 PM
        public static readonly DateTime DefaultCheckOutTime = new DateTime(1, 1, 1, 11, 0, 0); // 11 AM
    }
}