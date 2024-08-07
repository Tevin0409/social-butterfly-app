import { Tabs } from 'expo-router';

import { TabBarIcon } from '~/components/TabBarIcon';
import { EventFormProvider } from '~/hooks/EventFormContext';

export default function TabLayout() {
  return (
    <EventFormProvider>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: 'black',
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Events',
            tabBarIcon: ({ color }) => <TabBarIcon name="list-alt" color={color} />,
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: 'My Events',
            tabBarLabel: 'My Events',
            tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
          }}
        />
        <Tabs.Screen
          name="ticket"
          options={{
            title: 'Bookings',
            tabBarLabel: 'RSVPs',
            tabBarIcon: ({ color }) => <TabBarIcon name="ticket" color={color} />,
          }}
        />
        {/* <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        /> */}
      </Tabs>
    </EventFormProvider>
  );
}
