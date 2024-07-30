import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import Input from '~/components/TextInput';
import { useEventForm } from '~/hooks/EventFormContext';
import { useAuthStore } from '~/store/auth-store';
import { colors } from '~/theme/colors';

const Step1 = () => {
  const { data, setData } = useEventForm();
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    // <LinearGradient style={{ flex: 1 }} colors={[colors.primaryBg, colors.secondary]}>
    <Container>
      <View className="h-full flex-col justify-center gap-4 px-6">
        <View className="mb-4 flex-row items-center justify-center rounded-full  py-4">
          <Image
            source={require('~/assets/images/step-1-hero.png')}
            style={{
              width: 140,
              height: 210,
              alignSelf: 'center',
            }}
          />
        </View>

        <Text className="mb-4 text-2xl font-semibold text-primary">
          Tell us more about your event ...
        </Text>
        <Input
          label="Event Title"
          value={data.title}
          onChangeText={(text) => setData({ ...data, title: text, eventCreatedById: user?.id! })}
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
    // </LinearGradient>
  );
};

export default Step1;
