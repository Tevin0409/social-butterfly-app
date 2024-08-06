import { Stack } from 'expo-router';
import { Text } from 'react-native';

import { Container } from '~/components/Container';

export default function Ticket() {
  return (
    <>
      <Stack.Screen options={{ title: 'My Bookings' }} />
      <Container>
        <Text>Ticket</Text>
      </Container>
    </>
  );
}
