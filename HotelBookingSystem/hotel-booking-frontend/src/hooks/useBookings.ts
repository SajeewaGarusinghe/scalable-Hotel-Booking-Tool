import { useState, useEffect } from 'react';
import { Booking } from '../types/booking';
import { BookingService } from '../services/bookingService';

interface UseBookingsOptions {
  autoFetch?: boolean;
  customerId?: string;
}

export const useBookings = (options: UseBookingsOptions = {}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { autoFetch = true, customerId } = options;

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let bookingsData: Booking[];
      
      if (customerId) {
        bookingsData = await BookingService.getBookingsByCustomer(customerId);
      } else {
        bookingsData = await BookingService.getBookings();
      }
      
      setBookings(bookingsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getBookingById = async (bookingId: string): Promise<Booking | null> => {
    try {
      const booking = await BookingService.getBookingById(bookingId);
      return booking;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch booking');
      return null;
    }
  };

  const createBooking = async (bookingData: any): Promise<Booking | null> => {
    try {
      const newBooking = await BookingService.createBooking(bookingData);
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      return null;
    }
  };

  const updateBooking = async (bookingId: string, bookingData: any): Promise<Booking | null> => {
    try {
      const updatedBooking = await BookingService.updateBooking(bookingId, bookingData);
      setBookings(prev => prev.map(booking => 
        booking.bookingId === bookingId ? updatedBooking : booking
      ));
      return updatedBooking;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking');
      return null;
    }
  };

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    try {
      await BookingService.cancelBooking(bookingId);
      setBookings(prev => prev.filter(booking => booking.bookingId !== bookingId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
      return false;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchBookings();
    }
  }, [autoFetch, customerId]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    getBookingById,
    createBooking,
    updateBooking,
    cancelBooking,
  };
};
