import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import { Container } from '~/components/Container';
import { useEventForm } from '~/hooks/EventFormContext';

const Step2 = () => {
  const { data, setData } = useEventForm();
  const [markerPosition, setMarkerPosition] = useState({
    latitude: data.location.latitude || -1.301,
    longitude: data.location.longitude || 36.8281,
  });
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
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
    setData((prevData) => ({
      ...prevData,
      location: { latitude, longitude },
    }));
  };
  return (
    <Container>
      <MapView
        style={{
          width: '100%',
          height: '100%',
        }}
        initialRegion={{
          // latitude: -1.301,
          // longitude: 36.8281,
          latitude: markerPosition.latitude,
          longitude: markerPosition.longitude,
          latitudeDelta: data.mapData.latitudeDelta || 0.0475,
          longitudeDelta: data.mapData.longitudeDelta || 0.0245,
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
          title={'Marker'}
        />
      </MapView>
    </Container>
  );
};

export default Step2;
