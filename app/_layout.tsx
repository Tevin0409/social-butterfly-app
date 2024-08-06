import '../global.css';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Barlow_600SemiBold, Barlow_800ExtraBold } from '@expo-google-fonts/barlow';
import * as SplashScreen from 'expo-splash-screen';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Stack, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '~/store/auth-store';
import { colors } from '~/theme/colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const { user, loadUserFromAsyncStorage } = useAuthStore((state) => ({
    user: state.user,
    loadUserFromAsyncStorage: state.loadUserFromAsyncStorage,
  }));

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    BarlowBold: require('../assets/fonts/Barlow-Bold.ttf'),
    BarlowRegular: require('../assets/fonts/Barlow-Regular.ttf'),
    BarlowSemiBold: require('../assets/fonts/Barlow-SemiBold.ttf'),
    BarlowExtraBold: require('../assets/fonts/Barlow-ExtraBold.ttf'),
    Barlow_800ExtraBold,
    Barlow_600SemiBold,
  });

  useEffect(() => {
    if (loaded || error) {
      loadUserFromAsyncStorage().then(() => {
        SplashScreen.hideAsync();
      });
    }
  }, [loaded]);

  if (!loaded && !error) {
    return null;
  }

  useEffect(() => {
    if (loaded && user !== null) {
      router.replace('/(tabs)');
    } else if (loaded && user === null) {
      router.replace('/login');
    }
  }, [loaded, user]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(authenticate)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(events)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ title: 'Modal', presentation: 'modal' }} />
          <Stack.Screen
            name="details/[id]"
            options={{
              headerTransparent: true,
              title: 'Event Details',
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontSize: 18,
                color: colors.white,
              },
              // headerLeft: () => (
              //   <Pressable onPress={() => router.back()}>
              //     <Text style={{ fontSize: 18, textAlign: 'center', color: colors.primary }}>
              //       Back
              //     </Text>
              //   </Pressable>
              // ),
            }}
          />
        </Stack>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
}
