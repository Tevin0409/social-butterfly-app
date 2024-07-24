import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  loadUserFromAsyncStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        login: (user, token) => {
          set({ user, token });
        },
        logout: () => {
          set({ user: null, token: null });
        },
        loadUserFromAsyncStorage: async () => {
          try {
            const storedState = await AsyncStorage.getItem('auth-storage');
            if (storedState) {
              const parsedState = JSON.parse(storedState);
              set(parsedState.state);
            }
          } catch (error) {
            console.error('Failed to load user from async storage:', error);
          }
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => AsyncStorage),
      }
    ),
    { name: 'auth', store: 'auth' }
  )
);
