import React, { useEffect, useState } from 'react'
import '../css/History.css'
import axiosInstance from '../api/axios'

const History = () => {
  const [historyData, setHistoryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
      const fetchHistoryData = async () => {
        try {
          const response = await axiosInstance.get('attendance/?ordering=login_time')
          const logs = response.data
          setHistoryData(logs)
        }
        catch (error) {
          console.error(error)
          setErrorMsg('Could not retrieve current data')
        }
        finally {
          setLoading(false)
        }
      }

      fetchHistoryData()
    }, []
  )
  
  const formatTime = (isoString) => {
    if (!isoString) return '--:--:--'
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const formatDate = (isoString) => {
        if (!isoString) return '--'
        return new Date(isoString).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <h2 className='condition loading'>Loading your history...</h2>
    )
  }

  return (
    <div className='outer'>
      {historyData.length === 0 ? <h2><br />No Attendance Records Marked yet.</h2>:
      <div>
        <h2>Attendance Log History</h2>
        <table>
          <thead>
            <tr>
              <th>Log ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Login Time</th>
              <th>Logout Time</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((data) => (
              <tr key={data.log_id} 
              className={`${data.work_status === 'Leave' ? 
              'leave' : (data.work_status === 'In-Office' ? 'office': 
              (data.work_status === 'Client Office' ? 'client-office': 'wfh'))}`}>
                <td>{data.log_id}</td>
                <td>{formatDate(data.login_time)}</td>
                <td>{data.work_status}</td>
                <td>{formatTime(data.login_time)}</td>
                <td>{data.logout_time === null ? 'Unmarked' : (data.work_status === 'Leave' ? '-' : formatTime(data.logout_time))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      }
    </div>
  )
}

export default History