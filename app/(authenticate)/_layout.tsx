/* eslint-disable prettier/prettier */
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '~/theme/colors';
const AuthLayout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
          headerTransparent: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
            color: colors.primary,
          },
          headerLeft: () => (
            <Pressable onPress={() => router.push('/')}>
              <Text style={{ fontSize: 18, textAlign: 'center', color: colors.primary }}>Back</Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="registration"
        options={{
          title: 'Sign Up',
          headerTransparent: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
            color: colors.primary,
          },
          headerLeft: () => (
            <Pressable onPress={() => router.push('/')}>
              <Text style={{ fontSize: 18, textAlign: 'center', color: colors.primary }}>Back</Text>
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
