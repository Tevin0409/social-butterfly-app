import { View, Text, Image, Pressable, Button, Alert } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '~/theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button as Btn } from '~/components/Button';
import { Link, useRouter } from 'expo-router';
import { styles } from '../components/HeaderButton';

const Welcome = () => {
  const router = useRouter();
  return (
    <LinearGradient style={{ flex: 1 }} colors={[colors.primaryBg, colors.secondary]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View>
            <Image
              source={require('../assets/images/hero3.png')}
              style={{
                width: 122,
                height: 130,
                borderRadius: 20,
                position: 'absolute',
                top: 10,
                transform: [{ translateX: 20 }, { translateY: 50 }, { rotate: '-15deg' }],
              }}
            />
            <Image
              source={require('../assets/images/hero5.png')}
              style={{
                width: 122,
                height: 130,
                borderRadius: 20,
                position: 'absolute',
                top: -20,
                left: 100,
                transform: [{ translateX: 50 }, { translateY: 50 }, { rotate: '-5deg' }],
              }}
            />
            <Image
              source={require('../assets/images/hero1.png')}
              style={{
                width: 122,
                height: 130,
                borderRadius: 20,
                position: 'absolute',
                top: 150,
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
                top: 110,
                left: 100,
                transform: [{ translateX: 50 }, { translateY: 50 }, { rotate: '2deg' }],
              }}
            />
          </View>
          <View
            style={{
              paddingHorizontal: 22,
              position: 'absolute',
              top: 430,
              width: '100%',
            }}>
            <Text
              style={{
                fontSize: 50,
                fontWeight: 800,
                color: colors.primary,
              }}>
              Let's get
            </Text>
            <Text
              style={{
                fontSize: 46,
                fontWeight: 800,
                color: colors.primary,
              }}>
              Started
            </Text>
            <View style={{ marginVertical: 22 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.primary,
                  marginVertical: 4,
                }}>
                Connect with your friends and family
              </Text>
            </View>
            <Btn title="Join Now" onPress={() => router.replace('(authenticate)/registration')} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 12,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.primary,
                }}>
                Already have an account?
              </Text>
              <Pressable onPress={() => router.replace('(authenticate)/login')}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.primary,
                    fontWeight: 'bold',
                  }}>
                  Login
                </Text>
              </Pressable>
            </View>
            {/* <Button title="Press me" onPress={() => router.replace('(authenticate)/login')} /> */}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Welcome;
