import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import axiosInstance from '../../src/api/axios'

const AdminHome = () => {
    const [HistoryData, SetHistoryData] = useState(null)
    const [Loading, SetLoading] = useState(true)
    const [ErrorMsg, SetError] = useState('')
    const Today = new Date().toLocaleDateString()

    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                const Response = await axiosInstance.get('attendance/?ordering=LoginTime')
                const Logs = Response.data
                SetHistoryData(Logs)
            }
            catch (Error) {
                console.error(Error)
                SetError('Could not retrieve current data')
            }
            finally {
                SetLoading(false)
            }
        }

        fetchHistoryData()
    }, [])

    const TodaysLogs = HistoryData ? HistoryData.filter(Emp => {
        return (new Date(Emp.LoginTime).toLocaleDateString() === Today)
    }) : []
    
    const FormatTime = (isoString) => {
        if (!isoString) return '--:--:--'
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }

    const FormatDate = (IsoString) => {
        if (!IsoString) return '--'
        return new Date(IsoString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    // Helper function moved to be a standard function inside the component
    const getRowStyle = (status) => {
        switch (status) {
            case 'Leave': return styles.leaveRow
            case 'In-Office': return styles.officeRow
            case 'Client Office': return styles.clientOfficeRow
            case 'Work From Home': 
            case 'wfh': return styles.wfhRow
            default: return {}
        }
    }

    if (Loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="rgb(25, 16, 84)" />
                <Text style={styles.loading}>Loading today's logs...</Text>
            </View>
        )
    }

    return (
        <View style={styles.outer}>
            {ErrorMsg ? <Text style={styles.errorText}>{ErrorMsg}</Text> : null}

            {TodaysLogs.length === 0 ? (
                <Text style={styles.heading}>No Logs for Today ({Today})</Text>
            ) : (
                <>
                    <Text style={styles.heading}>Today's Attendance Log ({Today})</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.table}>
                            
                            <View style={styles.headerRow}>
                                <Text style={styles.headerCell}>Employee ID</Text>
                                <Text style={styles.headerCell}>Log ID</Text>
                                <Text style={styles.headerCell}>Status</Text>
                                <Text style={styles.headerCell}>Login Time</Text>
                                <Text style={styles.headerCell}>Logout Time</Text>
                            </View>

                            <ScrollView style={styles.tableBody}>
                                {TodaysLogs.map((Data) => (
                                    <View 
                                        key={Data.LogId} 
                                        style={[styles.row, getRowStyle(Data.WorkStatus)]}
                                    >
                                        <Text style={styles.cell}>{Data.EmployeeStringId}</Text>
                                        <Text style={styles.cell}>{Data.LogId}</Text>
                                        <Text style={styles.cell}>{Data.WorkStatus}</Text>
                                        
                                        {Data.WorkStatus === 'Leave' ? (
                                            <Text style={[styles.cell, { flex: 2, textAlign: 'center' }]}>
                                                {FormatTime(Data.LoginTime)}
                                            </Text>
                                        ) : (
                                            <>
                                                <Text style={styles.cell}>{FormatTime(Data.LoginTime)}</Text>
                                                <Text style={styles.cell}>
                                                    {Data.LogoutTime === null ? 'Unmarked' : FormatTime(Data.LogoutTime)}
                                                </Text>
                                            </>
                                        )}
                                    </View>
                                ))}
                            </ScrollView>
                            
                        </View>
                    </ScrollView>
                </>
            )}
        </View>
    )
}

export default AdminHome;

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },

    loading: {
        marginTop: 15,
        fontSize: 16,
        color: '#333',
    },

    errorText: {
        color: 'rgb(212, 44, 44)',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold',
    },

    outer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8fafc',
    },
    
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 20,
        textAlign: 'center',
    },

    table: {
        minWidth: 600, 
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2, 
        shadowColor: '#000', 
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },

    headerRow: {
        flexDirection: 'row',
        backgroundColor: 'rgb(25, 16, 84)', 
        paddingVertical: 12,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },

    headerCell: {
        flex: 1,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 14,
        paddingHorizontal: 5,
    },

    tableBody: {
        maxHeight: 400, 
    },

    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingVertical: 12,
        alignItems: 'center',
    },

    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
        color: '#333',
        paddingHorizontal: 5,
    },

    leaveRow: {
        backgroundColor: '#fee2e2', 
    },

    officeRow: {
        backgroundColor: '#dcfce7',
    },

    wfhRow: {
        backgroundColor: '#e0f2fe',
    },

    clientOfficeRow: {
        backgroundColor: '#fef9c3', 
    },
})