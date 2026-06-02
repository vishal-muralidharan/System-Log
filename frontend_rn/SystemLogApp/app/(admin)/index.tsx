import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, Pressable } from 'react-native';
import axiosInstance from '../../src/api/axios';

export default function AdminHome() {
  const [HistoryData, SetHistoryData] = useState<any[] | null>(null);
  const [Loading, SetLoading] = useState(true);
  const [ErrorMsg, SetError] = useState('');
  const [SelectedLog, SetSelectedLog] = useState<any | null>(null);

  const Today = new Date().toLocaleDateString();

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const Response = await axiosInstance.get('attendance/?ordering=LoginTime'); 
        SetHistoryData(Response.data);
      } catch (Error) {
        SetError('Could not retrieve current data'); 
      } finally {
        SetLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  const TodaysLogs = HistoryData ? HistoryData.filter((Emp) => {
    return new Date(Emp.LoginTime).toLocaleDateString() === Today; 
  }) : [];

  const FormatTime = (isoString: string) => {
    if (!isoString) return '--:--:--'; 
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }); 
  };

  const getRowStyle = (status: string) => {
    switch (status) {
      case 'Leave': return styles.leaveRow; 
      case 'In-Office': return styles.officeRow; 
      case 'Client Office': return styles.clientOfficeRow; 
      case 'Work From Home': 
      case 'wfh': return styles.wfhRow; 
      default: return { backgroundColor: '#ffffff' };
    }
  };

  const renderLogCell = ({ item }: any) => (
    <TouchableOpacity 
      style={[styles.row, getRowStyle(item.WorkStatus)]}
      onPress={() => SetSelectedLog(item)}
    >
      <Text style={styles.cell}>{item.EmployeeStringId}</Text>
      <Text style={styles.cell}>{item.WorkStatus}</Text>
    </TouchableOpacity>
  );

  if (Loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="rgb(25, 16, 84)" />
        <Text style={styles.loadingText}>Loading today's logs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.overallContainer}>
      {ErrorMsg ? <Text style={styles.errorText}>{ErrorMsg}</Text> : null}

      <Text style={styles.dashboardTitle}>Today's Attendance Log ({Today})</Text>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Employee ID</Text>
          <Text style={styles.headerCell}>Status</Text>
        </View>

        <FlatList
          data={TodaysLogs}
          keyExtractor={(item) => item.LogId.toString()}
          renderItem={renderLogCell}
          ListEmptyComponent={<Text style={styles.emptyText}>No Logs for Today ({Today})</Text>} 
        />
      </View>

      {/* Pop-up Modal for Extended Log Details */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={!!SelectedLog}
        onRequestClose={() => SetSelectedLog(null)}
        >
        <View>
            <View>
            <Text>Log Details</Text>
            
            {SelectedLog && (
                <View>
                <Text><Text>Target:</Text> {SelectedLog.EmployeeStringId}</Text>
                <Text><Text>Status:</Text> {SelectedLog.WorkStatus}</Text>
                <Text><Text>In:</Text> {FormatTime(SelectedLog.LoginTime)}</Text>
                <Text>
                    <Text>Out:</Text> {SelectedLog.LogoutTime ? FormatTime(SelectedLog.LogoutTime) : 'Unmarked'}
                </Text>
                </View>
            )}

            <Pressable onPress={() => SetSelectedLog(null)}>
                <Text>Close</Text>
            </Pressable>
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overallContainer: { 
    flex: 1, 
    backgroundColor: '#fff',
    padding: 15 
  },

  dashboardTitle: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#000000', 
    textAlign: 'center', 
    margin: 20,
    marginBottom: 30
  },
  
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.852)' 
  },

  loadingText: { 
    marginTop: 15, 
    fontSize: 16, 
    color: '#ffffff' 
  },

  errorText: { 
    color: 'rgb(212, 44, 44)', 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 10, 
    fontWeight: 'bold' 
  }, 

  table: { 
    flex: 1, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    overflow: 'hidden' 
  },

  headerRow: { 
    flexDirection: 'row', 
    backgroundColor: 'rgb(25, 16, 84)',
    paddingVertical: 22.5 
  },

  headerCell: { 
    flex: 1, 
    color: 'white', 
    fontWeight: 'bold',
    textAlign: 'center', 
    fontSize: 18 
  },

  row: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderColor: '#e2e8f0', 
    paddingVertical: 18, 
    alignItems: 'center' 
  },

  cell: { 
    flex: 1, 
    textAlign: 'center', 
    fontSize: 16, 
    color: '#000000', 
    fontWeight: '600' 
  },

  leaveRow: { backgroundColor: '#ffb1b1' }, 
  officeRow: { backgroundColor: '#b8f4cd' }, 
  wfhRow: { backgroundColor: '#afd3ec' }, 
  clientOfficeRow: { backgroundColor: '#fef9c3' }, 

  emptyText: { 
    textAlign: 'center', 
    marginTop: 30, 
    fontSize: 16, 
    color: '#64748b' 
  },
  
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.6)' 
  },

  modalContent: { 
    width: '80%', 
    backgroundColor: '#ffffff', 
    borderRadius: 12, 
    padding: 25, 
    elevation: 5 
  },

  modalTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: 'rgb(25, 16, 84)', 
    textAlign: 'center' 
  },

  modalDataWrapper: { 
    marginBottom: 25 
  },

  modalText: { 
    fontSize: 16, 
    color: '#334155', 
    marginBottom: 12 
  },

  boldLabel: { 
    fontWeight: 'bold', 
    color: '#0f172a' 
  },

  closeButton: { 
    backgroundColor: 'rgb(25, 16, 84)', 
    padding: 14, 
    borderRadius: 8, 
    alignItems: 'center' 
  },

  closeButtonText: { 
    color: '#ffffff', 
    fontWeight: 'bold', 
    fontSize: 14 
  }
});