import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, 
  View, Alert, ActivityIndicator } from 'react-native'
import { useRouter, Link } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axiosInstance from '../../src/api/axios'

export default function SignupScreen() {
  const router = useRouter()
  
  const [FirstName, SetFirstName] = useState('')
  const [LastName, SetLastName] = useState('')
  const [ProjectInvolved, SetProjectInvolved] = useState('')
  const [Password, SetPassword] = useState('')
  const [ConfirmPassword, SetConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!FirstName || !LastName || !ProjectInvolved || !Password || !ConfirmPassword) {
      return Alert.alert('Warning', 'All fields are mandatory. Fill all the fields.')
    }

    if (Password !== ConfirmPassword) {
      return Alert.alert('Error', 'Passwords do not match')
    }

    setLoading(true)
    
    try {
      const response = await axiosInstance.post('auth/register/', {
        FirstName: FirstName,
        LastName: LastName,
        ProjectInvolved: ProjectInvolved,
        password: Password,
        password_confirm: ConfirmPassword
      });

      const EmployeeID = response.data.EmployeeId;

      return Alert.alert('Success', `Your Employee ID is: ${EmployeeID}. Contact Administrator for Approval`);
      router.replace('/(auth)/login')

    } catch (err: unknown) {
      if (err instanceof Error) {
        Alert.alert('Authentication Failed', err.message || 'Fill in all the details')
      } else {
        Alert.alert('Authentication Failed', 'An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <View style={styles.card}>
        
        <View style={styles.innerCard}>
            <Text style={styles.label}>First Name</Text>
            <TextInput 
                style={styles.input} 
                placeholder="First Name" 
                value={FirstName} 
                onChangeText={SetFirstName} 
                autoCapitalize="none" 
            />

            <Text style={styles.label}>Last Name</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Last Name" 
                value={LastName} 
                onChangeText={SetLastName} 
                autoCapitalize="none" 
            />

            <Text style={styles.label}>Projects</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Projects" 
                value={ProjectInvolved} 
                onChangeText={SetProjectInvolved} 
                autoCapitalize="none" 
            />

            <Text style={styles.label}>Password</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Password" 
                secureTextEntry 
                value={Password} 
                onChangeText={SetPassword} 
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Confirm Password" 
                secureTextEntry 
                value={ConfirmPassword} 
                onChangeText={SetConfirmPassword} 
            />
            
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
            </TouchableOpacity>
        </View>
        
        
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={{ marginTop: 15 }}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  )
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
    height: '70%', 
    padding: 5, 
    backgroundColor: '#ffffff', 
    borderRadius: 15, 
    elevation: 3, 
    alignItems: 'center',
    justifyContent: 'space-evenly', 
  },

  title: { 
    fontSize: 35, 
    fontWeight: '700', 
    color: '#101d46', 
    marginBottom: 45 
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
})