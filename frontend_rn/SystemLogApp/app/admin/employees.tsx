import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, 
    Modal, Pressable, TextInput, Alert } from 'react-native'
import axiosInstance from '../../src/api/axios'

export default function AdminEmployees() {
  const [EmployeeData, SetEmployeeData] = useState<any[] | null>(null)
  const [Loading, SetLoading] = useState(true)
  const [ErrorMsg, SetError] = useState('')
  const [SelectedLog, SetSelectedLog] = useState<any | null>(null)

  const [searchID, setSearchID] = useState('')
  const [searchProject, setSearchProject] = useState('')
  const [empStatus, setEmpStatus] = useState<boolean | null>(null)

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const Response = await axiosInstance.get('employees/')
        const Logs = Response.data
        const sortedLogs = [...Logs].sort((a, b) => a.id - b.id); 

        SetEmployeeData(sortedLogs)
      } 
      catch (Error) {
        console.error(Error)
        SetError('Could not retrieve current data') 
      } 
      finally {
        SetLoading(false)
      }
    }

    fetchEmployeeData()
    }, []
  )

  const HandleDelete = (ID: number, CurrentStatus: boolean) => {
    const ActionText = CurrentStatus ? 'deactivate' : 'activate';

    Alert.alert(
      'Confirm Deletion',
      `You are about to ${ActionText} a employee. Are you sure?`,
      [
        { 
          text: 'Cancel', 
          style: 'cancel' 
        },
        { 
          text: 'Yes, Confirm', 
          style: 'default', 
          onPress: async () => {
            try {
              await axiosInstance.patch(`employees/${ID}/`, 
                {
                    IsActive: !CurrentStatus
                }
                )

                SetEmployeeData((Prev: any[] | null) => 
                    Prev ? Prev.map(Log => Log.id === ID ? 
                    { ...Log, IsActive: !CurrentStatus } : Log) : 
                    null
                );
                
                SetSelectedLog(null)
            } 
            catch (Error) {
              console.error(Error)
              SetError('Could not delete Log Data')
              
              Alert.alert('Error', 'Could not perform this action.')
            }
          } 
        }
      ]
    )
  }

  const filteredEmployees = EmployeeData?.filter(Emp => {
    const SafeEmployeeId = (Emp.EmployeeId || "").toLowerCase()
    const EmpIDMatch = SafeEmployeeId.includes(searchID.toLowerCase())

    const SafeProject = (Emp.ProjectInvolved || "").toLowerCase()
    const ProjectMatch = SafeProject.includes(searchProject.toLowerCase())

    let ActiveMatch = true
    if (empStatus !== null) {
      ActiveMatch = Emp.IsActive === empStatus
    }

    return EmpIDMatch && ProjectMatch && ActiveMatch && !Emp.IsAdmin
  }) || []

  const FormatDate = (isoString: string) => {
    if (!isoString) return '--' 
    return new Date(isoString).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  const getRowStyle = (status: boolean) => {
    switch (status) {
      case true: return styles.activeRow 
      case false: return styles.inactiveRow 
    }
  }

  const renderLogCell = ({ item }: any) => (
    <TouchableOpacity 
      style={[styles.row, getRowStyle(item.IsActive)]}
      onPress={() => SetSelectedLog(item)}
    >
      <Text style={styles.cell}>{item.EmployeeId}</Text>
      <Text style={styles.cell}>{item.IsActive ? 'Active' : 'Inactive' }</Text>
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
      case 'Active': return styles.pillActive
      case 'Inactive': return styles.pillInactive
      default: return styles.pillAll
    }
  }

  const getActivePillStyle = (status: string) => {
    switch (status) {
      case 'Active': return styles.pillActiveChosen
      case 'Inactive': return styles.pillInactiveChosen 
      default: return styles.pillAllChosen
    }
  }

  const statusOptions = ['All', 'Active', 'Inactive']
  const empCheckString = empStatus === true ? 'Active' : empStatus === false ? 'Inactive' : 'All'

  return (
    <View style={styles.overallContainer}>
      {ErrorMsg ? <Text style={styles.errorText}>{ErrorMsg}</Text> : null}

      <Text style={styles.dashboardTitle}>Attendance Log History</Text>

      <View style={styles.filterSection}>
        <TextInput 
          style={styles.input} 
          placeholder="Search Employee ID" 
          placeholderTextColor="#64748b"
          value={searchID}
          onChangeText={setSearchID}
        />

        <TextInput 
          style={styles.input} 
          placeholder="Search Project" 
          placeholderTextColor="#64748b"
          value={searchProject}
          onChangeText={setSearchProject}
        />
        
        <View style={styles.pillContainer}>
          {statusOptions.map((status) => (
            <TouchableOpacity 
              key={status}
              style={[getPillStyle(status), empCheckString === status && getActivePillStyle(status)]}
              onPress={() => setEmpStatus(status === 'Active' ? true : (status === 'Inactive' ? false : null))}
            >
              <Text style={[getPillStyle(status), empCheckString === status && getActivePillStyle(status)]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Employee ID</Text>
          <Text style={styles.headerCell}>Status</Text>
        </View>

        <FlatList
          data={filteredEmployees}
          keyExtractor={(item) => item.id}
          renderItem={renderLogCell}
          ListEmptyComponent={<Text style={styles.emptyText}>No Employees Present</Text>} 
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
                <Text style={styles.modalTitle}>Employee Details</Text>
                
                {SelectedLog && (
                <View style={styles.modalDataWrapper}>
                    <Text style={styles.modalText}><Text style={styles.boldLabel}>Employee ID:</Text> {SelectedLog.EmployeeId}</Text>
                    <Text style={styles.modalText}><Text style={styles.boldLabel}>Project:</Text> {SelectedLog.ProjectInvolved}</Text>
                    
                    <Text style={styles.modalText}><Text style={styles.boldLabel}>
                        Status:
                    </Text> {SelectedLog.IsActive ? 'Active' : 'Inactive' }</Text>
                </View>
                )}
                <View style={styles.buttonContainer}>
                  <Pressable style={styles.closeButton} onPress={() => SetSelectedLog(null)}>
                      <Text style={styles.closeButtonText}>Close</Text>
                  </Pressable>
                  {SelectedLog &&
                    <Pressable style={[SelectedLog.IsActive ? styles.deactivateButton : styles.activateButton]} 
                        onPress={() => HandleDelete(SelectedLog.id, SelectedLog.IsActive)}
                    >
                        <Text style={[SelectedLog.IsActive ? styles.deactivateButtonText : styles.activateButtonText]}>
                            {SelectedLog.IsActive ? 'Deactivate': 'Activate'}
                        </Text>
                    </Pressable>}
                </View>
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
    backgroundColor: 'rgb(36, 36, 36)',
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

  inactiveRow: { backgroundColor: '#ffb1b1' }, 
  activeRow: { backgroundColor: '#b8f4cd' }, 

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
    height: '45%'
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

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButton: { 
    backgroundColor: 'rgb(17, 11, 51)', 
    padding: 14,
    margin: 10, 
    borderRadius: 10, 
    alignItems: 'center',
    width: '45%'
  },

  closeButtonText: { 
    color: '#ffffff', 
    fontWeight: 'bold', 
    fontSize: 18 
  },

  activateButton: {
    backgroundColor: 'rgb(5, 81, 10)', 
    padding: 14, 
    margin: 10,
    borderRadius: 10, 
    alignItems: 'center',
    width: '45%'
  }, 

  activateButtonText: {
    color: '#ffffff', 
    fontWeight: 'bold', 
    fontSize: 18
  },

  deactivateButton: { 
    backgroundColor: 'rgb(126, 19, 19)', 
    padding: 14, 
    margin: 10,
    borderRadius: 10, 
    alignItems: 'center',
    width: '45%'
  },

  deactivateButtonText: { 
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

  pillAll: { 
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

  pillAllChosen: { 
    backgroundColor: 'rgb(0, 0, 0)',
    color: '#ffffff'
  },

  pillActive: { 
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

  pillActiveChosen: { 
    backgroundColor: 'rgb(16, 84, 16)',
    color: '#ffffff'
  },

  pillInactive: { 
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

  pillInactiveChosen: { 
    backgroundColor: 'rgb(84, 16, 16)',
    color: '#ffffff'
  },
})