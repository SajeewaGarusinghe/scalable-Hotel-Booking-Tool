using System;

namespace HotelBooking.Common.Utilities
{
    public static class DateTimeHelper
    {
        public static DateTime GetStartOfDay(DateTime date)
        {
            return date.Date;
        }

        public static DateTime GetEndOfDay(DateTime date)
        {
            return date.Date.AddDays(1).AddTicks(-1);
        }

        public static bool IsDateInRange(DateTime date, DateTime startDate, DateTime endDate)
        {
            return date >= startDate && date <= endDate;
        }

        public static int GetDaysDifference(DateTime startDate, DateTime endDate)
        {
            return (endDate - startDate).Days;
        }

        public static string FormatDate(DateTime date, string format)
        {
            return date.ToString(format);
        }
    }
}