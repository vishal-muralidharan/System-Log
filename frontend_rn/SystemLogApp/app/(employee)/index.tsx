import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
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
            <View>
                <ActivityIndicator size="large" />
                <Text>Loading your status...</Text>
            </View>
        );
    }

    return (
        <View>
            {ErrorMsg ? <Text>{ErrorMsg}</Text> : null}

            {/* Condition 1: Log-in not done for the day */}
            {!AttendanceData ? (
                <View>
                    <Text>You have not marked Log-in for the day</Text>
                    
                    <View>
                        <Text>Select your work status:</Text>
                        
                        <View>
                            <Picker
                                selectedValue={Status}
                                onValueChange={(itemValue) => SetStatus(itemValue)}
                            >
                                <Picker.Item label="In-Office" value="In-Office" />
                                <Picker.Item label="Work From Home" value="Work From Home" />
                                <Picker.Item label="Leave" value="Leave" />
                                <Picker.Item label="Client Office" value="Client Office" />
                            </Picker>
                        </View>

                        <TouchableOpacity onPress={HandleClockIn}>
                            <Text>Mark Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : AttendanceData && !AttendanceData.LogoutTime ? (
                
            /* Condition 2: Log-in completed but Log-out not done for the day */
                <View>
                    <Text>You have not marked your Log-out for the day</Text>
                    <Text>Login Time: {FormatTime(AttendanceData.LoginTime)}</Text>
                    <Text>Status: {AttendanceData.WorkStatus}</Text>
                    
                    <TouchableOpacity onPress={HandleClockOut}>
                        <Text>Mark Logout</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                
            /* Condition 3: Log-in and Log-out completed for the day */
                <View>
                    {AttendanceData.WorkStatus !== 'Leave' ? (
                        <Text>You have marked both your Log-in and Log-out</Text>
                    ) : (
                        <Text>Your Leave has been marked</Text>
                    )}
                    
                    <Text>Login Time: {FormatTime(AttendanceData.LoginTime)}</Text>
                    
                    {AttendanceData.WorkStatus !== 'Leave' && (
                        <Text>Logout Time: {FormatTime(AttendanceData.LogoutTime)}</Text>
                    )}
                    
                    <Text>Status: {AttendanceData.WorkStatus}</Text>
                    
                    <View>
                        {AttendanceData.WorkStatus !== 'Leave' && <Text>Great job!</Text>}
                        <Text>See you tomorrow!</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default EmployeeHome;