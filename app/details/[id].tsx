import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import MapView, { Marker } from 'react-native-maps';
import Toast from 'react-native-root-toast';
import { bookEvent, fetchEventDetails } from '~/actions/event.actions';
import { Button } from '~/components/Button';
import { useAuthStore } from '~/store/auth-store';
import { colors } from '~/theme/colors';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { token, user } = useAuthStore();
  const [details, setDetails] = useState<EventInfo | null>(null);
  const [open, setOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);
  const [hasBooked, setHasBooked] = useState(false);
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['fetch-event-details', id],
    queryFn: () => fetchEventDetails(id as string),
    enabled: true,
  });

  useEffect(() => {
    if (data === undefined) {
      refetch();
    } else {
      setDetails(data);
    }
    // const fetchDetails = async () => {
    //   const details = await fetchEventDetails(id as string);
    //   console.log('details', details);
    //   setDetails(details);
    // };
    // fetchDetails();
  }, [id, data]);

  useEffect(() => {
    console.log('details', details);
    const hasBooked =
      user?.id === data?.eventInfo.eventCreatedById ||
      hasUserBooked(user?.id as string, details?.bookings as Booking[]);
    setHasBooked(hasBooked);
    console.log('hasBooked', hasUserBooked(user?.id as string, details?.bookings as Booking[]));
  }, [details]);

  const router = useRouter();
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const handleSheetChange = (index: number) => {
    setOpen(index !== 1);
  };

  const hasUserBooked = (userId: string, bookings: Booking[]): boolean => {
    if (bookings) {
      console.log('bookings', bookings);
      const check = bookings.filter((booking) => booking.user.id === userId);
      if (check.length > 0) {
        return true;
      } else {
        return false;
      }
    }
    return false;
    // return bookings.some((booking) => booking.user.id === userId);
  };

  if (details === null) {
    return <Text>Loading...</Text>;
  }

  const handleMapLayout = () => {
    setMapReady(true);
  };

  const handleBookNow = async () => {
    try {
      Toast.show('Booking Event...');
      console.log('book now');
      const result = await bookEvent(id as string, 'booked', token!);
      console.log('result', result);

      refetch();
    } catch (error) {
      Toast.show('Booking Event Failed');
      console.log('error', error);

      const errorResponse = error as ErrorResponse;
      Toast.show(errorResponse.message);
    }
  };
  return (
    <View>
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: colors.primaryBg,
        }}>
        {/* {console.log('detailsssss', details.eventInfo.photos)} */}
        {/* <Image
          source={{ uri: details?.eventInfo.photos[0].url }}
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: 10,
            },
          ]}
        /> */}
        <ExpoImage
          source={details?.eventInfo.photos[0].url}
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: 10,
            },
          ]}
          placeholder={{ blurhash }}
          contentFit="cover"
          priority={'high'}
        />
        <View className="absolute  left-2 top-72">
          <Text className="text-xl font-semibold text-white">{details?.eventInfo.title}</Text>
          <View className="flex w-full flex-1 flex-row items-center  gap-10">
            <Text className="text-sm font-normal text-white">
              {new Date(details?.eventInfo.createdAt as string).toDateString()}
            </Text>
            <Text className="text-sm font-normal text-white">
              {details?.eventInfo.location.name}
            </Text>
          </View>
        </View>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        handleStyle={{
          backgroundColor: colors.white,
        }}
        snapPoints={['40%', '55%', '70%']}
        onChange={handleSheetChange}>
        {/* <LinearGradient style={{ flex: 1 }} colors={[colors.primaryBg, colors.secondary]}> */}
        <BottomSheetView
          style={{
            paddingVertical: 8,
            paddingHorizontal: 14,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View className="flex-col gap-2">
            <Text className=" text-left text-sm font-semibold text-primary">Amount</Text>
            <Text className=" text-left text-xl font-semibold text-primary">
              KES {details?.eventInfo.price}
            </Text>
          </View>
          <View className="flex-col items-center justify-center gap-2">
            <Text
              className={`  text-sm font-normal`}
              style={{
                color: '#1A1A1A',
              }}>
              Participants
            </Text>
            {details?.ownerInfo.id === user?.id ? (
              <Pressable onPress={() => router.push(`/details/participants/${id}`)}>
                <Text className=" text-center text-xl font-semibold text-primary">
                  {details?.bookings.length}
                </Text>
              </Pressable>
            ) : (
              <Text className=" text-center text-xl font-semibold text-primary">
                {details?.bookings.length}
              </Text>
            )}
          </View>
        </BottomSheetView>
        <BottomSheetScrollView
          contentContainerStyle={{
            height: '100%',
            flex: 1,
            backgroundColor: colors.PrimaryBgAlt,
            paddingHorizontal: 14,
            paddingVertical: 14,
          }}>
          <BottomSheetView
            style={{
              alignItems: 'center',
              width: '100%',
              backgroundColor: colors.white,
              flexDirection: 'row',
              paddingTop: 10,
              borderRadius: 10,
              paddingBottom: 10,
              paddingHorizontal: 15,
            }}>
            <Text className="text-xl font-semibold">
              {details?.ownerInfo.firstName} {details?.ownerInfo.lastName}
            </Text>
          </BottomSheetView>
          <BottomSheetView style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
            <Text className="text-sm font-normal">{details?.eventInfo.description}</Text>
            <MapView
              ref={mapRef}
              style={{
                width: '100%',
                height: '70%',
                marginVertical: 10,
                alignItems: 'center',
                borderRadius: 10,
                borderWidth: 4,
                borderColor: colors.primaryColorGrey,
              }}
              onLayout={handleMapLayout}
              initialRegion={{
                latitude: -1.301,
                longitude: 36.8281,
                latitudeDelta: 0.0475,
                longitudeDelta: 0.0245,
              }}
              region={
                mapReady
                  ? {
                      latitude: details?.eventInfo.location.latitude,
                      longitude: details?.eventInfo.location.longitude,
                      latitudeDelta: details?.eventInfo.mapData.latitudeDelta,
                      longitudeDelta: details?.eventInfo.mapData.longitudeDelta,
                    }
                  : undefined
              }>
              <Marker
                coordinate={{
                  latitude: details?.eventInfo.location.latitude,
                  longitude: details?.eventInfo.location.longitude,
                }}
                title={details?.eventInfo.location.name || 'Marker'}
              />
            </MapView>
            {/* <Button title="RSVP" className="mt-4" onPress={handleBookNow} /> */}
            {hasBooked && (
              <Button
                title="Chat"
                className="mt-4"
                onPress={() => router.push(`/details/chat/${id}`)}
              />
            )}
            {!hasBooked && <Button title="RSVP" className="mt-4" onPress={handleBookNow} />}
          </BottomSheetView>
        </BottomSheetScrollView>
        {/* </LinearGradient> */}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
