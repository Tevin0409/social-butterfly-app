import { View, Text, Image, Pressable, Button, Alert, Platform, SafeAreaView } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '~/theme/colors';
import { Button as Btn } from '~/components/Button';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

const Welcome = () => {
  const router = useRouter();
  return (
    <LinearGradient style={{ flex: 1 }} colors={[colors.primaryBg, colors.secondary]}>
      <SafeAreaView
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
        <Animated.View className={' w-full'} entering={FadeInDown.duration(300).springify()}>
          <Image
            source={require('../assets/images/hero3.png')}
            style={{
              width: 129,
              height: 150,
              borderRadius: 20,
              position: 'absolute',
              top: 10,
              transform: [{ translateX: 20 }, { translateY: 50 }, { rotate: '-15deg' }],
            }}
          />
          <Image
            source={require('../assets/images/hero5.png')}
            style={{
              width: 140,
              height: 150,
              borderRadius: 20,
              position: 'absolute',
              top: -20,
              left: 120,
              transform: [{ translateX: 50 }, { translateY: 50 }, { rotate: '-5deg' }],
            }}
          />
          <Image
            source={require('../assets/images/hero1.png')}
            style={{
              width: 135,
              height: 150,
              borderRadius: 20,
              position: 'absolute',
              top: 170,
              left: -10,
              transform: [{ translateX: 50 }, { translateY: 50 }, { rotate: '15deg' }],
            }}
          />
          <Image
            source={require('../assets/images/hero2.png')}
            style={{
              width: 230,
              height: 250,
              borderRadius: 20,
              position: 'absolute',
              top: 150,
              left: 100,
              transform: [{ translateX: 50 }, { translateY: 50 }, { rotate: '2deg' }],
            }}
          />
        </Animated.View>
        <Animated.View
          className={'absolute top-[520px] w-full'}
          entering={FadeInDown.duration(300).delay(200).springify()}>
          <Text
            className={'text-center text-5xl font-bold leading-[3.5rem] text-primary'}
            style={{
              fontFamily: Platform.OS === 'ios' ? 'BarlowExtraBold' : 'Barlow_800ExtraBold',
              // fontSize: 50,
              // fontWeight: 800,
              color: colors.primary,
            }}>
            Let's get started
          </Text>
        </Animated.View>
        <Animated.View
          className={'absolute top-[560px] w-full py-5'}
          entering={FadeInDown.duration(300).delay(400).springify()}>
          <Text
            className={'text-center text-xl leading-[2rem] text-primary'}
            style={{
              fontFamily: Platform.OS === 'ios' ? 'BarlowSemiBold' : 'Barlow_600SemiBold',
              // fontSize: 50,
              // fontWeight: 800,
              color: colors.primary,
            }}>
            Connect with your friends and family
          </Text>
        </Animated.View>
        <Animated.View
          className={'absolute top-[620px] w-full px-6 py-5'}
          entering={FadeInDown.duration(300).delay(600).springify()}>
          <Btn title="Join Now" onPress={() => router.replace('/(authenticate)/registration')} />
        </Animated.View>
        <Animated.View
          className={'absolute top-[700px] w-full flex-row justify-center py-5'}
          entering={FadeInDown.duration(300).delay(400).springify()}>
          <Text
            style={{
              fontSize: 16,
              color: colors.primary,
            }}>
            Already have an account?
          </Text>
          <Pressable onPress={() => router.replace('/(authenticate)/login')}>
            <Text
              style={{
                fontSize: 16,
                color: colors.primary,
                fontWeight: 'bold',
              }}>
              Login
            </Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Welcome;
