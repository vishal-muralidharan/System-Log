import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Drawer } from 'expo-router/drawer'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axiosInstance from '../../src/api/axios'

function CustomDrawerContent(props) {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('access_token')
            await AsyncStorage.removeItem('refresh_token')
            
            router.replace('/(auth)/login')
        }
        catch (LogoutErr) {
            console.error('Logout error:', LogoutErr)
        }
    }

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
            <View style={styles.topSection}>
                <DrawerItemList {...props} />
            </View>

            <View style={styles.bottomSection}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    )
}

export default function EmployeeLayout() {
    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerStyle: { backgroundColor: 'rgb(25, 16, 84)' },
                headerTintColor: '#fff', 
                drawerActiveTintColor: 'rgb(25, 16, 84)',
                drawerInactiveTintColor: '#333',
            }}
        >
            <Drawer.Screen 
                name="index" 
                options={{ 
                    drawerLabel: 'Home Page',
                    title: 'Dashboard' 
                }} 
            />
        </Drawer>
    )
}

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
    },
    topSection: {
        flex: 1,
        paddingTop: 10,
    },
    bottomSection: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: 'rgb(212, 44, 44)',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
})