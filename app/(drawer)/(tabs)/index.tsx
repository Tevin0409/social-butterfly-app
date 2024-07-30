import { Stack, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { Container } from '~/components/Container';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContent } from '~/components/ScreenContent';
import { fetchAllEvents } from '~/actions/event.actions';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [events, setEvents] = useState<SocialEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetchAllEvents();
      console.log('response', response);
      setEvents(response);
    };
    fetchEvents();
  }, []);
  if (events.length === 0 || events === undefined) {
    return (
      <>
        <Stack.Screen options={{ title: 'Tab One' }} />
        <Container>
          <View className="h-full flex-col justify-between gap-4 px-6 pb-3 pt-14">
            <Text>You have no Events</Text>
            <TouchableOpacity
              className=" absolute bottom-5 right-5 h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg"
              // style={styles.floatingButton}
              onPress={() => {
                router.push('/step1');
              }}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </Container>
      </>
    );
  }
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <Container>
        <View className="h-full flex-col justify-between gap-4 px-6 pb-3 pt-14">
          {events.map((event) => {
            return <Text key={event.id}>{event.title}</Text>;
          })}
          <TouchableOpacity
            className=" absolute bottom-5 right-5 h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg"
            // style={styles.floatingButton}
            onPress={() => {
              router.push('/step1');
            }}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Container>
    </>
  );
}
