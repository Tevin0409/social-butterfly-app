import BottomSheet, { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { createEvent } from '~/actions/event.actions';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { useEventForm } from '~/hooks/EventFormContext';
import { useAuthStore } from '~/store/auth-store';

const Step4 = () => {
  const { data } = useEventForm();
  const { token } = useAuthStore();
  const router = useRouter();
  const { width, height } = Dimensions.get('window');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const image_size = 80;
  const handleSubmit = () => {
    // Submit the data
    console.log('Event data:', data);
    console.log('token', token);
  };

  const handleCreateEvent = async () => {
    try {
      Toast.show('Creating Event...');
      const res = await createEvent(data, token!);
      console.log('res', res);
      // Toast.show(res.message);

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

  const topRef = useRef<FlatList>();
  const thumbRef = useRef<FlatList>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollToActiveIndex = (index: number) => {
    setActiveIndex(index);
    topRef?.current?.scrollToOffset({ offset: index * width, animated: true });
    // scrollFlatList
    if (index * (image_size + 10) - image_size / 2 > (width - 15) / 2) {
      thumbRef?.current?.scrollToOffset({
        offset: index * (image_size + 10) - (width - 15) / 2 + image_size / 2,
        animated: true,
      });
    }
  };

  return (
    // <Container>
    //   <ScrollView
    //     className={`h-full flex-col  gap-4 px-6 pb-3 pt-14`}
    //     contentContainerStyle={{
    //       justifyContent: 'space-between',
    //     }}>
    <Container>
      {/* <ScrollView
        contentContainerStyle={{
          justifyContent: 'space-between',
        }}
        className={`h-full flex-col   gap-4  pb-3 pt-14`}> */}
      <View className=" h-full flex-col    gap-4 pt-14">
        <FlatList
          ref={topRef as any}
          data={data.photos}
          keyExtractor={(item) => item.url}
          horizontal
          pagingEnabled={true}
          onMomentumScrollEnd={(ev) => {
            scrollToActiveIndex(Math.floor(ev.nativeEvent.contentOffset.x / width));
          }}
          contentContainerStyle={{
            margin: 2,
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={{
                width: width,
                height: height / 1.5,
              }}>
              <Image source={{ uri: item.url }} style={[StyleSheet.absoluteFillObject]} />
            </View>
          )}
        />
        <FlatList
          ref={thumbRef as any}
          data={data.photos}
          keyExtractor={(item) => item.url}
          horizontal
          style={{
            position: 'absolute',
            bottom: image_size + 85,
          }}
          contentContainerStyle={{
            paddingHorizontal: 10,
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Pressable onPress={() => scrollToActiveIndex(index)}>
              <Image
                source={{ uri: item.url }}
                style={{
                  width: image_size,
                  height: image_size,
                  borderRadius: 12,
                  marginRight: 10,
                  borderWidth: 2,
                  borderColor: index === activeIndex ? '#FFFFFF' : 'transparent',
                }}
              />
            </Pressable>
          )}
        />
        {/* <Image
            source={{
              uri: data.photos[0].url || require('~/assets/images/step-1-hero.png'),
            }}
            style={{
              width: 140,
              height: 210,
              alignSelf: 'center',
            }}
          /> */}
      </View>

      {/* </ScrollView> */}
      <BottomSheet ref={bottomSheetRef} index={1} snapPoints={[200, '50%', '80%']}>
        <BottomSheetView style={styles.contentContainer}>
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
            <Text className="mb-4 text-xl font-semibold text-primary">
              {data.title.length > 0 ? data.title : 'Title'}
            </Text>
            <Text className="mb-4 text-xl font-semibold text-primary">Description</Text>
            <Text>{data.description}</Text>
            <Text className="mb-4 text-xl font-semibold text-primary">Price</Text>
            <Text> {data.price}</Text>
            <Text className="mb-4 text-xl font-semibold text-primary">
              Location: {`${data.location.name}`}
            </Text>
            <Button title="Submit" onPress={handleCreateEvent} />
          </BottomSheetView>
        </BottomSheetView>
      </BottomSheet>
    </Container>

    //   </ScrollView>
    // </Container>
  );
};
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    marginTop: 8,
    width: '100%',
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
  },
});
export default Step4;
