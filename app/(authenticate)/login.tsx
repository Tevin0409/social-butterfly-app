import { View, Pressable, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Input from '~/components/TextInput';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Button } from '~/components/Button';
import { useRouter } from 'expo-router';

import { login as loginUser } from '../../actions/user.actions';
import Toast from 'react-native-root-toast';
import { useAuthStore } from '~/store/auth-store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '~/theme/colors';

const Login = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<'email' | 'password', string>>>({});

  const clearError = (field: 'email' | 'password') => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
  };

  const handleLogin = async () => {
    try {
      Toast.show('Logging in...');
      const res = await loginUser(email, password);
      Toast.show(res.message);
      console.log('login res', res);

      setUser((res as AuthResponse).userInfo, (res as AuthResponse).token);
      router.replace('/(tabs)');
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
    <SafeAreaView
      style={{
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
      <StatusBar style="auto" />
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        style={{
          width: '100%',
        }}>
        <View className="w-full py-4">
          <Image
            source={require('~/assets/images/signin-hero.png')}
            style={{
              width: 240,
              height: 264,
              alignSelf: 'center',
            }}
          />
        </View>

        <View className="mx-2  w-full flex-col px-4  ">
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
            secureTextEntry={showPassword}
            placeholder="Enter your password"
            errorMessage={errors.password}
            onClearError={() => clearError('password')}
            right={() => (
              <View className="items-center justify-center p-5">
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <FontAwesome name="eye-slash" size={20} color={colors.primary} />
                  ) : (
                    <AntDesign name="eye" size={20} color={colors.primary} />
                  )}
                </Pressable>
              </View>
            )}
          />
          <View className="my-2 py-2">
            <Button title="Login" onPress={handleLogin} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Login;
