const BASE_URL =
  process.env.EXPO_PUBLIC_BASE_URL || 'https://final-socialbutterfly-backend.onrender.com/api';

interface AuthResponse {
  message: string;
  userInfo: User;
  token: string;
}

export const createEvent = async (
  event: SocialEvent,
  token: string
): Promise<CreateEventResponse | ErrorResponse> => {
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

export const fetchEventDetails = async (eventId: string): Promise<EventInfo> => {
  console.log('fetchEventDetails', BASE_URL);
  const response = await fetch(`${BASE_URL}/events/fetch-event/${eventId}`, {
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

export const fetchMyEvents = async (token: string): Promise<SocialEvent[]> => {
  console.log('fetchMyEvents', BASE_URL);
  const response = await fetch(`${BASE_URL}/events/fetch-events/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
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

export const bookEvent = async (
  eventId: string,
  status: string,
  token: string
): Promise<EventInfo> => {
  console.log('bookEvent', BASE_URL);
  console.log('details-bok', eventId, status, token);
  const response = await fetch(`${BASE_URL}/booking/create-booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      eventId: eventId,
      status: status,
    }),
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

export const fetchAllCategories = async (): Promise<Category[]> => {
  console.log('fetchAllCategories', BASE_URL);
  const response = await fetch(`${BASE_URL}/events/fetch-categories`, {
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

// New function to fetch events by category
export const fetchEventsByCategory = async (category: string): Promise<SocialEvent[]> => {
  console.log('fetchEventsByCategory', BASE_URL);
  const response = await fetch(`${BASE_URL}/events/fetch-events/category/${category}`, {
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

export const fetchAttendants = async (eventId: string): Promise<User[]> => {
  console.log('fetchAttendants', BASE_URL);
  const response = await fetch(`${BASE_URL}/events/fetch-attendees/${eventId}`, {
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
