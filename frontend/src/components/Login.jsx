import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axiosInstance from '../api/axios'
import '../css/Login.css'

const Login = () => {
    const [employeeId, setEmployeeId] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        setErrorMessage('')
        setIsLoading(true)

        try {
            const loginResponse = await axiosInstance.post('auth/login/', {
                employee_id: employeeId, 
                password: password
            })

            localStorage.setItem('access_token', loginResponse.data.access)
            localStorage.setItem('refresh_token', loginResponse.data.refresh)
            axiosInstance.defaults.headers.Authorization = `Bearer ${loginResponse.data.access}`

            const profileResponse = await axiosInstance.get('employees/')
            const userProfile = profileResponse.data[0]

            if (userProfile) {
                if (userProfile.is_active) {
                    if (userProfile.is_admin) {
                        navigate('/admin')
                    } else {
                        navigate('/dashboard')
                    }
                } else {
                    setErrorMessage('User does not have an active account. Contact Administrator for details.')
                }
            }
        } catch (error) {
            setErrorMessage('Invalid credentials. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="login-container">
            <div className="login-form-box">
                
                <h2 className="login-title">Welcome back</h2> <br />
                
                <form onSubmit={handleSubmit}>
                    <label className="login-label">Employee ID</label>
                    <input
                        type="text"
                        value={employeeId}
                        onChange={(event) => setEmployeeId(event.target.value)}
                        className="login-input"
                        placeholder="e.g. EMP0001"
                        required
                    />
                    
                    <label className="login-label">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="login-input"
                        placeholder="Enter your password"
                        required
                    />
                    
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="login-button"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>

                    {errorMessage && (
                        <div className="login-error">
                            {errorMessage}
                        </div>
                    )}
                </form>
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
                    <span>Don't have an account? </span>
                    <Link to="/signup" className='sign-up' style={{ textDecoration: 'none' }}>Sign Up</Link>
                </div>
            </div>
        </div>
    )
}

export default Login