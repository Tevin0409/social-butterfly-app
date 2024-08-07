import { Stack, useRouter } from 'expo-router';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Cloudinary } from '@cloudinary/url-gen';
import { upload } from 'cloudinary-react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import { Image as ExpoImage } from 'expo-image';

import { Container } from '~/components/Container';
import { createEvent, fetchMyEvents } from '~/actions/event.actions';
import Input from '~/components/TextInput';
import { useEventForm } from '~/hooks/EventFormContext';
import { useAuthStore } from '~/store/auth-store';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { colors } from '~/theme/colors';
import Toast from 'react-native-root-toast';
import { Button } from '~/components/Button';
import { useQuery } from '@tanstack/react-query';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RefreshControl } from 'react-native-gesture-handler';

export default function Home() {
  const router = useRouter();
  const { data, setData } = useEventForm();
  const { user, token } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SocialEvent | null>(null);

  const [open, setOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const {
    data: dt,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['fetch-my-events'],
    queryFn: () => fetchMyEvents(token!),
    enabled: true,
  });

  const handleSheetChange = (index: number) => {
    setOpen(index !== -1);
  };

  const handleOpenSheet = () => {
    bottomSheetRef.current?.snapToIndex(1);
    setOpen(true);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    // Add your refresh logic here, for example, fetching new data
    // Once the data is fetched, set refreshing to false
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const onPlaceSelected = (details: any) => {
    const { lat, lng } = details.geometry.location;
    const newRegion = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.0475,
      longitudeDelta: 0.0245,
    };
    setData((prevData) => ({
      ...prevData,
      mapData: newRegion,
      location: { latitude: lat, longitude: lng, name: details.name },
    }));
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    console.log(result.assets);

    if (!result.canceled && result.assets.length > 0) {
      for (let asset of result.assets) {
        await uploadImage(asset.uri);
      }
    }
  };

  const handleCreateEvent = async () => {
    try {
      Toast.show('Creating Event...');
      console.log('data', data);
      const res = await createEvent(data, token!);
      console.log('res', res);
      Toast.show(res.message);

      // setUser((res as AuthResponse).userInfo, (res as AuthResponse).token);
      // router.replace('/home');
    } catch (error) {
      Toast.show('Creating Event Failed');
      console.log('error', error);

      const errorResponse = error as ErrorResponse;
      // if (errorResponse.errors) {
      //   // Parse and set error messages
      //   const issues = errorResponse.errors.issues;
      //   const newErrors: Partial<Record<'email' | 'password', string>> = {};
      //   issues.forEach((issue) => {
      //     const field = issue.path[0] as 'email' | 'password';
      //     newErrors[field] = issue.message;
      //   });
      //   setErrors(newErrors);
      // } else {
      //   if ((error as ErrorResponse).errorCode) {
      //     Toast.show((error as ErrorResponse).message);
      //   } else {
      //     Toast.show('Something went wrong');
      //   }
      // }
    }
  };

  const uploadImage = async (uri: string) => {
    const cld = new Cloudinary({
      cloud: {
        cloudName: 'dvy00x8ss',
      },
      url: {
        secure: true,
      },
    });
    const options = {
      upload_preset: 'dglrzpk7',
      tag: 'sample',
      unsigned: true,
    };

    await upload(cld, {
      file: uri,
      options: options,
      callback: (error: any, response: any) => {
        if (error) {
          console.error('Upload error:', error);
          return;
        }
        console.log('Image uploaded:', response);
        setData((prevData) => ({
          ...prevData,
          photos: [
            {
              url: response.url,
              name: response.asset_id,
            },
          ],
        }));
      },
    });
  };

  const handleEditPress = (event: SocialEvent) => {
    setSelectedEvent(event);
    handleOpenSheet();
  };

  if (dt === undefined || dt.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: 'Events' }} />
        <Container>
          {/* <View className="h-full flex-col justify-between gap-4 px-6 pb-3 pt-14">
            <Text>You have no Events</Text>
            <TouchableOpacity
              className=" absolute bottom-5 right-5 h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg"
              // style={styles.floatingButton}
              onPress={() => {
                router.push('/step1');
              }}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View> */}
          <BottomSheet
            ref={bottomSheetRef}
            index={open ? 1 : -1}
            snapPoints={[200, '50%', '100%']}
            enablePanDownToClose={true}
            onChange={handleSheetChange}>
            <BottomSheetView
              style={{
                flex: 1,
                alignItems: 'center',
              }}>
              <Text className="mb-4 text-2xl font-semibold text-primary">
                All done🎉 Review and Submit
              </Text>

              <BottomSheetView
                style={{
                  width: '100%',
                  paddingHorizontal: 15,
                  paddingBottom: 15,
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                  flexGrow: 1,
                }}>
                <Text className="mb-4 text-xl font-semibold text-primary">{'Title'}</Text>
                <Text className="mb-4 text-xl font-semibold text-primary">Description</Text>

                <Text className="mb-4 text-xl font-semibold text-primary">Price</Text>
                <Text className="mb-4 text-xl font-semibold text-primary"></Text>
              </BottomSheetView>
            </BottomSheetView>
          </BottomSheet>
        </Container>
      </>
    );
  }
  return (
    <View className="flex-1 bg-white">
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
              My Events
            </Text>
          </View>
        </Animated.View>

        {/* Search Bar */}
      </View>
      <ScrollView
        className="flex-1 gap-4 bg-white"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size={'large'} color={colors.primary} />
          </View>
        ) : error ? (
          <Text>Error: {error.message}</Text>
        ) : dt && dt?.length > 0 ? (
          <FlatList
            data={dt}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => handleEditPress(item)}>
                <Animated.View
                  entering={FadeInDown.duration(100)
                    .delay(index * 300)
                    .springify()}
                  className={'w-full gap-2 overflow-hidden rounded-2xl border border-gray-200'}>
                  <ExpoImage
                    // className="aspect-video"
                    source={item.photos[0]?.url}
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    style={{ width: 300, height: 200, aspectRatio: 16 / 9 }}
                  />

                  <View className="absolute left-2 top-40 p-2 px-3">
                    <Text className="text-xl font-semibold text-white">{item.title}</Text>
                    <View className="flex w-full flex-1 flex-row items-center gap-2">
                      <Text className="text-sm font-semibold text-white">
                        {new Date(item.createdAt as string).toDateString()}
                      </Text>
                      <Text className="text-sm font-semibold text-white">{item.location.name}</Text>
                      <View className=" justify-between rounded-full bg-primary px-2 py-1 text-xs font-semibold">
                        <Text className="text-sm font-semibold text-white">KSH {item.price}</Text>
                      </View>
                    </View>
                  </View>
                </Animated.View>
              </Pressable>
            )}
            scrollEnabled={false}
            className="w-full"
            contentContainerStyle={{
              paddingTop: 10,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'column',
              gap: 10,
              // paddingHorizontal: 15,
            }}
          />
        ) : (
          <Text>No events found</Text>
        )}
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={open ? 1 : -1}
        snapPoints={[200, '50%', '90%']}
        enablePanDownToClose={true}
        onChange={handleSheetChange}>
        <BottomSheetView style={{ paddingHorizontal: 15 }}>
          <Text className=" text-center text-xl font-semibold text-primary">Edit Event</Text>
          <Text
            className={` my-1.5 text-base font-normal`}
            style={{
              color: '#1A1A1A',
            }}>
            Event Location
            <Text style={{ color: colors.error }}>*</Text>
          </Text>

          <GooglePlacesAutocomplete
            placeholder="Search for a place"
            fetchDetails={true}
            onPress={(data, details = null) => {
              console.log('details', details);
              console.log('data', data);
              if (details) {
                onPlaceSelected(details);
              }
            }}
            query={{
              key: 'AIzaSyDu1dCOYnqv0rYLW23fxYwyuupnMxvga-M',
              language: 'en',
            }}
            styles={{
              listView: { backgroundColor: 'white' },
              textInput: { color: 'black' },
              textInputContainer: {
                paddingLeft: 10,
                borderRadius: 10,
                borderWidth: 1.5,
                borderColor: '#A1A5AC',
                backgroundColor: 'white',
              },
              container: {
                width: '100%',
                flex: 0,
              },
            }}
          />
        </BottomSheetView>
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: 15,
          }}>
          <KeyboardAvoidingView behavior={'padding'} className="flex flex-1 flex-col ">
            <Text
              className={`  text-base font-normal`}
              style={{
                color: '#1A1A1A',
              }}>
              Please upload an image as your event theme ...
              <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <Pressable onPress={pickImage}>
              <ExpoImage
                // className="aspect-video"
                source={
                  selectedEvent?.photos[0]?.url ||
                  'https://img.freepik.com/free-vector/image-upload-concept-landing-page_23-2148309693.jpg?t=st=1722459767~exp=1722463367~hmac=4fc84d96721eb7724ab239d593eca102d7911e42a3eae4255b0cdec45d082fee&w=996'
                }
                placeholder={{ blurhash }}
                contentFit="cover"
                style={{ borderRadius: 12, width: 300, height: 200, aspectRatio: 16 / 9 }}
              />
            </Pressable>
            <Input
              label="Event Title"
              value={data.title.length > 0 ? data.title : selectedEvent?.title}
              onChangeText={(text) => setData({ ...data, title: text })}
              placeholder={'Enter the title of your event'}
              // errorMessage={errors.email}
              // onClearError={() => clearError('email')}
            />
            <Input
              label="Event Description"
              value={data.description.length > 0 ? data.description : selectedEvent?.description}
              onChangeText={(text) => setData({ ...data, description: text })}
              placeholder={'Enter the details about your event'}
              // errorMessage={errors.email}
              // onClearError={() => clearError('email')}
            />
            <Input
              label="Event Category"
              value={data.categories ? data.categories[0] : selectedEvent?.categories[0]}
              onChangeText={(text) => setData({ ...data, categories: [text] })}
              placeholder={'Enter the categories of your event'}
              // errorMessage={errors.email}
              // onClearError={() => clearError('email')}
            />

            <Input
              label="Event Price"
              value={
                Number(data.price).toString() !== 'NaN'
                  ? Number(data.price).toString()
                  : selectedEvent?.price.toString()
              }
              onChangeText={(text) =>
                setData({ ...data, price: !isNaN(parseFloat(text)) ? parseFloat(text) : 0 })
              }
              keyboardType="numeric"
              placeholder={'Enter the price of your event'}
            />
            <Button title="Submit" className="mt-4" onPress={handleCreateEvent} />
          </KeyboardAvoidingView>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}
