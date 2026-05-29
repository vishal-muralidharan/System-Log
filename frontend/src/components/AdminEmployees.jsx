import React, {useEffect, useState} from 'react';
import '../css/Employee.css';
import axiosInstance from '../api/axios';

const AdminEmployees = () => {
  const [EmployeeData, SetEmployeeData] = useState(null)
  const [Loading, SetLoading] = useState(true)
  const [ErrorMsg, SetError] = useState('')
  const [Search, SetSearch] = useState('')
  const [Project, SetProject] = useState('')
  const [Active, SetActive] = useState(null)

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

  const HandleDelete = async (ID, CurrentStatus) => {
    const ActionText = CurrentStatus ? 'deactivate' : 'activate';

    if (!window.confirm(`ATTENTION! Are you sure you want to ${ActionText} the user?`))
        return

    try {
        await axiosInstance.patch(`employees/${ID}/`, 
          {
            IsActive: !CurrentStatus
          }
        )

        SetEmployeeData(Prev => Prev.map(Log => 
          Log.id === ID ? {...Log, IsActive: !CurrentStatus} : Log
        ))
    }
    catch (Error) {
        console.error(Error)
        SetError(`FAILED: Could not ${ActionText} employee`)
    }
  }

  const FilteredEmployees = EmployeeData ? EmployeeData.filter (Emp => {
    const SafeEmployeeId = (Emp.EmployeeId || "").toLowerCase()
    const EmpIDMatch = SafeEmployeeId.includes(Search.toLowerCase())

    const SafeProject = (Emp.ProjectInvolved || "").toLowerCase()
    const ProjectMatch = SafeProject.includes(Project.toLowerCase())

    let ActiveMatch = true
    if (Active !== null) {
      ActiveMatch = Emp.IsActive === Active
    }
    console.log(Emp.IsActive, Active)

    return EmpIDMatch && ProjectMatch && ActiveMatch
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
            placeholder='Search Employee ID:' 
            value={Search} 
            onChange={(e) => SetSearch(e.target.value)}
          />
        </div>
        <div className='search-field'>
          <label>Projects: </label>
          <input 
            type='text' 
            placeholder='Search Project:' 
            value={Project} 
            onChange={(e) => SetProject(e.target.value)}
          />
        </div>
        <div className='search-field'>
          <label>Employee Active Status:</label>
          <select 
            value={Active} 
            onChange={(e) => {
                const Selected = e.target.value;
                
                if (Selected === "null") SetActive(null);
                if (Selected === "true") SetActive(true);
                if (Selected === "false") SetActive(false);
              }
            }
            required>
                <option value={null}>Show All</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
          </select>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Project</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {FilteredEmployees.map((Data) => (
            (!Data.IsAdmin) && (
            <tr key={Data.id} className={Data.IsActive ? 'active-emp' : 'not-active-emp'}>
              <td>{Data.EmployeeId}</td>
              <td>{Data.ProjectInvolved}</td>
              <td>{Data.IsActive ? 'Yes' : 'No'}</td>
              <td><button onClick={() => HandleDelete(Data.id, Data.IsActive)}>
                    {Data.IsActive ? 'Deactivate' : 'Activate'}
                  </button></td>
            </tr>
          )))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminEmployees