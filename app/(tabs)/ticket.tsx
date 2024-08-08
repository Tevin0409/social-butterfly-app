import { useCallback, useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { FlatList, Platform, RefreshControl, SafeAreaView, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import QRCode from 'react-native-qrcode-svg';

import { fetchMyBookings } from '~/actions/user.actions';
import BookingListItem from '~/components/BookingListItem';
import { useAuthStore } from '~/store/auth-store';
import { colors } from '~/theme/colors';
import { fetchBookingById } from '~/actions/booking.actions';
import Toast from 'react-native-root-toast';

export default function Ticket() {
  const { token } = useAuthStore();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [open, setOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: bookings,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['fetch-bookings'],
    queryFn: () => fetchMyBookings(token!),
    enabled: true,
  });

  const {
    data: bookingDetails,
    error: bookingDetailsError,
    isLoading: bookingDetailsIsLoading,
    refetch: refetchBookingDetails,
  } = useQuery({
    queryKey: ['fetch-booking-details', selectedBookingId],
    queryFn: () => fetchBookingById(selectedBookingId),
    enabled: true,
  });

  useEffect(() => {
    if (bookingDetailsError) {
      bottomSheetRef.current?.snapToIndex(-1);
      setOpen(false);
      Toast.show('Something went wrong');
    }
  }, [bookingDetailsError]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleOpenSheet = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    bottomSheetRef.current?.snapToIndex(1);
    setOpen(true);
  };
  const handleSheetChange = (index: number) => {
    setOpen(index !== -1);
  };

  console.log('bookings', bookings);
  return (
    <View className="h-full flex-1 ">
      <View
        className="px-6 pb-6 pt-16 "
        style={{
          backgroundColor: colors.primary,
        }}>
        <Animated.View className={'flex-row items-center justify-between'}>
          <View>
            {/* <View className="flex-row items-end gap-2">
              <Text
                style={{
                  fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
                }}
                className="text-lg font-semibold text-white">
                Hello
              </Text>
              <Ionicons name="hand-right-outline" size={24} color="white" />
            </View> */}
            <Text
              style={{
                fontFamily: Platform.OS === 'ios' ? 'BarlowBold' : 'Barlow_700Bold',
              }}
              className="text-lg font-semibold text-white">
              My Reservations
            </Text>
          </View>
        </Animated.View>

        {/* Search Bar */}
      </View>
      <FlatList
        data={bookings}
        contentContainerStyle={{
          gap: 5,
          paddingHorizontal: 10,
        }}
        renderItem={({ item, index }) => (
          <BookingListItem booking={item} onPress={() => handleOpenSheet(item.id)} />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={open ? 1 : -1}
        snapPoints={[200, '50%', '90%']}
        enablePanDownToClose={true}
        onChange={handleSheetChange}>
        <BottomSheetView style={{ paddingHorizontal: 15 }}>
          <Text className=" text-center text-xl font-semibold text-primary">
            {bookingDetails?.event?.title}
          </Text>
        </BottomSheetView>
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: 15,
          }}>
          <BottomSheetView
            style={{
              paddingVertical: 15,
              paddingHorizontal: 15,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 10,
              width: '100%',
            }}>
            <QRCode
              value={`${bookingDetails?.user.firstName} ${bookingDetails?.user.lastName} - ${bookingDetails?.id} - ${bookingDetails?.status}`}
              size={150}
              color={colors.primary}
            />
            <Text className="my-1.5 text-center text-sm font-semibold text-zinc-500">code</Text>
            <Text
              className={` my-1.5 text-xl `}
              style={{
                color: '#1A1A1A',
                fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
              }}>
              {bookingDetails?.id}
            </Text>

            <View
              style={{
                borderColor: colors.primary,
                borderBottomWidth: 2,
                marginVertical: 10,
                width: '100%',
              }}></View>
          </BottomSheetView>
          <Text
            className="my-1.5 text-left text-sm  text-primary"
            style={{
              fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
              color: '#c8c8c8',
            }}>
            Name
          </Text>
          <Text
            className={` my-1.5 text-lg `}
            style={{
              color: colors.primary,
              fontFamily: Platform.OS === 'ios' ? 'BarlowSemiBold' : 'Barlow_700Bold',
            }}>
            {bookingDetails?.user?.firstName} {bookingDetails?.user?.lastName}
          </Text>
          <Text
            className="my-1.5 text-left text-sm  text-primary"
            style={{
              fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
              color: '#c8c8c8',
            }}>
            Email
          </Text>
          <Text
            className={` my-1.5 text-lg `}
            style={{
              color: colors.primary,
              fontFamily: Platform.OS === 'ios' ? 'BarlowSemiBold' : 'Barlow_700Bold',
            }}>
            {bookingDetails?.user?.email}
          </Text>
          <Text
            className=" text-left text-sm  text-primary"
            style={{
              fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
              color: '#c8c8c8',
            }}>
            Location
          </Text>
          <Text
            className={` my-1.5 text-lg `}
            style={{
              color: colors.primary,
              fontFamily: Platform.OS === 'ios' ? 'BarlowSemiBold' : 'Barlow_700Bold',
            }}>
            {bookingDetails?.event?.location.name}
          </Text>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}
