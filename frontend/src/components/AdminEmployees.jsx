import React, { useEffect, useState } from 'react'
import '../css/Employee.css'
import axiosInstance from '../api/axios'

const AdminEmployees = () => {
  const [employeeData, setEmployeeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [search, setSearch] = useState('')
  const [project, setProject] = useState('')
  const [active, setActive] = useState('')

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axiosInstance.get('employees/')
        const logs = response.data
        const sortedLogs = [...logs].sort((a, b) => a.id - b.id)

        setEmployeeData(sortedLogs)
      } catch (error) {
        console.error(error)
        setErrorMsg('Could not retrieve current data')
      } finally {
        setLoading(false)
      }
    }

    fetchEmployeeData()
  }, [])

  const handleDelete = async (id, currentStatus) => {
    const actionText = currentStatus ? 'deactivate' : 'activate'

    if (!window.confirm(`ATTENTION! Are you sure you want to ${actionText} the user?`)) {
      return
    }

    try {
      await axiosInstance.patch(`employees/${id}/`, {
        is_active: !currentStatus
      })

      setEmployeeData(prev => prev.map(log => 
        log.id === id ? { ...log, is_active: !currentStatus } : log
      ))
    } catch (error) {
      console.error(error)
      setErrorMsg(`FAILED: Could not ${actionText} employee`)
    }
  }

  const filteredEmployees = employeeData ? employeeData.filter(emp => {
    const safeEmployeeId = (emp.employee_id || "").toLowerCase()
    const empIdMatch = safeEmployeeId.includes(search.toLowerCase())

    const safeProject = (emp.project_involved || "").toLowerCase()
    const projectMatch = safeProject.includes(project.toLowerCase())

    let activeMatch = true
    if (active !== '') {
      activeMatch = emp.is_active === active
    }

    return empIdMatch && projectMatch && activeMatch && !emp.is_admin
  }) : []

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
          <label>Projects: </label>
          <input 
            type='text' 
            placeholder='Search Project' 
            value={project} 
            onChange={(e) => setProject(e.target.value)}
          />
        </div>
        <div className='search-field'>
          <label>Employee Active Status:</label>
          <select 
            value={active} 
            onChange={(e) => {
              const selected = e.target.value

              if (selected === "all") setActive('')
              if (selected === "true") setActive(true)
              if (selected === "false") setActive(false)
            }}
            required
          >
            <option value='all'>Show All</option>
            <option value='true'>Active</option>
            <option value='false'>Inactive</option>
          </select>
        </div>
      </div>

      {filteredEmployees.length === 0 ? <h2><br />No Matching Records</h2> :
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
            {filteredEmployees.map((data) => (
              !data.is_admin && (
                <tr key={data.id} className={data.is_active ? 'active-emp' : 'not-active-emp'}>
                  <td>{data.employee_id}</td>
                  <td>{data.project_involved}</td>
                  <td>{data.is_active ? 'Yes' : 'No'}</td>
                  <td>
                    <button onClick={() => handleDelete(data.id, data.is_active)}>
                      {data.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      }
    </div>
  )
}

export default AdminEmployees