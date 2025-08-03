export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateDateRange = (checkIn: Date, checkOut: Date): string | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (checkIn < today) {
    return 'Check-in date cannot be in the past';
  }
  
  if (checkOut <= checkIn) {
    return 'Check-out date must be after check-in date';
  }
  
  const maxAdvanceBooking = new Date();
  maxAdvanceBooking.setFullYear(maxAdvanceBooking.getFullYear() + 1);
  
  if (checkIn > maxAdvanceBooking) {
    return 'Bookings can only be made up to 1 year in advance';
  }
  
  return null;
};

export const validateGuestCount = (guests: number, maxOccupancy: number): string | null => {
  if (guests <= 0) {
    return 'Number of guests must be at least 1';
  }
  
  if (guests > maxOccupancy) {
    return `Number of guests cannot exceed room capacity of ${maxOccupancy}`;
  }
  
  return null;
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

export const validateNumericRange = (value: number, min: number, max: number, fieldName: string): string | null => {
  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  return null;
};
