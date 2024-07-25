import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Container } from '~/components/Container';
import { useEventForm } from '~/hooks/EventFormContext';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import * as Location from 'expo-location';
const Step2 = () => {
  const { data, setData } = useEventForm();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <Container>
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data);
        }}
        query={{
          key: 'AIzaSyDu1dCOYnqv0rYLW23fxYwyuupnMxvga-M',
          language: 'en',
        }}
      />
      <MapView
        initialRegion={{
          latitude: 36.87654651534659,
          longitude: -1.2353674995088915,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={{ height: '80%', width: '100%' }}>
        <Marker
          onDragEnd={(e) => {
            console.log('dragged', e);
          }}
          coordinate={{
            latitude: location ? location.coords.latitude : 37.78825,
            longitude: location ? location.coords.longitude : -122.4324,
          }}
        />
      </MapView>
    </Container>
    // <View className="p-4">
    //   <Text className="mb-4 text-lg">Location</Text>
    //   <TextInput
    //     placeholder="Longitude"
    //     value={data.location.longitude.toString()}
    //     onChangeText={(text) =>
    //       setData({ ...data, location: { ...data.location, longitude: parseFloat(text) } })
    //     }
    //     keyboardType="numeric"
    //     className="mb-4 border p-2"
    //   />
    //   <TextInput
    //     placeholder="Latitude"
    //     value={data.location.latitude.toString()}
    //     onChangeText={(text) =>
    //       setData({ ...data, location: { ...data.location, latitude: parseFloat(text) } })
    //     }
    //     keyboardType="numeric"
    //     className="mb-4 border p-2"
    //   />
    //   <TextInput
    //     placeholder="Map Longitude"
    //     value={data.mapData.longitude.toString()}
    //     onChangeText={(text) =>
    //       setData({ ...data, mapData: { ...data.mapData, longitude: parseFloat(text) } })
    //     }
    //     keyboardType="numeric"
    //     className="mb-4 border p-2"
    //   />
    //   <TextInput
    //     placeholder="Map Latitude"
    //     value={data.mapData.latitude.toString()}
    //     onChangeText={(text) =>
    //       setData({ ...data, mapData: { ...data.mapData, latitude: parseFloat(text) } })
    //     }
    //     keyboardType="numeric"
    //     className="mb-4 border p-2"
    //   />
    //   <Button title="Next" onPress={() => router.push('step3')} />
    // </View>
  );
};

export default Step2;
