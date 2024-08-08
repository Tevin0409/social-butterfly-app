import { View, Text, TextInput, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { colors } from '~/theme/colors';
import Animated from 'react-native-reanimated';
import { useAuthStore } from '~/store/auth-store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '~/components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const Profile = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.email);
  const [address, setAddress] = useState(user?.address);
  const [county, setCounty] = useState(user?.county);
  const [identificationNumber, setIdentificationNumber] = useState(user?.identificationNumber);
  const [postalCode, setPostalCode] = useState(user?.postalCode);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.push('/');
  };
  return (
    <View className="h-full flex-1 ">
      <View
        className="px-6 pb-6 pt-16 "
        style={{
          backgroundColor: colors.primary,
        }}>
        <Animated.View className={'flex-row items-center justify-between'}>
          <View>
            {/* <View className="flex-row items-end gap-2">
              <Text
                style={{
                  fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
                }}
                className="text-lg font-semibold text-white">
                Hello
              </Text>
              <Ionicons name="hand-right-outline" size={24} color="white" />
            </View> */}
            <Text
              style={{
                fontFamily: Platform.OS === 'ios' ? 'BarlowBold' : 'Barlow_700Bold',
              }}
              className="text-lg font-semibold text-white">
              Edit Profile
            </Text>
          </View>
        </Animated.View>

        {/* Search Bar */}
      </View>
      <KeyboardAwareScrollView
        style={{
          paddingHorizontal: 15,
        }}>
        <View
          style={{
            flexDirection: 'column',
            marginBottom: 6,
          }}>
          <Text
            style={{
              fontFamily: Platform.OS === 'ios' ? 'BarlowBold' : 'Barlow_700Bold',
              fontSize: 16,
              color: colors.primary,
            }}>
            First Name
          </Text>
          <View
            style={{
              height: 44,
              width: '100%',
              borderRadius: 12,
              borderColor: colors.primary,
              borderWidth: 1,
              backgroundColor: colors.white,
              marginVertical: 6,
              justifyContent: 'center',
              paddingLeft: 8,
            }}>
            <TextInput
              value={firstName}
              editable={false}
              style={{
                fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
                fontSize: 16,
                color: colors.primary,
              }}
              placeholder="Enter your name"
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            marginBottom: 6,
          }}>
          <Text
            style={{
              fontFamily: Platform.OS === 'ios' ? 'BarlowBold' : 'Barlow_700Bold',
              fontSize: 16,
              color: colors.primary,
            }}>
            Last Name
          </Text>
          <View
            style={{
              height: 44,
              width: '100%',
              borderRadius: 12,
              borderColor: colors.primary,
              borderWidth: 1,
              backgroundColor: colors.white,
              marginVertical: 6,
              justifyContent: 'center',
              paddingLeft: 8,
            }}>
            <TextInput
              value={lastName}
              editable={false}
              style={{
                fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
                fontSize: 16,
                color: colors.primary,
              }}
              placeholder="Enter your Last Name"
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            marginBottom: 6,
          }}>
          <Text
            style={{
              fontFamily: Platform.OS === 'ios' ? 'BarlowBold' : 'Barlow_700Bold',
              fontSize: 16,
              color: colors.primary,
            }}>
            Email
          </Text>
          <View
            style={{
              height: 44,
              width: '100%',
              borderRadius: 12,
              borderColor: colors.primary,
              borderWidth: 1,
              backgroundColor: colors.white,
              marginVertical: 6,
              justifyContent: 'center',
              paddingLeft: 8,
            }}>
            <TextInput
              value={email}
              editable={false}
              keyboardType="email-address"
              style={{
                fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
                fontSize: 16,
                color: colors.primary,
              }}
              placeholder="Enter your name"
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'column',
            marginBottom: 6,
          }}>
          <Text
            style={{
              fontFamily: Platform.OS === 'ios' ? 'BarlowBold' : 'Barlow_700Bold',
              fontSize: 16,
              color: colors.primary,
            }}>
            ID Number
          </Text>
          <View
            style={{
              height: 44,
              width: '100%',
              borderRadius: 12,
              borderColor: colors.primary,
              borderWidth: 1,
              backgroundColor: colors.white,
              marginVertical: 6,
              justifyContent: 'center',
              paddingLeft: 8,
            }}>
            <TextInput
              value={identificationNumber}
              editable={false}
              style={{
                fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
                fontSize: 16,
                color: colors.primary,
              }}
              placeholder="Enter your password"
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            marginBottom: 6,
          }}>
          <Text
            style={{
              fontFamily: Platform.OS === 'ios' ? 'BarlowBold' : 'Barlow_700Bold',
              fontSize: 16,
              color: colors.primary,
            }}>
            Address
          </Text>
          <View
            style={{
              height: 44,
              width: '100%',
              borderRadius: 12,
              borderColor: colors.primary,
              borderWidth: 1,
              backgroundColor: colors.white,
              marginVertical: 6,
              justifyContent: 'center',
              paddingLeft: 8,
            }}>
            <TextInput
              value={address}
              editable={false}
              style={{
                fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
                fontSize: 16,
                color: colors.primary,
              }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            marginBottom: 6,
          }}>
          <Text
            style={{
              fontFamily: Platform.OS === 'ios' ? 'BarlowBold' : 'Barlow_700Bold',
              fontSize: 16,
              color: colors.primary,
            }}>
            Postal Code
          </Text>
          <View
            style={{
              height: 44,
              width: '100%',
              borderRadius: 12,
              borderColor: colors.primary,
              borderWidth: 1,
              backgroundColor: colors.white,
              marginVertical: 6,
              justifyContent: 'center',
              paddingLeft: 8,
            }}>
            <TextInput
              value={postalCode}
              editable={false}
              style={{
                fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
                fontSize: 16,
                color: colors.primary,
              }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            marginBottom: 6,
          }}>
          <Text
            style={{
              fontFamily: Platform.OS === 'ios' ? 'BarlowBold' : 'Barlow_700Bold',
              fontSize: 16,
              color: colors.primary,
            }}>
            County
          </Text>
          <View
            style={{
              height: 44,
              width: '100%',
              borderRadius: 12,
              borderColor: colors.primary,
              borderWidth: 1,
              backgroundColor: colors.white,
              marginVertical: 6,
              justifyContent: 'center',
              paddingLeft: 8,
            }}>
            <TextInput
              value={county}
              editable={false}
              style={{
                fontFamily: Platform.OS === 'ios' ? 'BarlowMedium' : 'Barlow_500Medium',
                fontSize: 16,
                color: colors.primary,
              }}
            />
          </View>
        </View>

        <View
          style={{
            width: '100%',
            justifyContent: 'center',
          }}>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Profile;
