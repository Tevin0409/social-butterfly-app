import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useEventForm } from '~/hooks/EventFormContext';

const Step4 = () => {
  const { data } = useEventForm();
  const router = useRouter();

  const handleSubmit = () => {
    // Submit the data
    console.log('Event data:', data);
  };

  return (
    <View className="p-4">
      <Text className="mb-4 text-lg">Review and Submit</Text>
      <Text>Title: {data.title}</Text>
      <Text>Description: {data.description}</Text>
      <Text>Price: {data.price}</Text>
      <Text>Location: {`(${data.location.longitude}, ${data.location.latitude})`}</Text>
      <Text>Map Data: {`(${data.mapData.longitude}, ${data.mapData.latitude})`}</Text>
      <Text>Photos: {data.photos.join(', ')}</Text>
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default Step4;
