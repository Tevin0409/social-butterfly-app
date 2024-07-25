import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Container } from '~/components/Container';
import { useEventForm } from '~/hooks/EventFormContext';

const Step2 = () => {
  const { data, setData } = useEventForm();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <View className="p-4">
      <Text className="mb-4 text-lg">Location</Text>
      <TextInput
        placeholder="Longitude"
        value={data.location.longitude.toString()}
        onChangeText={(text) =>
          setData({ ...data, location: { ...data.location, longitude: parseFloat(text) } })
        }
        keyboardType="numeric"
        className="mb-4 border p-2"
      />
      <TextInput
        placeholder="Latitude"
        value={data.location.latitude.toString()}
        onChangeText={(text) =>
          setData({ ...data, location: { ...data.location, latitude: parseFloat(text) } })
        }
        keyboardType="numeric"
        className="mb-4 border p-2"
      />
      <TextInput
        placeholder="Map Longitude"
        value={data.mapData.longitude.toString()}
        onChangeText={(text) =>
          setData({ ...data, mapData: { ...data.mapData, longitude: parseFloat(text) } })
        }
        keyboardType="numeric"
        className="mb-4 border p-2"
      />
      <TextInput
        placeholder="Map Latitude"
        value={data.mapData.latitude.toString()}
        onChangeText={(text) =>
          setData({ ...data, mapData: { ...data.mapData, latitude: parseFloat(text) } })
        }
        keyboardType="numeric"
        className="mb-4 border p-2"
      />
      <Button title="Next" onPress={() => router.push('step3')} />
    </View>
  );
};

export default Step2;
