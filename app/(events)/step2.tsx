import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { useEventForm } from '~/hooks/EventFormContext';
import { View, Text } from 'react-native';

const Step2 = () => {
  const { data, setData } = useEventForm();
  const [markerPosition, setMarkerPosition] = useState({
    latitude: data.location.latitude || -1.301,
    longitude: data.location.longitude || 36.8281,
  });
  const mapRef = useRef<MapView>(null);
  const router = useRouter();

  const onRegionChangeComplete = (region: Region) => {
    setData((prevData) => ({
      ...prevData,
      mapData: {
        latitude: region.latitude,
        longitude: region.longitude,
        longitudeDelta: region.longitudeDelta,
        latitudeDelta: region.latitudeDelta,
      },
    }));
  };

  const onMarkerDragEnd = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
    setData((prevData) => ({
      ...prevData,
      location: { latitude, longitude },
    }));
  };
  const onMapPress = (e: MapPressEvent) => {
    console.log('e', e);

    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
    setData((prevData) => ({
      ...prevData,
      location: { latitude, longitude },
    }));
  };

  const onPlaceSelected = (details: any) => {
    const { lat, lng } = details.geometry.location;
    const newRegion = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.0475,
      longitudeDelta: 0.0245,
    };
    setMarkerPosition({ latitude: lat, longitude: lng });
    setData((prevData) => ({
      ...prevData,
      location: { latitude: lat, longitude: lng, name: details.name },
    }));
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  };
  return (
    <Container>
      <View className="h-full flex-col justify-center gap-4 px-6 pt-14">
        <Text className=" text-xl font-semibold text-primary">
          Tell us where your event is happening...
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
            container: {
              flex: 0,
              zIndex: 1,
              width: '100%',
              position: 'absolute',
              top: 83,
              left: 21,
            },
          }}
        />
        <View style={{ flex: 1 }}>
          <MapView
            ref={mapRef}
            style={{
              width: '100%',
              height: '90%',
            }}
            initialRegion={{
              // latitude: -1.301,
              // longitude: 36.8281,
              latitude: markerPosition.latitude,
              longitude: markerPosition.longitude,
              latitudeDelta: 0.0475,
              longitudeDelta: 0.0245,
            }}
            onMarkerDragEnd={onMarkerDragEnd}
            onPress={onMapPress}
            onRegionChangeComplete={onRegionChangeComplete}
            showsUserLocation={true}
            showsMyLocationButton={true}>
            <Marker
              draggable
              coordinate={markerPosition}
              onDragEnd={onMarkerDragEnd}
              title={data.location.name || 'Marker'}
            />
          </MapView>
          <Button title="Next" onPress={() => router.push('step3')} />
        </View>
      </View>
    </Container>
  );
};

export default Step2;
