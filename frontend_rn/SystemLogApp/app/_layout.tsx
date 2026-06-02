import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const enforceAuthGuard = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const profileStr = await AsyncStorage.getItem('user_profile');
        const inAuthGroup = segments[0] === '(auth)';

        if (!token) {

          if (!inAuthGroup) router.replace('/(auth)/login');
        } else if (profileStr) {

          const profile = JSON.parse(profileStr);
          if (profile.IsAdmin && segments[0] !== 'admin') {
            router.replace('/admin');
            
          } else if (!profile.IsAdmin && segments[0] !== '(employee)') {
            router.replace('/(employee)');
          }
        }
      } catch (e) {
        console.error("Routing error", e);
      } finally {
        setIsReady(true);
      }
    };

    enforceAuthGuard();
  }, [segments]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#251054" />
      </View>
    );
  }

  return <Slot />;
}