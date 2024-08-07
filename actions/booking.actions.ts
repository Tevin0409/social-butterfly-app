const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || 'http://192.168.1.6:5000/api';
export const fetchBookingById = async (bookingId: string): Promise<Booking> => {
  const response = await fetch(`${BASE_URL}/booking/fetch-booking/${bookingId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    if (error.errorCode === 3001) {
      throw error;
    }
    if (error.errorCode && error.errorCode !== 3001) {
      throw error;
    } else {
      throw new Error('Something went wrong');
    }
  }

  return response.json();
};
