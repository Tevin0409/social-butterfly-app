import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '~/theme/colors';

const BookingListItem = ({ booking, onPress }: { booking: Booking; onPress: () => void }) => {
  console.log('user', booking);
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Ionicons name="ticket" size={35} color={colors.primary} />
      <View style={{ flexDirection: 'column' }}>
        <Text style={styles.name}>{booking.event?.title}</Text>
        <Text style={styles.location}>{booking.event?.location.name}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'BarlowSemiBold' : 'Barlow_600SemiBold',
  },
  location: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'BarlowRegular' : 'Barlow_400Regular',
  },
});
export default BookingListItem;
