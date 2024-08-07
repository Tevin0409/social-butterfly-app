import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { useEventForm } from '~/hooks/EventFormContext';
import { View, Text } from 'react-native';

const EventsMap = ({ events }: { events: SocialEvent[] }) => {
  const [markerPosition, setMarkerPosition] = useState({
    latitude: -1.301,
    longitude: 36.8281,
  });
  const mapRef = useRef<MapView>(null);
  const router = useRouter();

  const onRegionChangeComplete = (region: Region) => {
    console.log('region', region);
  };

  const onMarkerDragEnd = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
  };
  const onMapPress = (e: MapPressEvent) => {
    console.log('e', e);

    const { latitude, longitude } = e.nativeEvent.coordinate;
  };

  const onPlaceSelected = (details: any) => {
    const { lat, lng } = details.geometry.location;
    const newRegion = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.0475,
      longitudeDelta: 0.0245,
    };

    // if (mapRef.current) {
    //   mapRef.current.animateToRegion(newRegion, 1000);
    // }
  };
  return (
    <MapView
      ref={mapRef}
      style={{
        alignSelf: 'center',
        width: '80%',
        height: 400,
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
      {events.map((event) => (
        <Marker
          key={event.id}
          draggable
          coordinate={event.location}
          onDragEnd={onMarkerDragEnd}
          title={event.title || 'Marker'}
        />
      ))}
    </MapView>
  );
};

export default EventsMap;
