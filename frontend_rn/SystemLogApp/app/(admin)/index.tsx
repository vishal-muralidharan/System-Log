import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axiosInstance from '../../src/api/axios';

const AdminHome = () => {
    const [AttendanceData, setAttendanceData] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [ErrorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchAllLogs = async () => {
            setLoading(true);
            setErrorMsg('');

            try {
                const Response = await axiosInstance.get('attendance/');
                setAttendanceData(Response.data);
            } catch (error) {
                // Proper error extraction syntax
                if (error.response) {
                    console.log("SERVER REJECTED:", error.response.status);
                    setErrorMsg(`Auth/Server Error: Status ${error.response.status}`);
                } else if (error.request) {
                    console.log("NETWORK ERROR:", error.message);
                    setErrorMsg('Network Error: Check computer IP and Firewall.');
                } else {
                    console.log("SETUP ERROR:", error.message);
                    setErrorMsg('An unexpected error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAllLogs();
    }, []);

    if (Loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="rgb(25, 16, 84)" />
                <Text style={styles.loadingText}>Fetching company logs...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Admin Dashboard</Text>
            
            {ErrorMsg ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{ErrorMsg}</Text>
                </View>
            ) : (
                <Text style={styles.successText}>
                    Successfully fetched {AttendanceData.length} logs!
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8fafc',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#555',
    },
    errorBox: {
        backgroundColor: '#fee2e2',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f87171',
    },
    errorText: {
        color: '#b91c1c',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    successText: {
        color: '#10b981',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    }
});

export default AdminHome;