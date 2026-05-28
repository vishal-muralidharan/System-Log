import React, {useEffect, useState} from 'react';
import '../css/History.css';
import axiosInstance from '../api/axios';

const History = () => {
  const [HistoryData, SetHistoryData] = useState(null)
  const [Loading, SetLoading] = useState(true)
  const [ErrorMsg, SetError] = useState('')

  useEffect(() => {
      const fetchHistoryData = async () => {
        try {
          const Response = await axiosInstance.get('attendance/?ordering=LoginTime')
          const Logs = Response.data
          console.log(Logs)
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
          {HistoryData.map((Data) => (
            <tr key={Data.LogId} 
            className={`${Data.WorkStatus === 'Leave' ? 
            'leave' : (Data.WorkStatus === 'In-Office' ? 'office': 'wfh')}`}>
              <td>{Data.LogId}</td>
              <td>{FormatDate(Data.LoginTime)}</td>
              <td>{Data.WorkStatus}</td>
              <td>{FormatTime(Data.LoginTime)}</td>
              <td>{Data.LogoutTime === null ? 'Unmarked' : (Data.WorkStatus === 'Leave' ? '-' : FormatTime(Data.LogoutTime))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default History;