import React, {useEffect, useState} from 'react';
import '../css/History.css';
import axiosInstance from '../api/axios';

const AdminEmployees = () => {
  const [EmployeeData, SetEmployeeData] = useState(null)
  const [Loading, SetLoading] = useState(true)
  const [ErrorMsg, SetError] = useState('')

  useEffect(() => {
      const fetchEmployeeData = async () => {
        try {
          const Response = await axiosInstance.get('employees/')
          const Logs = Response.data
          const sortedLogs = [...Logs].sort((a, b) => a.id - b.id);

          SetEmployeeData(sortedLogs)
        }
        catch (Error) {
          console.error(Error)
          SetError('Could not retrieve current data')
        }
        finally {
          SetLoading(false)
        }
      }

      fetchEmployeeData()
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
      <h2>Employee Data</h2>

      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Project</th>
            <th>IsActive</th>
          </tr>
        </thead>
        <tbody>
          {EmployeeData.map((Data) => (
            (!Data.IsAdmin) && (
            <tr key={Data.id}>
              <td>{Data.EmployeeId}</td>
              <td>{Data.ProjectInvolved}</td>
              <td>{Data.IsActive ? 'Yes' : 'No'}</td>
            </tr>
          )))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminEmployees