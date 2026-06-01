import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axiosInstance from '../../src/api/axios';

const EmployeeHome = () => {
    const [AttendanceData, SetAttendanceData] = useState(null);
    const [Status, SetStatus] = useState('In-Office');
    const [Loading, SetLoading] = useState(true);
    const [ErrorMsg, SetError] = useState('');

    useEffect(() => {
        const fetchTodayStatus = async () => {
            try {
                const Response = await axiosInstance.get('attendance/?ordering=-LoginTime');
                const Logs = Response.data;

                if (Logs.length > 0) {
                    const LatestLog = Logs[0];
                    const LogDate = new Date(LatestLog.LoginTime).toLocaleDateString();
                    const Today = new Date().toLocaleDateString();

                    if (LogDate === Today) {
                        SetAttendanceData(LatestLog);
                    }
                }
            } catch (Error) {
                console.error(Error);
                SetError('Could not retrieve current data');
            } finally {
                SetLoading(false);
            }
        };

        fetchTodayStatus();
    }, []);

    const HandleClockIn = async () => {
        SetLoading(true);
        SetError('');

        try {
            const Response = await axiosInstance.post('attendance/login/', {
                WorkStatus: Status
            });
            SetAttendanceData(Response.data);
        } catch (Error) {
            console.error(Error);
            SetError('Error in marking Log-In Data');
        } finally {
            SetLoading(false);
        }
    };

    const HandleClockOut = async () => {
        SetLoading(true);
        SetError('');

        try {
            const Response = await axiosInstance.post('attendance/logout/');
            SetAttendanceData(prev => ({
                ...prev,
                LogoutTime: Response.data.LogoutTime
            }));
        } catch (Error) {
            console.error(Error);
            SetError('Error in marking Log-Out Data');
        } finally {
            SetLoading(false);
        }
    };

    const FormatTime = (isoString) => {
        if (!isoString) return '--:--:--';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    if (Loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="rgb(25, 16, 84)" />
                <Text style={styles.loading}>Loading your status...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {ErrorMsg ? <Text style={styles.error}>{ErrorMsg}</Text> : null}

            {/* Condition 1: Log-in not done for the day */}
            {!AttendanceData ? (
                <View style={styles.conditionBox}>
                    <Text style={styles.headerText}>You have not marked Log-in for the day</Text>
                    
                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Select your work status:</Text>
                        
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={Status}
                                onValueChange={(itemValue) => SetStatus(itemValue)}
                                style={styles.picker}
                                dropdownIconColor="white"
                                mode="dropdown"
                            >
                                <Picker.Item label="In-Office" value="In-Office" />
                                <Picker.Item label="Work From Home" value="Work From Home" />
                                <Picker.Item label="Leave" value="Leave" />
                                <Picker.Item label="Client Office" value="Client Office" />
                            </Picker>
                        </View>

                        <TouchableOpacity style={styles.primaryButton} onPress={HandleClockIn}>
                            <Text style={styles.primaryButtonText}>Mark Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : AttendanceData && !AttendanceData.LogoutTime ? (
                
            /* Condition 2: Log-in completed but Log-out not done for the day */
                <View style={styles.conditionBox}>
                    <Text style={[styles.headerText, { marginBottom: 40 }]}>
                        You have not marked your Log-out for the day
                    </Text>
                    
                    <Text style={styles.dataText}>Login Time: {FormatTime(AttendanceData.LoginTime)}</Text>
                    <Text style={styles.dataText}>Status: {AttendanceData.WorkStatus}</Text>
                    
                    <TouchableOpacity style={styles.logoutButton} onPress={HandleClockOut}>
                        <Text style={styles.primaryButtonText}>Mark Logout</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                
            /* Condition 3: Log-in and Log-out completed for the day */
                <View >
                  {AttendanceData.WorkStatus !== 'Leave' ? (
                        <Text style={[styles.headerText]}>You have marked both your Log-in and Log-out</Text>
                    ) : (
                        <Text style={[styles.headerText]}>Your Leave has been marked</Text>
                    )}
                  <View style={styles.conditionBox}>                   
                    <Text style={styles.dataTextLarge}>Login Time: {FormatTime(AttendanceData.LoginTime)}</Text>
                    
                    {AttendanceData.WorkStatus !== 'Leave' && (
                        <Text style={styles.dataTextLarge}>Logout Time: {FormatTime(AttendanceData.LogoutTime)}</Text>
                    )}
                    
                    <Text style={styles.dataTextLarge}>Status: {AttendanceData.WorkStatus}</Text>
                  </View>
                  <View style={styles.cheerContainer}>
                      {AttendanceData.WorkStatus !== 'Leave' && <Text style={styles.cheerText}>Great job!</Text>}
                      <Text style={styles.cheerText}>See you tomorrow!</Text>
                  </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
    },

    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },

    conditionBox: {
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#c3cfeb',
        padding: 20,
        borderRadius: 10
    },

    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 60
    },

    formContainer: {
        width: '100%',
        marginTop: 20,
    },

    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
        textAlign: 'center',
    },

    pickerWrapper: {
        backgroundColor: 'rgb(25, 16, 84)',
        borderRadius: 5,
        marginVertical: 15,
        marginHorizontal: 5,
        overflow: 'hidden',
    },

    picker: {
        color: 'white',
        height: 50,
        width: '100%',
        textAlign: 'center',
    },

    primaryButton: {
        backgroundColor: 'rgb(208, 217, 248)',
        paddingVertical: 10,
        margin: 5,
        borderRadius: 5,
        alignItems: 'center',
    },

    logoutButton: {
        backgroundColor: 'rgb(208, 217, 248)',
        paddingVertical: 10,
        paddingHorizontal: 60,
        marginVertical: 25,
        marginHorizontal: 5,
        borderRadius: 5,
        alignItems: 'center',
    },

    primaryButtonText: {
        fontSize: 15,
        color: 'rgb(25, 16, 84)',
        fontWeight: '600',
    },

    dataText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },

    dataTextLarge: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 5,
        color: '#333',
    },
    
    cheerContainer: {
        marginTop: 50,
        alignItems: 'center',
    },

    cheerText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 5,
    },

    loading: {
        color: 'rgb(100, 100, 100)',
        marginTop: 15,
        fontSize: 16,
    },
    
    error: {
        color: 'rgb(212, 44, 44)',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
    },
});

export default EmployeeHome;