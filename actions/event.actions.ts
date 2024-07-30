const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || 'http://192.168.1.3:5000/api';

interface AuthResponse {
  message: string;
  userInfo: User;
  token: string;
}

export const createEvent = async (
  event: SocialEvent,
  token: string
): Promise<AuthResponse | ErrorResponse> => {
  console.log('event', BASE_URL);
  const response = await fetch(`${BASE_URL}/events/create-event`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const error = await response.json();
    if (error.errorCode) {
      throw error;
    }
    if (error.errorCode && error.errorCode !== 3001) {
      throw error;
    } else {
      throw new Error('Something went wrong');
    }

    // throw error;
  }

  return response.json();
};

export const fetchAllEvents = async (): Promise<SocialEvent[]> => {
  console.log('fetchAllEvents', BASE_URL);
  const response = await fetch(`${BASE_URL}/events/fetch-events`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.log('error', error);
    if (error.errorCode) {
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
