import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
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
    <View className="p-4">
      <Text className="mb-4 text-lg">Photos</Text>
      <TextInput
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
      </View>
      <Button title="Next" onPress={() => router.push('step4')} />
    </View>
  );
};

export default Step3;
