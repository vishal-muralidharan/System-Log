import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, 
    Modal, Pressable, ScrollView, TextInput } from 'react-native'
import axiosInstance from '../../src/api/axios'

export default function AdminHistory() {
  const [HistoryData, SetHistoryData] = useState<any[] | null>(null)
  const [Loading, SetLoading] = useState(true)
  const [ErrorMsg, SetError] = useState('')
  const [SelectedLog, SetSelectedLog] = useState<any | null>(null)

  const [searchId, setSearchId] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const Response = await axiosInstance.get('attendance/?ordering=LoginTime') 
        SetHistoryData(Response.data)
      } catch (Error) {
        SetError('Could not retrieve current data') 
      } finally {
        SetLoading(false)
      }
    }

    fetchHistoryData()
  }, [])

  const filteredLogs = HistoryData?.filter(log => {
    const safeId = (log.EmployeeStringId || "").toLowerCase()
    const matchId = safeId.includes(searchId.toLowerCase())

    const matchStatus = filterStatus === 'All' ? true : log.WorkStatus === filterStatus

    return matchId && matchStatus
  }) || []

  const FormatTime = (isoString: string) => {
    if (!isoString) return '--:--:--' 
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
  }

  const FormatDate = (isoString: string) => {
    if (!isoString) return '--' 
    return new Date(isoString).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  const getRowStyle = (status: string) => {
    switch (status) {
      case 'Leave': return styles.leaveRow 
      case 'In-Office': return styles.officeRow 
      case 'Client Office': return styles.clientOfficeRow 
      case 'Work From Home': return styles.wfhRow 
      default: return { backgroundColor: '#ffffff' }
    }
  }

  const renderLogCell = ({ item }: any) => (
    <TouchableOpacity 
      style={[styles.row, getRowStyle(item.WorkStatus)]}
      onPress={() => SetSelectedLog(item)}
    >
      <Text style={styles.cell}>{item.LogId}</Text>
      <Text style={styles.bigCell}>{item.EmployeeStringId}</Text>
      <Text style={styles.bigCell}>{FormatDate(item.LoginTime)}</Text>
    </TouchableOpacity>
  )

  if (Loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="rgb(25, 16, 84)" />
        <Text style={styles.loadingText}>Loading today's logs...</Text>
      </View>
    )
  }

  const getPillStyle = (status: string) => {
    switch (status) {
      case 'Leave': return styles.pillLeave 
      case 'In-Office': return styles.pillOffice 
      case 'Client Office': return styles.pillClientOffice 
      case 'Work From Home': return styles.pillWFH 
      default: return styles.pill
    }
  }

  const getActivePillStyle = (status: string) => {
    switch (status) {
      case 'Leave': return styles.pillLeaveActive
      case 'In-Office': return styles.pillOfficeActive 
      case 'Client Office': return styles.pillClientOfficeActive 
      case 'Work From Home': return styles.pillWFHActive 
      default: return styles.pillActive
    }
  }

  const statusOptions = ['All', 'In-Office', 'Leave', 'Client Office', 'Work From Home']

  return (
    <View style={styles.overallContainer}>
      {ErrorMsg ? <Text style={styles.errorText}>{ErrorMsg}</Text> : null}

      <Text style={styles.dashboardTitle}>Attendance Log History</Text>

      <View style={styles.filterSection}>
        <TextInput 
          style={styles.input} 
          placeholder="Search Employee ID" 
          placeholderTextColor="#64748b"
          value={searchId}
          onChangeText={setSearchId}
        />
        
        <View style={styles.pillContainer}>
          {statusOptions.map((status) => (
            <TouchableOpacity 
              key={status}
              style={[getPillStyle(status), filterStatus === status && getActivePillStyle(status)]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[getPillStyle(status), filterStatus === status && getActivePillStyle(status)]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>ID</Text>
          <Text style={styles.bigHeaderCell}>Employee ID</Text>
          <Text style={styles.bigHeaderCell}>Log Date</Text>
        </View>

        <FlatList
          data={filteredLogs}
          keyExtractor={(item) => item.LogId.toString()}
          renderItem={renderLogCell}
          ListEmptyComponent={<Text style={styles.emptyText}>No Logs Present</Text>} 
        />
      </View>

      {/* Pop-up Modal for Extended Log Details */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={!!SelectedLog}
        onRequestClose={() => SetSelectedLog(null)}
      >
        <Pressable 
            style={styles.modalOverlay} 
            onPress={() => SetSelectedLog(null)}
        >
            <Pressable 
                style={styles.modalContent} 
                onPress={(e) => e.stopPropagation()} 
            >
                <Text style={styles.modalTitle}>Log Details</Text>
                
                {SelectedLog && (
                <View style={styles.modalDataWrapper}>
                    <Text style={styles.modalText}><Text style={styles.boldLabel}>Log ID:</Text> {SelectedLog.LogId}</Text>
                    <Text style={styles.modalText}><Text style={styles.boldLabel}>Date:</Text> {FormatDate(SelectedLog.LoginTime)}</Text>
                    <Text style={styles.modalText}><Text style={styles.boldLabel}>Employee ID:</Text> {SelectedLog.EmployeeStringId}</Text>
                    <Text style={styles.modalText}><Text style={styles.boldLabel}>Status:</Text> {SelectedLog.WorkStatus}</Text>
                    
                    <Text style={styles.modalText}><Text style={styles.boldLabel}>
                        {SelectedLog.WorkStatus === "Leave" ? 'Leave Marked:' : 'Log-in Time:' }
                    </Text> {FormatTime(SelectedLog.LoginTime)}</Text>

                    {SelectedLog.WorkStatus !== "Leave" && (
                        <Text style={styles.modalText}>
                            <Text style={styles.boldLabel}>Log-out Time: </Text> 
                            {SelectedLog.LogoutTime ? FormatTime(SelectedLog.LogoutTime) : 'Unmarked'}
                        </Text>
                    )}
                </View>
                )}

                <Pressable style={styles.closeButton} onPress={() => SetSelectedLog(null)}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
                
            </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  overallContainer: { 
    flex: 1, 
    backgroundColor: '#fff',
    padding: 20 
  },

  dashboardTitle: { 
    fontSize: 25, 
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

  bigHeaderCell: { 
    flex: 2, 
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

  bigCell: { 
    flex: 2, 
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
    width: '85%', 
    backgroundColor: '#ffffff', 
    borderRadius: 12, 
    padding: 25,
    elevation: 5,
    justifyContent: 'space-evenly',
    height: '55%'
  },

  modalTitle: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    marginBottom: 25, 
    color: 'rgb(25, 16, 84)', 
    textAlign: 'center' 
  },

  modalDataWrapper: { 
    marginBottom: 25 
  },

  modalText: { 
    fontSize: 21, 
    color: '#334155', 
    marginBottom: 12 
  },

  boldLabel: { 
    fontWeight: 'bold', 
    color: '#0f172a' 
  },

  closeButton: { 
    backgroundColor: 'rgb(17, 11, 51)', 
    padding: 14, 
    borderRadius: 8, 
    alignItems: 'center' 
  },

  closeButtonText: { 
    color: '#ffffff', 
    fontWeight: 'bold', 
    fontSize: 18 
  },

  filterSection: { 
    marginBottom: 25 
  },

  input: {
    backgroundColor: '#ffffff',
    color: '#333333',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16
  },

  pillContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10, 
    alignItems: 'center', 
  },

  pill: { 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    backgroundColor: '#e3e3e3', 
    borderRadius: 20, 
    alignItems: 'center',
    margin: 4,
    color: '#000000', 
    fontWeight: 'bold', 
    fontSize: 15 
  },

  pillActive: { 
    backgroundColor: 'rgb(0, 0, 0)',
    color: '#ffffff'
  },

  pillOffice: { 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    backgroundColor: '#ddece0', 
    borderRadius: 20, 
    alignItems: 'center',
    margin: 4,
    color: '#144c0d', 
    fontWeight: 'bold', 
    fontSize: 15 
  },

  pillOfficeActive: { 
    backgroundColor: 'rgb(16, 84, 16)',
    color: '#ffffff'
  },

  pillLeave: { 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    backgroundColor: '#ecdedd', 
    borderRadius: 20, 
    alignItems: 'center',
    margin: 4,
    color: '#4c0d0d', 
    fontWeight: 'bold', 
    fontSize: 15 
  },

  pillLeaveActive: { 
    backgroundColor: 'rgb(84, 16, 16)',
    color: '#ffffff'
  },

  pillClientOffice: { 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    backgroundColor: '#ebebc3', 
    borderRadius: 20, 
    alignItems: 'center',
    margin: 4,
    color: '#474c05', 
    fontWeight: 'bold', 
    fontSize: 15 
  },

  pillClientOfficeActive: { 
    backgroundColor: '#786a00',
    color: '#ffffff'
  },

  pillWFH: {
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    backgroundColor: '#ebeffc', 
    borderRadius: 20, 
    alignItems: 'center',
    margin: 4,
    color: '#0a054c', 
    fontWeight: 'bold', 
    fontSize: 15 
  }, 

  pillWFHActive: {
    backgroundColor: '#0a054c',
    color: '#ffffff'
  },
})