import React, {useEffect, useState} from 'react';
import '../css/History.css';
import axiosInstance from '../api/axios';

const AdminLogs = () => {
  const [HistoryData, SetHistoryData] = useState(null)
  const [Loading, SetLoading] = useState(true)
  const [ErrorMsg, SetError] = useState('')
  const [Search, SetSearch] = useState('')
  const [Filter, SetFilter] = useState('')
  const [StatusFilter, SetStatusFilter] = useState('')

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

  const FilteredLogs = HistoryData ? HistoryData.filter(Log => {
    const SafeSearch = (Search || "").toLowerCase()
    const SearchMatch = Log.EmployeeStringId.includes(SafeSearch)

    let DateMatch = true
    if (Filter && Log.LoginTime) {
      const LogDate = new Date(Log.LoginTime).setHours(0, 0, 0, 0)
      const SelectedDate = new Date(Filter).setHours(0, 0, 0, 0)

      DateMatch = LogDate <= SelectedDate
    }

    const SafeStatus = (StatusFilter || "")
    const StatusMatch = Log.WorkStatus.includes(SafeStatus)

    return SearchMatch && DateMatch && StatusMatch
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
      <div className='search'>
        <div className='search-field'>
          <label>Employee ID:</label>
          <input 
            type='text' 
            placeholder='Search Employee ID' 
            value={Search} 
            onChange={(e) => SetSearch(e.target.value)}
          />
        </div>
        <div className='search-field'>
          <label>Logs on or before:</label>
          <input 
            type='date' 
            value={Filter} 
            onChange={(e) => SetFilter(e.target.value)} 
          />
        </div>
        <div className='search-field'>
          <label>Logs Status:</label>
          <select 
            value={StatusFilter} 
            onChange={(e) => SetStatusFilter(e.target.value)}
            required>
                <option value="">Show All</option>
                <option value="In-Office">In-Office</option>
                <option value="Work From Home">Work From Home</option>
                <option value="Leave">Leave</option>
                <option value="Client Office">Client Office</option>
          </select>
        </div>
      </div>

      {FilteredLogs.length === 0 ? <h2><br />No Matching Logs</h2> :
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
          {FilteredLogs.map((Data) => (
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
      }
    </div>
  )
}

export default AdminLogs