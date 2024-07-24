import '../global.css';
import { RootSiblingParent } from 'react-native-root-siblings';
import * as SplashScreen from 'expo-splash-screen';
import { Stack, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '~/store/auth-store';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/index',
};

export default function RootLayout() {
  const router = useRouter();
  const { user, loadUserFromAsyncStorage } = useAuthStore((state) => ({
    user: state.user,
    loadUserFromAsyncStorage: state.loadUserFromAsyncStorage,
  }));

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    loadUserFromAsyncStorage().then(() => {
      SplashScreen.hideAsync();
    });
  }, [loaded]);

  useEffect(() => {
    if (loaded && user !== null) {
      router.replace('(drawer)/(tabs)');
    } else if (loaded && user === null) {
      router.replace('/login');
    }
  }, [loaded, user]);
  return (
    <RootSiblingParent>
      <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(authenticate)" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ title: 'Modal', presentation: 'modal' }} />
      </Stack>
    </RootSiblingParent>
  );
}
