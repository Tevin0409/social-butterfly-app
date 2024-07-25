import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { EventFormProvider } from '~/hooks/EventFormContext';

export default function RootLayout() {
  const router = useRouter();

  return (
    <EventFormProvider>
      <Stack initialRouteName="step1">
        <Stack.Screen name="step1" options={{ title: 'Event Details' }} />
        <Stack.Screen name="step2" options={{ title: 'Location' }} />
        <Stack.Screen name="step3" options={{ title: 'Photos' }} />
        <Stack.Screen name="step4" options={{ title: 'Review and Submit' }} />
      </Stack>
    </EventFormProvider>
  );
}
