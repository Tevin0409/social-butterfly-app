import { Stack } from 'expo-router';
import { Text } from 'react-native';

import { Container } from '~/components/Container';

export default function Profile() {
  return (
    <>
      <Stack.Screen options={{ title: 'Profile' }} />
      <Container>
        <Text>Profile</Text>
      </Container>
    </>
  );
}
