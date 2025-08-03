export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return '#4CAF50'; // Green
    case 'pending':
      return '#FF9800'; // Orange
    case 'cancelled':
      return '#F44336'; // Red
    case 'checkedin':
      return '#2196F3'; // Blue
    case 'checkedout':
      return '#9C27B0'; // Purple
    case 'approved':
      return '#4CAF50'; // Green
    case 'rejected':
      return '#F44336'; // Red
    case 'fulfilled':
      return '#8BC34A'; // Light Green
    default:
      return '#757575'; // Grey
  }
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatRoomNumber = (roomNumber: string): string => {
  return `Room ${roomNumber}`;
};

export const formatGuestCount = (count: number): string => {
  return count === 1 ? '1 Guest' : `${count} Guests`;
};

export const formatNights = (nights: number): string => {
  return nights === 1 ? '1 Night' : `${nights} Nights`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export const generateBookingReference = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 5);
  return `HB-${timestamp}-${random}`.toUpperCase();
};
