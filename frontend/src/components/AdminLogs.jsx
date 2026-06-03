import React, { useEffect, useState } from 'react'
import '../css/History.css'
import axiosInstance from '../api/axios'

const AdminLogs = () => {
  const [historyData, setHistoryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

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
  
  const handleDelete = async (id) => {
    if (!window.confirm('You are about to permanently delete a record. Are you sure?')) {
      return
    }

    try {
      await axiosInstance.delete(`/attendance/${id}/`)
      setHistoryData(prev => prev.filter(log => log.log_id !== id))
    } catch (error) {
      console.error(error)
      setErrorMsg('Could not delete Log Data')
    }
  }

  const filteredLogs = historyData ? historyData.filter(log => {
    const safeSearch = (search || "").toLowerCase()
    const searchMatch = log.employee_string_id.toLowerCase().includes(safeSearch)

    let dateMatch = true
    if (filter && log.login_time) {
      const logDate = new Date(log.login_time).setHours(0, 0, 0, 0)
      const selectedDate = new Date(filter).setHours(0, 0, 0, 0)
      dateMatch = logDate <= selectedDate
    }

    const safeStatus = (statusFilter || "")
    const statusMatch = log.work_status.includes(safeStatus)

    return searchMatch && dateMatch && statusMatch
  }) : []

  const formatTime = (isoString) => {
    if (!isoString) return '--:--:--'
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const formatDate = (isoString) => {
    if (!isoString) return '--'
    return new Date(isoString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <h2 className='condition loading'>Loading your history...</h2>
    )
  }

  return (
    <div className='outer'>
      <div className='search'>
        <div className='search-field'>
          <label>Employee ID:</label>
          <input 
            type='text' 
            placeholder='Search Employee ID' 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className='search-field'>
          <label>Logs on or before:</label>
          <input 
            type='date' 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
          />
        </div>
        <div className='search-field'>
          <label>Logs Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            required
          >
            <option value="">Show All</option>
            <option value="In-Office">In-Office</option>
            <option value="Work From Home">Work From Home</option>
            <option value="Leave">Leave</option>
            <option value="Client Office">Client Office</option>
          </select>
        </div>
      </div>

      {filteredLogs.length === 0 ? <h2><br />No Matching Logs</h2> :
      <table>
        <thead>
          <tr>
            <th>Log ID</th>
            <th>Employee ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Login Time</th>
            <th>Logout Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((data) => (
            <tr key={data.log_id} 
              className={`${data.work_status === 'Leave' ? 
              'leave' : (data.work_status === 'In-Office' ? 'office': 
              (data.work_status === 'Client Office' ? 'client-office': 'wfh'))}`}>
              <td>{data.log_id}</td>
              <td>{data.employee_string_id}</td>
              <td>{formatDate(data.login_time)}</td>
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
              <td><button onClick={() => handleDelete(data.log_id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      }
    </div>
  )
}

export default AdminLogs