import React, { useCallback, useState } from 'react';
import { View, Text, Platform, Pressable, FlatList, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Animated from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '~/theme/colors';
import { fetchAttendants } from '~/actions/event.actions';
import AttendantListItem from '~/components/AttendantListItem';

const Participants = () => {
  const router = useRouter();
  const { eid } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: attendants,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['fetch-attendants'],
    queryFn: () => fetchAttendants(eid as string),
    enabled: true,
  });
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    // Add your refresh logic here, for example, fetching new data
    // Once the data is fetched, set refreshing to false
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  return (
    <View className="flex-1 ">
      <View
        className="px-6 pb-6 pt-16 "
        style={{
          backgroundColor: colors.primary,
        }}>
        <Animated.View className={'flex-row items-center justify-between'}>
          <View>
            <Pressable className="flex-row items-end gap-2 py-4 " onPress={() => router.back()}>
              {/* <Text
                style={{
                  fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
                }}
                className="text-lg font-semibold text-white">
                Participants
              </Text> */}
              <Ionicons name="arrow-back-outline" size={24} color="white" />
            </Pressable>
            <Text
              style={{
                fontFamily: Platform.OS === 'ios' ? 'BarlowBold' : 'Barlow_700Bold',
              }}
              className="pl-5 text-lg font-semibold text-white">
              Who is coming
            </Text>
          </View>
          <View></View>
        </Animated.View>

        {/* Search Bar */}
        <Pressable>
          <View className="mx-2 mt-4 flex-row items-center rounded-2xl bg-white/20 p-4">
            <MaterialCommunityIcons name="magnify" size={24} color="white" />
            <Text
              className="ml-2 text-white"
              style={{
                fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
              }}>
              Who are you looking for?
            </Text>
          </View>
        </Pressable>
      </View>
      <FlatList
        data={attendants}
        contentContainerStyle={{
          gap: 5,
        }}
        renderItem={({ item, index }) => <AttendantListItem user={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      {/* <ScrollView className="flex-1 gap-4 bg-white">
        <View></View>
      </ScrollView> */}
    </View>
  );
};

export default Participants;
