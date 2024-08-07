import { Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '~/theme/colors';

const AttendantListItem = ({ user }: { user: User }) => {
  console.log('user', user);
  return (
    <View style={styles.container}>
      <Ionicons name="person-circle" size={24} color={colors.primary} />
      <Text style={styles.name}>
        {user.firstName} {user.lastName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'BarlowSemiBold' : 'Barlow_600SemiBold',
  },
});
export default AttendantListItem;
