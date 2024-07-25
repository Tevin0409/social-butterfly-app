import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import Input from '~/components/TextInput';
import { useEventForm } from '~/hooks/EventFormContext';

const Step1 = () => {
  const { data, setData } = useEventForm();
  const router = useRouter();

  return (
    <Container>
      {/* TODO: Add a picture */}
      <View className="h-full flex-col justify-center gap-4 px-6">
        <Text className="mb-4 text-lg">Tell us more about your event</Text>
        <Input
          label="Event Title"
          value={data.title}
          onChangeText={(text) => setData({ ...data, title: text })}
          placeholder="Enter the title of your event"
          // errorMessage={errors.email}
          // onClearError={() => clearError('email')}
        />
        <Input
          label="Event Description"
          value={data.description}
          onChangeText={(text) => setData({ ...data, description: text })}
          placeholder="Enter the details about your event"
          // errorMessage={errors.email}
          // onClearError={() => clearError('email')}
        />

        <Input
          label="Event Price"
          value={Number(data.price).toString()}
          onChangeText={(text) =>
            setData({ ...data, price: !isNaN(parseFloat(text)) ? parseFloat(text) : 0 })
          }
          keyboardType="numeric"
          placeholder="Enter the price of your event"
        />

        <Button title="Next" onPress={() => router.push('step2')} />
      </View>
    </Container>
  );
};

export default Step1;
