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

  const FormatDate = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className='outer'>
      <h2>Attendance Log History</h2>

      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Status</th>
            <th>Login Time</th>
            <th>Logout Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hello</td>
            <td>Hello</td>
            <td>Hello</td>
            <td>Hello</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default History;