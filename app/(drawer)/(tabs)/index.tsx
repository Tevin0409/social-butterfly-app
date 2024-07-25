import { Stack, useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';
import { Container } from '~/components/Container';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <Container>
        <Text>You have no Events</Text>
        <TouchableOpacity
          className=" bg-primary absolute bottom-5 right-5 h-16 w-16 items-center justify-center rounded-full shadow-lg"
          // style={styles.floatingButton}
          onPress={() => {
            router.push('/step1');
          }}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </Container>
    </>
  );
}
