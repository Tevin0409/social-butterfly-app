const BASE_URL =
  process.env.EXPO_PUBLIC_BASE_URL || 'https://final-socialbutterfly-backend.onrender.com/api';
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
