import React, {useEffect, useState} from 'react';
import '../css/Home.css';
import axiosInstance from '../api/axios';

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
    }, []
  )

  const TodaysLogs =  HistoryData ? HistoryData.filter(Emp => {
    return (new Date(Emp.LoginTime).toLocaleDateString() === Today)
  }) : []
  
  const FormatTime = (isoString) => {
    if (!isoString) return '--:--:--';
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const FormatDate = (IsoString) => {
        if (!IsoString) return '--';
        return new Date(IsoString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (Loading) {
    return (
      <h2 className='condition loading'>Loading your history...</h2>
    )
  }

  return (
    <div className='outer'>
      {TodaysLogs.length === 0 ? <h2><br />No Logs for Today ({Today})</h2> :
      <>
        <h2>Today's Attendance Log ({Today})</h2>

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
            {TodaysLogs.map((Data) => (
                  <tr key={Data.LogId} 
                  className={`${Data.WorkStatus === 'Leave' ? 
                  'leave' : (Data.WorkStatus === 'In-Office' ? 'office': 
                  (Data.WorkStatus === 'Client Office' ? 'client-office': 'wfh'))}`}>
                    <td>{Data.EmployeeStringId}</td>
                    <td>{Data.LogId}</td>
                    <td>{Data.WorkStatus}</td>  
                    {Data.WorkStatus === 'Leave' ? (
                        <td colSpan={2}>{FormatTime(Data.LoginTime)}</td>
                    ) : (
                        <>
                            <td>{FormatTime(Data.LoginTime)}</td>
                            {Data.LogoutTime === null ? (
                                <td>Unmarked</td>
                            ) : (
                                <td>{FormatTime(Data.LogoutTime)}</td> 
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