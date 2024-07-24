import { View, Text, ScrollView, KeyboardAvoidingView, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Input from '~/components/TextInput';
import { AntDesign } from '@expo/vector-icons';
import { Button } from '~/components/Button';
import { useRouter } from 'expo-router';

import { signup as signupUser } from '../../actions/user.actions';
import Toast from 'react-native-root-toast';
import { useAuthStore } from '~/store/auth-store';

const Register = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [county, setCounty] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});

  const clearError = (field: keyof User) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
  };
  const handleSignup = async () => {
    try {
      const user = {
        email,
        firstName,
        lastName,
        address,
        county,
        postalCode,
        identificationNumber,
      };
      Toast.show('Registering...');
      const res = await signupUser(user, password);
      Toast.show(res.message);

      setUser((res as AuthResponse).userInfo, (res as AuthResponse).token);
      router.replace('/home');
      // Parse and set error messages

      //    setUser(userInfo, token);
      //   router.replace('/home');
    } catch (error) {
      Toast.show('Registration Failed');
      console.log('error', error);

      const errorResponse = error as ErrorResponse;
      if (errorResponse.errors) {
        // Parse and set error messages
        const issues = errorResponse.errors.issues;
        const newErrors: Partial<Record<keyof User, string>> = {};
        issues.forEach((issue) => {
          const field = issue.path[0] as keyof User;
          newErrors[field] = issue.message;
        });
        setErrors(newErrors);
      } else {
        if ((error as ErrorResponse).errorCode) {
          Toast.show((error as ErrorResponse).message);
        } else {
          Toast.show('Something went wrong');
        }
      }
      //    Alert.alert('Registration Failed');
    }
  };

  return (
    <SafeAreaView className=" flex-1 ">
      <StatusBar style="inverted" />
      <View className="my-1 ">
        <Pressable onPress={() => router.push('/')}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
        <Text className=" mx-2 text-xl font-bold">Create Account</Text>
      </View>
      <ScrollView className=" mx-2  " contentContainerStyle={{ paddingBottom: 10 }}>
        <KeyboardAvoidingView behavior={'padding'} className="px-2">
          <Input
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your First Name"
            errorMessage={errors.firstName}
            onClearError={() => clearError('firstName')}
          />
          <Input
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your Last Name"
            errorMessage={errors.lastName}
            onClearError={() => clearError('lastName')}
          />
          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email address"
            errorMessage={errors.email}
            onClearError={() => clearError('email')}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter your password"
            errorMessage={errors.password}
            onClearError={() => clearError('password')}
          />
          <Input
            label="Address"
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your Postal address"
            errorMessage={errors.address}
            onClearError={() => clearError('address')}
          />
          <Input
            label="County"
            value={county}
            onChangeText={setCounty}
            placeholder="Enter your County"
            errorMessage={errors.county}
            onClearError={() => clearError('county')}
          />
          <Input
            label="Postal Code"
            value={postalCode}
            onChangeText={setPostalCode}
            placeholder="Enter your postal code"
            errorMessage={errors.postalCode}
            onClearError={() => clearError('postalCode')}
          />
          <Input
            label="Identification Number"
            placeholder="Enter your identification number"
            value={identificationNumber}
            onChangeText={setIdentificationNumber}
            errorMessage={errors.identificationNumber}
            onClearError={() => clearError('identificationNumber')}
          />
          <View className="my-2 py-2">
            <Button title="Register" onPress={handleSignup} />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
