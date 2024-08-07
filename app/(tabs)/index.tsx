import { Stack, useRouter } from 'expo-router';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Cloudinary } from '@cloudinary/url-gen';
import { upload } from 'cloudinary-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import {
  createEvent,
  fetchAllEvents,
  fetchAllCategories,
  fetchEventsByCategory,
} from '~/actions/event.actions';
import Input from '~/components/TextInput';
import { useEventForm } from '~/hooks/EventFormContext';
import { useAuthStore } from '~/store/auth-store';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { colors } from '~/theme/colors';
import Toast from 'react-native-root-toast';
import { Button } from '~/components/Button';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useQuery } from '@tanstack/react-query';
import EventsMap from '~/components/EventsMap';

export default function Home() {
  const router = useRouter();
  const { data, setData } = useEventForm();
  const { user, token } = useAuthStore();
  const [event_categories, set_event_categories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [isMapView, setIsMapView] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const {
    data: categories,
    error: categoryError,
    isLoading: categoryIsLoading,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ['fetch-categories'],
    queryFn: () => fetchAllCategories(),
    enabled: true,
  });

  const {
    data: dt,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['fetch-events-by-category', selectedCategory],
    queryFn: () => fetchEventsByCategory(selectedCategory),
    enabled: true,
  });

  const {
    data: dt2,
    error: error2,
    isLoading: isLoading2,
    refetch: refetch2,
  } = useQuery({
    queryKey: ['fetch-events'],
    queryFn: () => fetchAllEvents(),
    enabled: true,
  });
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSelectedCategory('');
    refetchCategories();
    refetch();
    refetch2();
    // Add your refresh logic here, for example, fetching new data
    // Once the data is fetched, set refreshing to false
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.push('/');
  };

  const handleSheetChange = (index: number) => {
    setOpen(index !== -1);
  };

  const handleOpenSheet = () => {
    bottomSheetRef.current?.snapToIndex(1);
    setOpen(true);
  };

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
      if (res as CreateEventResponse) {
        Toast.show(res.message);
        setSelectedCategory('');
        refetch();
        refetch2();
        refetchCategories();
        setData(() => ({
          location: { latitude: 0, longitude: 0, name: '' },
          mapData: { latitude: 0, longitude: 0, latitudeDelta: 0.0475, longitudeDelta: 0.0245 },
          title: '',
          description: '',
          categories: [],
          price: 0,
          photos: [],
          eventCreatedById: '',
        }));
        bottomSheetRef.current?.snapToIndex(-1);
        setOpen(false);
      }

      // bottomSheetRef.current?.snapToIndex(-1);
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

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  useEffect(() => {
    if (categories) {
      set_event_categories(categories);
    } else {
      set_event_categories([]);
      refetchCategories();
    }
  }, [categories]);

  // if (dt === undefined || dt.length === 0) {
  //   return (
  //     <>
  //       <Stack.Screen options={{ title: 'Events' }} />
  //       <Container>
  //         {/* <View className="h-full flex-col justify-between gap-4 px-6 pb-3 pt-14">
  //           <Text>You have no Events</Text>
  //           <TouchableOpacity
  //             className=" absolute bottom-5 right-5 h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg"
  //             // style={styles.floatingButton}
  //             onPress={() => {
  //               router.push('/step1');
  //             }}>
  //             <Ionicons name="add" size={24} color="white" />
  //           </TouchableOpacity>
  //         </View> */}
  //         <BottomSheet
  //           ref={bottomSheetRef}
  //           index={open ? 1 : -1}
  //           snapPoints={[200, '50%', '90%']}
  //           enablePanDownToClose={true}
  //           onChange={handleSheetChange}>
  //           <BottomSheetView style={{ paddingHorizontal: 15 }}>
  //             <Text className=" text-center text-xl font-semibold text-primary">
  //               Create A New Event
  //             </Text>
  //             <Text
  //               className={` my-1.5 text-base font-normal`}
  //               style={{
  //                 color: '#1A1A1A',
  //               }}>
  //               Event Location
  //               <Text style={{ color: colors.error }}>*</Text>
  //             </Text>

  //             <GooglePlacesAutocomplete
  //               placeholder="Search for a place"
  //               fetchDetails={true}
  //               onPress={(data, details = null) => {
  //                 if (details) {
  //                   onPlaceSelected(details);
  //                 }
  //               }}
  //               query={{
  //                 key: 'AIzaSyDu1dCOYnqv0rYLW23fxYwyuupnMxvga-M',
  //                 language: 'en',
  //               }}
  //               styles={{
  //                 listView: { backgroundColor: 'white' },
  //                 textInput: { color: 'black' },
  //                 textInputContainer: {
  //                   paddingLeft: 10,
  //                   borderRadius: 10,
  //                   borderWidth: 1.5,
  //                   borderColor: '#A1A5AC',
  //                   backgroundColor: 'white',
  //                 },
  //                 container: {
  //                   width: '100%',
  //                   flex: 0,
  //                 },
  //               }}
  //             />
  //           </BottomSheetView>
  //           <BottomSheetScrollView
  //             contentContainerStyle={{
  //               paddingHorizontal: 15,
  //             }}>
  //             <KeyboardAvoidingView behavior={'padding'} className="flex flex-1 flex-col ">
  //               <Text
  //                 className={`  text-base font-normal`}
  //                 style={{
  //                   color: '#1A1A1A',
  //                 }}>
  //                 Please upload an image as your event theme ...
  //                 <Text style={{ color: colors.error }}>*</Text>
  //               </Text>
  //               <Pressable onPress={pickImage}>
  //                 <Image
  //                   source={{
  //                     uri:
  //                       data.photos[0]?.url ||
  //                       'https://img.freepik.com/free-vector/image-upload-concept-landing-page_23-2148309693.jpg?t=st=1722459767~exp=1722463367~hmac=4fc84d96721eb7724ab239d593eca102d7911e42a3eae4255b0cdec45d082fee&w=996',
  //                   }}
  //                   className=" aspect-video   rounded-lg"
  //                   style={{
  //                     width: 300,
  //                     height: 200,
  //                     borderRadius: 12,
  //                   }}
  //                 />
  //               </Pressable>
  //               <Input
  //                 label="Event Title"
  //                 value={data.title}
  //                 onChangeText={(text) => setData({ ...data, title: text })}
  //                 placeholder="Enter the title of your event"
  //                 // errorMessage={errors.email}
  //                 // onClearError={() => clearError('email')}
  //               />
  //               <Input
  //                 label="Event Description"
  //                 value={data.description}
  //                 onChangeText={(text) => setData({ ...data, description: text })}
  //                 placeholder="Enter the details about your event"
  //                 // errorMessage={errors.email}
  //                 // onClearError={() => clearError('email')}
  //               />
  //               <Input
  //                 label="Event Category"
  //                 value={data.categories ? data.categories[0] : ''}
  //                 onChangeText={(text) => setData({ ...data, categories: [text] })}
  //                 placeholder="Enter the categories of your event"
  //                 // errorMessage={errors.email}
  //                 // onClearError={() => clearError('email')}
  //               />

  //               <Input
  //                 label="Event Price"
  //                 value={Number(data.price).toString()}
  //                 onChangeText={(text) =>
  //                   setData({ ...data, price: !isNaN(parseFloat(text)) ? parseFloat(text) : 0 })
  //                 }
  //                 keyboardType="numeric"
  //                 placeholder="Enter the price of your event"
  //               />
  //               <Button title="Submit" className="mt-4" onPress={handleCreateEvent} />
  //             </KeyboardAvoidingView>
  //           </BottomSheetScrollView>
  //         </BottomSheet>
  //       </Container>
  //     </>
  //   );
  // }
  if (dt2 && dt === undefined) {
    console.log('dt2', dt2);
    return (
      <View className="flex-1 bg-white">
        <View
          className="px-6 pb-6 pt-16 "
          style={{
            backgroundColor: colors.primary,
          }}>
          <Animated.View className={'flex-row items-center justify-between'}>
            <View>
              <View className="flex-row items-end gap-2">
                <Text
                  style={{
                    fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
                  }}
                  className="text-lg font-semibold text-white">
                  Hello
                </Text>
                <Ionicons name="hand-right-outline" size={24} color="white" />
              </View>
              <Text
                style={{
                  fontFamily: Platform.OS === 'ios' ? 'BarlowBold' : 'Barlow_700Bold',
                }}
                className="text-lg font-semibold text-white">
                {user?.firstName} {user?.lastName}
              </Text>
            </View>
            <View>
              <Pressable onPress={handleLogout}>
                <MaterialCommunityIcons name="logout" size={24} color="white" />
              </Pressable>
            </View>
          </Animated.View>

          {/* Search Bar */}
          <Pressable>
            <View className="mt-4 flex-row items-center rounded-2xl bg-white/20 p-4">
              <MaterialCommunityIcons name="magnify" size={24} color="white" />
              <Text
                className="ml-2 text-white"
                style={{
                  fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
                }}>
                What event do you want to attend?
              </Text>
            </View>
          </Pressable>
        </View>
        <ScrollView
          className="flex-1 gap-4 bg-white"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <Animated.View
            className={'gap-6'}
            entering={FadeInDown.duration(500).delay(200).springify()}>
            <View className="flex-row items-center justify-between px-6 pt-4">
              <Text
                style={{
                  fontFamily: Platform.OS === 'ios' ? 'BarlowBold' : 'Barlow_700Bold',
                }}
                className="px-6 py-4 text-xl font-normal text-primary">
                Categories
              </Text>

              <Pressable
                className={`flex-row items-center gap-2 rounded-lg ${isMapView ? 'bg-tertiary' : 'bg-primary'} p-2`}
                onPress={() => setIsMapView(!isMapView)}>
                <Text className="text-sm font-semibold text-white">Map View</Text>
                <Ionicons name="globe" size={24} color={colors.white} />
              </Pressable>
            </View>

            {/* categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 pl-4">
              {event_categories.map((category) => (
                <View key={category.id} className="">
                  <Pressable
                    onPress={() => setSelectedCategory(category.name)}
                    className="mr-4 flex-col items-center gap-4 rounded-full p-2">
                    <View
                      className={`flex-row items-center rounded-full p-4 ${
                        selectedCategory === category.name
                          ? 'border-2 border-primary'
                          : 'border border-gray-400'
                      } `}>
                      <Ionicons
                        name="checkmark"
                        size={24}
                        color={selectedCategory === category.name ? colors.primary : 'gray'}
                      />
                    </View>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'ios'
                            ? selectedCategory === category.name
                              ? 'BarlowBold'
                              : 'BarlowMedium'
                            : selectedCategory === category.name
                              ? 'Barlow_700Bold'
                              : 'Barlow_500Medium',
                      }}
                      className="text-sm font-semibold text-primary">
                      {category.name}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Events */}
          {isLoading2 ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size={'large'} color={colors.primary} />
            </View>
          ) : error2 ? (
            <Text>Error: {error2.message}</Text>
          ) : !isMapView && dt2 && dt2?.length > 0 ? (
            <FlatList
              data={dt2}
              renderItem={({ item, index }) => (
                <Pressable onPress={() => router.push('/details/' + item.id)}>
                  <Animated.View
                    entering={FadeInDown.duration(100)
                      .delay(index * 300)
                      .springify()}
                    className={'w-full gap-2 overflow-hidden rounded-2xl border border-gray-200'}>
                    {/* <Image
                    source={{ uri: item.photos[0]?.url }}
                    className="aspect-video  "
                    style={{ width: 200, height: 200 }}
                  /> */}
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
                        <Text className="text-sm font-semibold text-white">
                          {item.location.name}
                        </Text>
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
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'column',
                gap: 10,
                // paddingHorizontal: 15,
              }}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
          ) : isMapView ? (
            <EventsMap events={dt2 ? dt2 : []} />
          ) : (
            <Text>No events found</Text>
          )}
        </ScrollView>

        <TouchableOpacity
          className=" absolute bottom-5 right-5 h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg"
          // style={styles.floatingButton}
          onPress={handleOpenSheet}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
        <BottomSheet
          ref={bottomSheetRef}
          index={open ? 1 : -1}
          snapPoints={[200, '50%', '90%']}
          enablePanDownToClose={true}
          onChange={handleSheetChange}>
          <BottomSheetView style={{ paddingHorizontal: 15 }}>
            <Text className=" text-center text-xl font-semibold text-primary">
              Create A New Event
            </Text>
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
                <Image
                  source={{
                    uri:
                      data.photos[0]?.url ||
                      'https://img.freepik.com/free-vector/image-upload-concept-landing-page_23-2148309693.jpg?t=st=1722459767~exp=1722463367~hmac=4fc84d96721eb7724ab239d593eca102d7911e42a3eae4255b0cdec45d082fee&w=996',
                  }}
                  className=" aspect-video   rounded-lg"
                  style={{
                    width: 300,
                    height: 200,
                    borderRadius: 12,
                  }}
                />
              </Pressable>
              <Input
                label="Event Title"
                value={data.title}
                onChangeText={(text) => setData({ ...data, title: text })}
                placeholder="Enter the title of your event"
                // errorMessage={errors.email}
                // onClearError={() => clearError('email')}
              />
              <Input
                label="Event Description"
                value={data.description}
                onChangeText={(text) => setData({ ...data, description: text })}
                placeholder="Enter the details about your event"
                // errorMessage={errors.email}
                // onClearError={() => clearError('email')}
              />
              <Input
                label="Event Category"
                value={data.categories ? data.categories[0] : ''}
                onChangeText={(text) => setData({ ...data, categories: [text] })}
                placeholder="Enter the categories of your event"
                // errorMessage={errors.email}
                // onClearError={() => clearError('email')}
              />

              <Input
                label="Event Price"
                value={Number(data.price).toString()}
                onChangeText={(text) =>
                  setData({ ...data, price: !isNaN(parseFloat(text)) ? parseFloat(text) : 0 })
                }
                keyboardType="numeric"
                placeholder="Enter the price of your event"
              />
              <Button title="Submit" className="mt-4" onPress={handleCreateEvent} />
            </KeyboardAvoidingView>
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    );
  }
  console.log('dt', dt);
  return (
    <View className="flex-1 bg-white">
      <View
        className="px-6 pb-6 pt-16 "
        style={{
          backgroundColor: colors.primary,
        }}>
        <Animated.View className={'flex-row items-center justify-between'}>
          <View>
            <View className="flex-row items-end gap-2">
              <Text
                style={{
                  fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
                }}
                className="text-lg font-semibold text-white">
                Hello
              </Text>
              <Ionicons name="hand-right-outline" size={24} color="white" />
            </View>
            <Text
              style={{
                fontFamily: Platform.OS === 'ios' ? 'BarlowBold' : 'Barlow_700Bold',
              }}
              className="text-lg font-semibold text-white">
              {user?.firstName} {user?.lastName}
            </Text>
          </View>
          <View>
            <Pressable onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={24} color="white" />
            </Pressable>
          </View>
        </Animated.View>

        {/* Search Bar */}
        <Pressable>
          <View className="mt-4 flex-row items-center rounded-2xl bg-white/20 p-4">
            <MaterialCommunityIcons name="magnify" size={24} color="white" />
            <Text
              className="ml-2 text-white"
              style={{
                fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
              }}>
              What event do you want to attend?
            </Text>
          </View>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 gap-4 bg-white"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Animated.View
          className={'gap-6'}
          entering={FadeInDown.duration(500).delay(200).springify()}>
          <View className="flex-row items-center justify-between px-6 pt-4">
            <Text
              style={{
                fontFamily: Platform.OS === 'ios' ? 'BarlowBold' : 'Barlow_700Bold',
              }}
              className="px-6 py-4 text-xl font-normal text-primary">
              Categories
            </Text>
            <Pressable
              className={`flex-row items-center gap-2 rounded-lg ${isMapView ? 'bg-tertiary' : 'bg-primary'} p-2`}
              onPress={() => setIsMapView(!isMapView)}>
              <Text className="text-sm font-semibold text-white">Map View</Text>
              <Ionicons name="globe" size={24} color={colors.white} />
            </Pressable>
          </View>

          {/* categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 pl-4">
            {event_categories.map((category) => (
              <View key={category.id} className="">
                <Pressable
                  onPress={() => setSelectedCategory(category.name)}
                  className="mr-4 flex-col items-center gap-4 rounded-full p-2">
                  <View
                    className={`flex-row items-center rounded-full p-4 ${
                      selectedCategory === category.name
                        ? 'border-2 border-primary'
                        : 'border border-gray-400'
                    } `}>
                    <Ionicons
                      name="checkmark"
                      size={24}
                      color={selectedCategory === category.name ? colors.primary : 'gray'}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? selectedCategory === category.name
                            ? 'BarlowBold'
                            : 'BarlowMedium'
                          : selectedCategory === category.name
                            ? 'Barlow_700Bold'
                            : 'Barlow_500Medium',
                    }}
                    className="text-sm font-semibold text-primary">
                    {category.name}
                  </Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Events */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size={'large'} color={colors.primary} />
          </View>
        ) : error && !isMapView ? (
          <Text>Error: {error.message}</Text>
        ) : !isMapView && dt && dt?.length > 0 ? (
          <FlatList
            data={dt}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => router.push('/details/' + item.id)}>
                <Animated.View
                  entering={FadeInDown.duration(100)
                    .delay(index * 300)
                    .springify()}
                  className={'w-full gap-2 overflow-hidden rounded-2xl border border-gray-200'}>
                  {/* <Image
                    source={{ uri: item.photos[0]?.url }}
                    className="aspect-video  "
                    style={{ width: 200, height: 200 }}
                  /> */}
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
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'column',
              gap: 10,
              // paddingHorizontal: 15,
            }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        ) : isMapView ? (
          <Animated.View
            entering={FadeInDown.duration(300).delay(200).springify()}
            className="items-center justify-center rounded-lg">
            <EventsMap events={dt ? dt : []} />
          </Animated.View>
        ) : (
          <Text>No events found</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        className=" absolute bottom-5 right-5 h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg"
        // style={styles.floatingButton}
        onPress={handleOpenSheet}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
      <BottomSheet
        ref={bottomSheetRef}
        index={open ? 1 : -1}
        snapPoints={[200, '50%', '90%']}
        enablePanDownToClose={true}
        onChange={handleSheetChange}>
        <BottomSheetView style={{ paddingHorizontal: 15 }}>
          <Text className=" text-center text-xl font-semibold text-primary">
            Create A New Event
          </Text>
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
                  data.photos[0]?.url ||
                  'https://img.freepik.com/free-vector/image-upload-concept-landing-page_23-2148309693.jpg?t=st=1722459767~exp=1722463367~hmac=4fc84d96721eb7724ab239d593eca102d7911e42a3eae4255b0cdec45d082fee&w=996'
                }
                placeholder={{ blurhash }}
                contentFit="cover"
                style={{ width: 300, height: 200, aspectRatio: 16 / 9 }}
              />
            </Pressable>
            <Input
              label="Event Title"
              value={data.title}
              onChangeText={(text) =>
                setData({ ...data, title: text, eventCreatedById: user!.id! })
              }
              placeholder="Enter the title of your event"
              // errorMessage={errors.email}
              // onClearError={() => clearError('email')}
            />
            <Input
              label="Event Description"
              value={data.description}
              onChangeText={(text) => setData({ ...data, description: text })}
              placeholder="Enter the details about your event"
              // errorMessage={errors.email}
              // onClearError={() => clearError('email')}
            />
            <Input
              label="Event Category"
              value={data.categories ? data.categories[0] : ''}
              onChangeText={(text) => setData({ ...data, categories: [text] })}
              placeholder="Enter the categories of your event"
              // errorMessage={errors.email}
              // onClearError={() => clearError('email')}
            />

            <Input
              label="Event Price"
              value={Number(data.price).toString()}
              onChangeText={(text) =>
                setData({ ...data, price: !isNaN(parseFloat(text)) ? parseFloat(text) : 0 })
              }
              keyboardType="numeric"
              placeholder="Enter the price of your event"
            />
            <Button title="Submit" className="mt-4" onPress={handleCreateEvent} />
          </KeyboardAvoidingView>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}
