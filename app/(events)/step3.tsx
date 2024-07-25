import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { useEventForm } from '~/hooks/EventFormContext';

const Step3 = () => {
  const { data, setData } = useEventForm();
  const router = useRouter();
  const [photo, setPhoto] = useState('');

  const addPhoto = () => {
    setData({ ...data, photos: [...data.photos, photo] });
    setPhoto('');
  };

  return (
    // <Container>
    <View className="flex-1  p-4">
      <Text className="mb-4 text-lg">Photos</Text>
      <View className=" items-center">
        <Image
          source={{
            uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/1.jpg',
          }}
          className="aspect-[3/4] w-52  rounded-lg"
        />
        <Text className="m-5">Change</Text>
      </View>
      <Button title="Next" onPress={() => router.push('step4')} />
      {/* <TextInput
        placeholder="Photo URL"
        value={photo}
        onChangeText={setPhoto}
        className="mb-4 border p-2"
      />
      <Button title="Add Photo" onPress={addPhoto} />
      <View className="mt-4">
        {data.photos.map((url, index) => (
          <Text key={index} className="mb-2">
            {url}
          </Text>
        ))}
      </View> */}
    </View>
  );
};

export default Step3;
