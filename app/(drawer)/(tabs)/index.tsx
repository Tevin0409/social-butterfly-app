import { Stack } from 'expo-router';
import { Text } from 'react-native';
import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <Container>
        <Text>You have no Events</Text>
      </Container>
    </>
  );
}
