/* eslint-disable prettier/prettier */
import { Stack } from 'expo-router';
import React from 'react';
const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="registration" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
