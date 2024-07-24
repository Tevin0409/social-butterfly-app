import { View, Text, ScrollView, KeyboardAvoidingView, Pressable } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Input from '~/components/TextInput';
import { AntDesign } from '@expo/vector-icons';
import { Button } from '~/components/Button';
import { useRouter } from 'expo-router';

import { login as loginUser } from '../../actions/user.actions';
import Toast from 'react-native-root-toast';
import { useAuthStore } from '~/store/auth-store';

const Login = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Partial<Record<'email' | 'password', string>>>({});

  const clearError = (field: 'email' | 'password') => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
  };

  const handleLogin = async () => {
    try {
      Toast.show('Logging in...');
      const res = await loginUser(email, password);
      Toast.show(res.message);

      setUser((res as AuthResponse).userInfo, (res as AuthResponse).token);
      router.replace('/home');
    } catch (error) {
      Toast.show('Login Failed');
      console.log('error', error);

      const errorResponse = error as ErrorResponse;
      if (errorResponse.errors) {
        // Parse and set error messages
        const issues = errorResponse.errors.issues;
        const newErrors: Partial<Record<'email' | 'password', string>> = {};
        issues.forEach((issue) => {
          const field = issue.path[0] as 'email' | 'password';
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
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="inverted" />
      <View className="my-1">
        <Pressable onPress={() => router.push('/')}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
        <Text className="mx-2 text-xl font-bold">Login</Text>
      </View>
      <View className="mx-2  flex-col  ">
        <KeyboardAvoidingView behavior={'position'} className=" items-center justify-center  px-2">
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
          <View className="my-2 py-2">
            <Button title="Login" onPress={handleLogin} />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default Login;
