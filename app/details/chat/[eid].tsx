import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  Platform,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '~/store/auth-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '~/components/Button';
import io from 'socket.io-client';
import { colors } from '~/theme/colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-root-toast';

const Chat = () => {
  const { eid } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const { token, user } = useAuthStore();
  const router = useRouter();
  const [textMessage, setTextMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const SOCKET_URL =
    process.env.EXPO_PUBLIC_SOCKET_URL || 'https://final-socialbutterfly-backend.onrender.com';
  const socket = io(SOCKET_URL, {
    auth: {
      token: token!,
    },
  });
  const handleSendMessage = async () => {
    try {
      socket.emit('joinRoom', { eid });
      if (textMessage.length > 0) {
        socket.emit('chatMessage', {
          message: textMessage,
          eventId: eid as string,
        });
        socket.on('message', (newMessage) => {
          console.log('newMessage', newMessage);
          if (newMessage.user.id === user?.id) {
            setTextMessage('');
          }
        });
      } else {
        Toast.show('Please enter a message');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    // Join the chat room
    socket.emit('joinRoom', { eid });
    // Listen for new messages
    socket.on('message', (newMessage) => {
      console.log('newMessage', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    socket.on('messages', (messages) => {
      console.log('Message', messages);
      setMessages(messages);
    });

    socket.on('error', (error) => {
      console.log('error', error);
      Toast.show(error);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [eid]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor: '#fff',
      }}>
      <StatusBar barStyle={'default'} />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 16,
          backgroundColor: colors.white,
          borderBottomColor: colors.primary,
          borderBottomWidth: 0.3,
          zIndex: 100,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Pressable
            style={{
              marginHorizontal: 12,
            }}
            onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.primary} />
          </Pressable>
          <View
            style={{
              marginLeft: 12,
            }}>
            <Text
              style={{
                fontFamily: Platform.OS === 'ios' ? 'Barlow-SemiBold' : 'Barlow_600SemiBold',
                fontSize: 18,
                color: colors.primary,
                textAlign: 'center',
              }}>
              Event Messages
            </Text>
          </View>
        </View>
        {/* <View>
logout
        </View> */}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={{ paddingBottom: 30, backgroundColor: colors.white }}>
          {messages.map((item, index) => (
            <View
              key={index}
              style={[
                item.user.email === user?.email
                  ? {
                      alignSelf: 'flex-end',
                      backgroundColor: colors.primary,
                      padding: 8,
                      maxWidth: '60%',
                      borderRadius: 8,
                      margin: 10,
                    }
                  : {
                      alignSelf: 'flex-start',
                      backgroundColor: colors.primaryColorGrey,
                      padding: 8,
                      maxWidth: '60%',
                      borderRadius: 8,
                      margin: 10,
                    },
              ]}>
              <Text
                style={[
                  item.user.email === user?.email
                    ? {
                        color: 'white',
                        fontSize: 10,
                        textAlign: 'right',
                        fontFamily:
                          Platform.OS === 'ios' ? 'Barlow-SemiBold' : 'Barlow_600SemiBold',
                      }
                    : {
                        color: 'black',
                        fontSize: 10,
                        textAlign: 'left',
                        fontFamily:
                          Platform.OS === 'ios' ? 'Barlow-SemiBold' : 'Barlow_600SemiBold',
                      },
                ]}>
                {item.user.firstName} {item.user.lastName}
              </Text>
              <Text
                style={[
                  item.user.email === user?.email
                    ? {
                        color: 'white',
                        fontSize: 16,
                        textAlign: 'right',
                        fontFamily:
                          Platform.OS === 'ios' ? 'Barlow-SemiBold' : 'Barlow_600SemiBold',
                      }
                    : {
                        color: 'black',
                        fontSize: 16,
                        textAlign: 'left',
                        fontFamily:
                          Platform.OS === 'ios' ? 'Barlow-SemiBold' : 'Barlow_600SemiBold',
                      },
                ]}>
                {item.content}
              </Text>
              <Text
                style={[
                  item.user.email === user?.email
                    ? {
                        color: 'white',
                        fontSize: 10,
                        textAlign: 'right',
                        fontFamily:
                          Platform.OS === 'ios' ? 'Barlow-SemiBold' : 'Barlow_600SemiBold',
                      }
                    : {
                        color: 'black',
                        fontSize: 10,
                        textAlign: 'right',
                        fontFamily:
                          Platform.OS === 'ios' ? 'Barlow-SemiBold' : 'Barlow_600SemiBold',
                      },
                ]}>
                {formatTime(item.createdAt)}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputMessageContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message"
              placeholderTextColor={colors.primary}
              onChangeText={(text) => setTextMessage(text)}
              value={textMessage}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Pressable style={styles.sendButton} onPress={handleSendMessage}>
                <Ionicons name="paper-plane-outline" size={24} color={colors.primary} />
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    // <View style={{ flex: 1, justifyContent: 'center' }}>
    //   <Text>Chat</Text>
    //   <Button title="Send" onPress={handleSendMessage} />
    // </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#fff',
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputMessageContainer: {
    height: 54,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 16,
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  input: {
    color: '#000',
    fontFamily: Platform.OS === 'ios' ? 'BarlowRegular' : 'Barlow_400Regular',
    paddingHorizontal: 10,
    flex: 1,
  },
  sendButton: {
    backgroundColor: '#f1f1f1',
    padding: 4,
    paddingHorizontal: 6,
    borderRadius: 999,
  },
});

export default Chat;
