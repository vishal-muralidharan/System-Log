import React, {useEffect, useState} from 'react';
import '../Home.css';
import axiosInstance from '../api/axios';

const Home = () => {
    const [AttendanceData, SetAttendanceData] = useState(null)
    const [Status, SetStatus] = useState('In-Office')
    const [Loading, SetLoading] = useState(true)
    const [ErrorMsg, SetError] = useState('')
    const Condition = 1;

    useEffect(() => {
      const fetchTodayStatus = async () => {
        try {
          const Response = await axiosInstance.get('attendance/?ordering=LoginTime')
          const Logs = Respone.data

          if (Logs.length > 0) {
            const LatestLog = Logs[0]

            const LogDate = new Date(LatestLog.LoginTime).toLocaleDateString()
            const Today = new Date().toLocaleDateString()

            if (LogDate = Today) {
              SetAttendanceData(LatestLog)
            }
          }
        }
        catch (Error) {
          console.error(Error)
          SetErrorMessage('Could not retrieve current status')
        }
        finally {
          SetLoading(false)
        }
      }
      fetchTodayStatus()
    }, [])

    const HandleClockIn = async () => {
      SetLoading(true)
      SetError('')

      try {
        const Response = await axiosInstance.post('attendance/login/', {
          WorkStatus: Status
        })

        SetAttendanceData(Response.data)
      }
      catch (Error) {
        console.error(Error)
        SetError('Error in marking Log-In Data')
      }
      finally {
        SetLoading(false)
      }
    }

    const HandleClockOut = async () => {
      SetLoading(true)
      SetError('')

      try {
        const Response = await axiosInstance.post('attendance/logout/')

        SetAttendanceData(prev => ({
          ...prev, 
          LogoutTime: Response.data.LogoutTime
        }))
      }
      catch (Error) {
        console.error(Error)
        SetError('Error in marking Log-Out Data')
      }
      finally {
        SetLoading(false)
      }
    }

    const FormatTime = (isoString) => {
        if (!isoString) return '--:--:--';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const FormatDate = () => {
        return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    };

    if (Loading) {
      return (
        <h2 className='condition loading'>Loading your status...</h2>
      )
    }

    return (
        <>
            {ErrorMsg && <h2 className='condition error'>{ErrorMsg}</h2>}
            {/* Condition 1: Log-in not done for the day */}
            {!AttendanceData ? (
                <div className='condition condition1'>
                    <h2>You have not marked Log-in for the day</h2>
                    <form>
                        <label>Select your work status:</label>
                        <select 
                        defaultValue="Choose your status" 
                        value={Status} 
                        onChange={(e) => SetStatus(e.target.value)}
                        required>
                            <option value="Choose your status" disabled hidden>Choose your status</option>
                            <option value="In-Office">In-Office</option>
                            <option value="Work From Home">Work From Home</option>
                            <option value="Leave">Leave</option>
                        </select>
                        <button type='submit' onClick={HandleClockIn}>Mark Login</button>
                    </form>
                </div>
            ) : (AttendanceData && !AttendanceData.LogoutTime) ? (
                <div className='condition condition2'>
                    {/* Condition 2: Log-in completed but Log-out not done for the day */}
                    <h2>You have not marked your Log-out for the day</h2>
                    <h4>Login Time: {FormatTime(AttendanceData.LoginTime)}</h4>
                    <h4>Status: {AttendanceData.WorkStatus}</h4>
                    <button onClick={HandleClockOut}>Mark Logout</button>
                </div>
            ) : (
                <div className='condition condition3'>
                    {/* Condition 3: Log-in and Log-out completed for the day */}
                    <h2>You have marked both your Log-in and Log-out</h2>
                    <h3>Login Time: {FormatTime(AttendanceData.LoginTime)}</h3>
                    {!(AttendanceData.WorkStatus === 'Leave') && <h3>Logout Time: {FormatTime(AttendanceData.LogoutTime)}</h3>}
                    <h3>Status: {AttendanceData.WorkStatus}</h3>
                    <h2>Great job! See you tomorrow!</h2>
                </div>            
            )}
        </>
    );
}

export default Home;