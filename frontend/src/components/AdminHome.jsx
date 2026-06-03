import React, { useEffect, useState } from 'react'
import '../css/Home.css'
import axiosInstance from '../api/axios'

const AdminHome = () => {
  const [historyData, setHistoryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const today = new Date().toLocaleDateString()

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await axiosInstance.get('attendance/?ordering=login_time')
        const logs = response.data
        setHistoryData(logs)
      } catch (error) {
        console.error(error)
        setErrorMsg('Could not retrieve current data')
      } finally {
        setLoading(false)
      }
    }

    fetchHistoryData()
  }, [])

  const todaysLogs = historyData ? historyData.filter(emp => {
    return (new Date(emp.login_time).toLocaleDateString() === today)
  }) : []
  
  const formatTime = (isoString) => {
    if (!isoString) return '--:--:--'
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  if (loading) {
    return (
      <h2 className='condition loading'>Loading your history...</h2>
    )
  }

  return (
    <div className='outer'>
      {todaysLogs.length === 0 ? <h2><br />No Logs for Today ({today})</h2> :
      <>
        <h2>Today's Attendance Log ({today})</h2>

        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Log ID</th>
              <th>Status</th>
              <th>Login Time</th>
              <th>Logout Time</th>
            </tr>
          </thead>
          <tbody>
            {todaysLogs.map((data) => (
              <tr key={data.log_id} 
                className={`${data.work_status === 'Leave' ? 
                'leave' : (data.work_status === 'In-Office' ? 'office': 
                (data.work_status === 'Client Office' ? 'client-office': 'wfh'))}`}>
                <td>{data.employee_string_id}</td>
                <td>{data.log_id}</td>
                <td>{data.work_status}</td>  
                {data.work_status === 'Leave' ? (
                  <td colSpan={2}>{formatTime(data.login_time)}</td>
                ) : (
                  <>
                    <td>{formatTime(data.login_time)}</td>
                    {data.logout_time === null ? (
                      <td>Unmarked</td>
                    ) : (
                      <td>{formatTime(data.logout_time)}</td> 
                    )}
                  </>
                )}
              </tr>
            ))} 
          </tbody>
        </table>
      </>
      }
    </div>
  )
}

export default AdminHome