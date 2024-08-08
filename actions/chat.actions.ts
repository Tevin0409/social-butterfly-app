const BASE_URL =
  process.env.EXPO_PUBLIC_BASE_URL || 'https://final-socialbutterfly-backend.onrender.com/api';
export const sendMessage = async ({
  token,
  eventId,
  message,
}: {
  token: string;
  eventId: string;
  message: string;
}) => {
  const res = await fetch(`${BASE_URL}/chat/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`, // Include the token in the Authorization header
    },
    body: JSON.stringify({
      eventId,
      message,
    }),
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
};
