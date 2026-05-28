import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import '../css/Login.css';

const Login = () => {
    const [EmployeeId, SetEmployeeId] = useState('');
    const [Password, SetPassword] = useState('');
    const [ErrorMessage, SetErrorMessage] = useState('');
    const [IsLoading, SetIsLoading] = useState(false);
    const NavigateTo = useNavigate();

    const HandleSubmit = async (Event) => {
        Event.preventDefault();
        SetErrorMessage('');
        SetIsLoading(true);

        try {
            const LoginResponse = await axiosInstance.post('auth/login/', {
                EmployeeId: EmployeeId,
                password: Password
            });

            localStorage.setItem('access_token', LoginResponse.data.access);
            localStorage.setItem('refresh_token', LoginResponse.data.refresh);
            axiosInstance.defaults.headers.Authorization = `Bearer ${LoginResponse.data.access}`;

            const ProfileResponse = await axiosInstance.get('employees/');
            const UserProfile = ProfileResponse.data[0];
            console.log(UserProfile);

            if (UserProfile) {
                if (UserProfile.IsActive) {
                    if (UserProfile.IsAdmin) {
                        NavigateTo('/admin');
                    } else {
                        NavigateTo('/dashboard');
                    }
                } else {
                    SetErrorMessage('User does not have an active account. Contact Administrator for details.');
                }
            }
        } catch (ErrorObj) {
            SetErrorMessage('Invalid credentials. Please try again.');
        } finally {
            SetIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-box">
                
                <h2 className="login-title">Welcome back</h2>
                <p className="login-subtitle">Please enter your details to sign in.</p>
                
                {ErrorMessage && (
                    <div className="login-error">
                        {ErrorMessage}
                    </div>
                )}
                
                <form onSubmit={HandleSubmit}>
                    <label className="login-label">Employee ID</label>
                    <input
                        type="text"
                        value={EmployeeId}
                        onChange={(Event) => SetEmployeeId(Event.target.value)}
                        className="login-input"
                        placeholder="e.g. EMP0001"
                        required
                    />
                    
                    <label className="login-label">Password</label>
                    <input
                        type="password"
                        value={Password}
                        onChange={(Event) => SetPassword(Event.target.value)}
                        className="login-input"
                        placeholder="Enter your password"
                        required
                    />
                    
                    <button 
                        type="submit" 
                        disabled={IsLoading} 
                        className="login-button"
                    >
                        {IsLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;