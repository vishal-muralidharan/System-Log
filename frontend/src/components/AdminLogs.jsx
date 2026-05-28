import React, {useEffect, useState} from 'react';
import '../css/History.css';
import axiosInstance from '../api/axios';

const AdminLogs = () => {
  const [HistoryData, SetHistoryData] = useState(null)
  const [Loading, SetLoading] = useState(true)
  const [ErrorMsg, SetError] = useState('')
  const [Search, SetSearch] = useState('')
  const [Filter, SetFilter] = useState('')

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
  
  const HandleDelete = async (ID) => {
    if (!window.confirm('You are about to permanently delete a record. Are you sure?'))
      return

    try {
      axiosInstance.delete(`/attendance/${ID}/`)
      SetHistoryData(Prev => Prev.filter(Logs => Logs.LogId !== ID))
    }
    catch (Error) {
      console.error(Error)
      SetError('Could not delete Log Data')
    }
  }

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
      <div>
          <input 
            type='text' 
            placeholder='Search Employee ID' 
            value={Search} 
            onChange={(e) => SetSearch(e.target.value)}
          />
          <label>Logs before:</label>
          <input type='date' value={Filter} onChange={(e) => SetFilter(e.target.value)} />
      </div>

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
          {HistoryData.map((Data) => (
            <tr key={Data.LogId} 
            className={`${Data.WorkStatus === 'Leave' ? 
            'leave' : (Data.WorkStatus === 'In-Office' ? 'office': 
            (Data.WorkStatus === 'Client Office' ? 'client-office': 'wfh'))}`}>
              <td>{Data.LogId}</td>
              <td>{Data.EmployeeStringId}</td>
              <td>{FormatDate(Data.LoginTime)}</td>
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
              <td><button onClick={() => HandleDelete(Data.LogId)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminLogs