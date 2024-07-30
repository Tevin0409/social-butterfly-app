import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Button } from '~/components/Button';
import { EventFormProvider } from '~/hooks/EventFormContext';
import { Pressable, Text } from 'react-native';
import { colors } from '~/theme/colors';
import { useAuthStore } from '~/store/auth-store';

export default function RootLayout() {
  const router = useRouter();

  return (
    <EventFormProvider>
      <Stack
        initialRouteName="step1"
        screenOptions={{ headerTitleAlign: 'center', headerTransparent: true }}>
        <Stack.Screen
          name="step1"
          options={{
            title: 'Event Details',
            headerLeft: () => (
              <Pressable onPress={() => router.push('(drawer)')}>
                <Text style={{ fontSize: 18, textAlign: 'center', color: colors.primary }}>
                  Back
                </Text>
              </Pressable>
            ),
            headerTransparent: true,
          }}
        />
        <Stack.Screen name="step2" options={{ title: 'Location' }} />
        <Stack.Screen name="step3" options={{ title: 'Event Theme Photo' }} />
        <Stack.Screen
          name="step4"
          options={{
            title: 'Review and Submit',
            headerLeft: () => (
              <Pressable onPress={() => router.back()}>
                <Text style={{ fontSize: 18, textAlign: 'center', color: colors.primary }}>
                  Back
                </Text>
              </Pressable>
            ),
          }}
        />
      </Stack>
    </EventFormProvider>
  );
}
