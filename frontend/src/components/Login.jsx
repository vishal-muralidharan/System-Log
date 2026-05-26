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
        SetErrorMessage('Invalid credentials. Please try again.')
    } finally {
        SetIsLoading(false)
    }
  }

  
  const ContainerStyle = {
        backgroundColor: '#F0F4F8', 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: '#334155'
  }

  const FormBoxStyle = {
        backgroundColor: '#FFFFFF',
        padding: '50px 50px 70px 50px',
        width: '360px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)', 
        display: 'flex',
        flexDirection: 'column'
  }

  const InputStyle = {
        width: '100%',
        padding: '12px 16px',
        marginBottom: '20px',
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        fontSize: '15px',
        color: '#334155',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s ease'
  }

  const ButtonStyle = {
        width: '100%',
        padding: '14px',
        marginTop: '25px',
        backgroundColor: '#334155', 
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        letterSpacing: '0.5px'
  }

  const ErrorStyle = {
        color: '#EF4444',
        backgroundColor: '#FEF2F2',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        textAlign: 'center',
        border: '1px solid #FCA5A5'
  }

  return (
    <div style={ContainerStyle}>
        <div style={FormBoxStyle}>
            
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#1E293B', textAlign: 'center' }}>
            Welcome back
            </h2>
            <p style={{ margin: '0 0 30px 0', fontSize: '14px', color: '#64748B', textAlign: 'center' }}>
            Please enter your details to sign in.
            </p>
            
            {ErrorMessage && (
            <div style={ErrorStyle}>
                {ErrorMessage}
            </div>
            )}
            
            <form onSubmit={HandleSubmit}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                Employee ID
            </label>
            <input
                type="text"
                value={EmployeeId}
                onChange={(Event) => SetEmployeeId(Event.target.value)}
                style={InputStyle}
                placeholder="e.g. EMP0001"
                required
            />
            
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                Password
            </label>
            <input
                type="password"
                value={Password}
                onChange={(Event) => SetPassword(Event.target.value)}
                style={InputStyle}
                placeholder="Enter your password"
                required
            />
            
            <button 
                type="submit" 
                disabled={IsLoading} 
                style={{...ButtonStyle, opacity: IsLoading ? 0.7 : 1}}
            >
                {IsLoading ? 'Signing in...' : 'Sign In'}
            </button>
            </form>
        </div>
    </div>
  )
}

export default Login