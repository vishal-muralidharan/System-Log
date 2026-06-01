import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../src/api/axios';

export default function LoginScreen() {
  const router = useRouter();
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!empId || !password) return Alert.alert('Error', 'Complete all inputs.');
    setLoading(true);
    
    try {
      const loginRes = await axiosInstance.post('auth/login/', { EmployeeId: empId.trim(), password });
      await AsyncStorage.setItem('access_token', loginRes.data.access);
      await AsyncStorage.setItem('refresh_token', loginRes.data.refresh);

      const profileRes = await axiosInstance.get('employees/');
      const userProfile = profileRes.data[0];

      if (userProfile && userProfile.IsActive) {
        await AsyncStorage.setItem('user_profile', JSON.stringify(userProfile));
        // Direct Routing based on profile
        if (userProfile.IsAdmin) {
          router.replace('/(admin)');
        } else {
          router.replace('/(employee)');
        }
      } else {
        throw new Error("Account deactivated.");
      }
    } catch (err) {
      Alert.alert('Authentication Failed', err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <View style={styles.innerCard}>
            <Text style={styles.label}>Username</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Employee ID" 
                value={empId} 
                onChangeText={setEmpId} 
                autoCapitalize="none" 
            />

            <Text style={styles.label}>Password</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Password" 
                secureTextEntry 
                value={password} 
                onChangeText={setPassword} 
            />
            
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
            </TouchableOpacity>
        </View>
        
        
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity style={{ marginTop: 25 }}>
            <Text style={styles.linkText}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f4f8', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  innerCard: {
    width: '85%'
  },

  label: {
    marginBottom: 5
  },

  card: { 
    width: '85%',
    height: '55%', 
    padding: 25, 
    backgroundColor: '#ffffff', 
    borderRadius: 15, 
    elevation: 3, 
    alignItems: 'center',
    justifyContent: 'space-evenly', 
  },

  title: { 
    fontSize: 25, 
    fontWeight: '700', 
    color: '#101d46', 
    marginBottom: 25 
  },

  input: { 
    width: '100%', 
    height: 48, 
    borderWidth: 1, 
    borderColor: '#144480', 
    borderRadius: 8, 
    paddingHorizontal: 15, 
    marginBottom: 15, 
    backgroundColor: '#f8fafc',
  },

  button: { 
    width: '100%', 
    height: 48, 
    backgroundColor: '#101d46', 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10 
  },

  buttonText: { 
    color: '#ffffff', 
    fontWeight: 'bold', 
    fontSize: 18
  },

  linkText: { 
    color: '#2458a2', 
    fontSize: 14, 
    textDecorationLine: 'underline' 
  }
});