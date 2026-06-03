import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface UserProfile {
  id: number
  EmployeeId: string
  FirstName?: string
  LastName?: string
  ProjectInvolved: string
  IsAdmin: boolean
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await AsyncStorage.getItem('user_profile')
        if (data) {
          setProfile(JSON.parse(data))
        }
      } catch (e) {
        console.error("Failed to load user profile data", e)
      }
    }
    
    loadProfile()
  }, [])

  if (!profile) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#191054" />
      </View>
    )
  }

  const avatarInitials = profile.EmployeeId ? profile.EmployeeId.slice(-2) : 'ID'

  return (
    <View style={styles.container}>
        <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{avatarInitials}</Text>
        </View>
        
        <Text style={styles.nameHeader}>Employee Details</Text>
      
      
      {/* Data Card */}
      <View style={styles.metaBox}>
        <View style={styles.row}>
          <Text style={styles.metaLabel}>System ID Tag:</Text>
          <Text style={styles.metaValue}>{profile.EmployeeId}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.metaLabel}>Assigned Project:</Text>
          <Text style={styles.metaValue}>{profile.ProjectInvolved || 'Unassigned'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.metaLabel}>Security Clearance:</Text>
          <Text style={styles.metaValue}>
            {!profile.IsAdmin ? 'Full-Time Employee' : ''}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f8fafc'
  },

  container: { 
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center', 
    padding: 30, 
    justifyContent: 'center',
  }, 

  avatarCircle: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: '#d6d6d6',
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#000000'
  },

  avatarText: { 
    fontSize: 36, 
    fontWeight: 'bold', 
    color: '#000000',
  },

  nameHeader: { 
    fontSize: 25, 
    fontWeight: '700', 
    color: '#334155', 
    marginBottom: 60
  },

  metaBox: { 
    width: '100%', 
    backgroundColor: '#ffffff', 
    padding: 30, 
    borderRadius: 15, 
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  row: {
    marginBottom: 20
  },

  metaLabel: { 
    fontSize: 15, 
    color: '#94a3b8', 
    textTransform: 'uppercase', 
    marginBottom: 4,
    fontWeight: 'bold'
  },

  metaValue: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: '#1e293b' 
  },
})