import React, { useEffect, useState } from 'react'
import '../css/Home.css'
import axiosInstance from '../api/axios'

const Home = () => {
    const [attendanceData, setAttendanceData] = useState(null)
    const [status, setStatus] = useState('In-Office')
    const [loading, setLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
      const fetchTodayStatus = async () => {
        try {
          const response = await axiosInstance.get('attendance/?ordering=-login_time')
          const logs = response.data

          if (logs.length > 0) {
            const latestLog = logs[0]

            const logDate = new Date(latestLog.login_time).toLocaleDateString()
            const today = new Date().toLocaleDateString()

            if (logDate === today) {
              setAttendanceData(latestLog)
            }
          }
        }
        catch (error) {
          console.error(error)
          setErrorMsg('Could not retrieve current data ')
        }
        finally {
          setLoading(false)
        }
      }

      fetchTodayStatus()
    }, [])

    const handleClockIn = async (event) => {
      event.preventDefault() // Added to prevent the form from reloading the page
      setLoading(true)
      setErrorMsg('')

      try {
        const response = await axiosInstance.post('attendance/login/', {
          work_status: status
        })

        setAttendanceData(response.data)
      }
      catch (error) {
        console.error(error)
        setErrorMsg('Error in marking Log-In Data')
      }
      finally {
        setLoading(false)
      }
    }

    const handleClockOut = async () => {
      setLoading(true)
      setErrorMsg('')

      try {
        const response = await axiosInstance.post('attendance/logout/')

        setAttendanceData(prev => ({
          ...prev, 
          logout_time: response.data.logout_time
        }))
      }
      catch (error) {
        console.error(error)
        setErrorMsg('Error in marking Log-Out Data')
      }
      finally {
        setLoading(false)
      }
    }

    const formatTime = (isoString) => {
        if (!isoString) return '--:--:--'
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }

    if (loading) {
      return (
        <h2 className='condition loading'>Loading your status...</h2>
      )
    }

    return (
        <>
            {errorMsg && <h2 className='condition error'>{errorMsg}</h2>}
            
            {/* Condition 1: Log-in not done for the day */}
            {!attendanceData ? (
                <div className='condition condition1'>
                    <h2>You have not marked Log-in for the day</h2>
                    <form onSubmit={handleClockIn}>
                        <label>Select your work status:</label>
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            required
                        >
                            <option value="Choose your status" disabled hidden>Choose your status</option>
                            <option value="In-Office">In-Office</option>
                            <option value="Work From Home">Work From Home</option>
                            <option value="Leave">Leave</option>
                            <option value="Client Office">Client Office</option>
                        </select>
                        <button type='submit'>Mark Login</button>
                    </form>
                </div>
            ) : (attendanceData && !attendanceData.logout_time) ? (
                <div className='condition condition2'>
                    {/* Condition 2: Log-in completed but Log-out not done for the day */}
                    <h2>You have not marked your Log-out for the day</h2>
                    <h4>Login Time: {formatTime(attendanceData.login_time)}</h4>
                    <h4>Status: {attendanceData.work_status}</h4>
                    <button onClick={handleClockOut}>Mark Logout</button>
                </div>
            ) : (
                <div className='condition condition3'>
                    {/* Condition 3: Log-in and Log-out completed for the day */}
                    {!(attendanceData.work_status === 'Leave') && <h2>You have marked both your Log-in and Log-out</h2>}
                    {(attendanceData.work_status === 'Leave') && <h2>Your Leave has been marked</h2>}
                    
                    <h3>Login Time: {formatTime(attendanceData.login_time)}</h3>
                    {!(attendanceData.work_status === 'Leave') && <h3>Logout Time: {formatTime(attendanceData.logout_time)}</h3>}
                    <h3>Status: {attendanceData.work_status}</h3>
                    
                    {!(attendanceData.work_status === 'Leave') && <h2>Great job!</h2>}
                    <h2>See you tomorrow!</h2>
                </div>            
            )}
        </>
    )
}

export default Home