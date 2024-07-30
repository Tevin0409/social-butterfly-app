import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Platform, Image, Pressable, ScrollView } from 'react-native';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { useEventForm } from '~/hooks/EventFormContext';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-root-toast';
import MasonryList from '~/components/MasonryList';

import { Cloudinary } from '@cloudinary/url-gen';
import { upload } from 'cloudinary-react-native';
const Step3 = () => {
  const { data, setData } = useEventForm();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);

  // useEffect(() => {
  //   if (!image) {
  //     pickImage();
  //   }
  // }, [image]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result.assets);

    if (!result.canceled && result.assets.length > 0) {
      for (let asset of result.assets) {
        await uploadImage(asset.uri);
      }
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
            ...prevData.photos,
            {
              url: response.url,
              name: response.asset_id,
            },
          ],
        }));
      },
    });
  };

  const renderImage = ({ item }: { item: { url: string; name: string } }) => (
    <View style={{ padding: 4 }}>
      <Image
        source={{ uri: item.url }}
        style={{
          width: '100%',
          aspectRatio: 4 / 3,
          borderRadius: 8,
        }}
      />
    </View>
  );
  return (
    // <Container>
    <Container>
      <View className={`h-full flex-col justify-between gap-4 px-6 pb-3 pt-14`}>
        <View className=" flex-row rounded-full  py-2">
          <Text className="text-2xl font-semibold text-primary">
            Please upload an image as your event theme ...
          </Text>
        </View>

        <View className=" flex-1 items-center">
          {data.photos.length === 0 ? (
            <Image
              source={{
                uri: image || 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/1.jpg',
              }}
              className=" aspect-[3/4]   rounded-lg"
              style={{
                width: 400,
                height: 450,
                alignSelf: 'center',
              }}
            />
          ) : (
            <View style={{ flex: 1 }}>
              <MasonryList data={data.photos} numColumns={2} renderItem={renderImage} />
            </View>
          )}
          <Pressable onPress={pickImage}>
            <Text className="m-5 text-xl font-semibold text-primary">Change</Text>
          </Pressable>
        </View>
        <View>
          <Button title="Next" onPress={() => router.push('step4')} />
        </View>
      </View>
    </Container>
  );
};

export default Step3;
