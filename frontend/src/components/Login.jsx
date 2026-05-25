import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AxiosInstance from '../api/axios'

const Login = () => {
  const [EmployeeId, SetEmployeeId] = useState('')
  const [Password, SetPassword] = useState('')
  const [ErrorMessage, SetErrorMessage] = useState('')
  const [IsLoading, SetIsLoading] = useState(false)
  const NavigateTo = useNavigate()

  const HandleSubmit = async (Event) => {
    Event.preventDefault()
    SetErrorMessage('')
    SetIsLoading(true)

    try {
      const LoginResponse = await AxiosInstance.post('auth/login/', {
        EmployeeId: EmployeeId,
        password: Password
      })

      localStorage.setItem('access_token', LoginResponse.data.access)
      localStorage.setItem('refresh_token', LoginResponse.data.refresh)
      AxiosInstance.defaults.headers.Authorization = `Bearer ${LoginResponse.data.access}`

      NavigateTo('/dashboard')
    } catch (ErrorObj) {
      SetErrorMessage('Invalid credentials.')
    } finally {
      SetIsLoading(false)
    }
  }

  return (
    <div>
      <div>
         SYSTEM.LOGIN
        {ErrorMessage && (
          <div>
            {ErrorMessage}
          </div>
        )}
        
        <form onSubmit={HandleSubmit}>
          <label>Employee ID</label>
          <input
            type="text"
            value={EmployeeId}
            onChange={(Event) => SetEmployeeId(Event.target.value)}
            required
          /> <br />
          
          <label>Password</label>
          <input
            type="password"
            value={Password}
            onChange={(Event) => SetPassword(Event.target.value)}
            required
          /> <br />
          
          <button type="submit" disabled={IsLoading}>
            {IsLoading ? 'AUTHENTICATING...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login