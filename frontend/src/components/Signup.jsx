import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axiosInstance from '../api/axios'
import '../css/Signup.css'

const Signup = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [projectInvolved, setProjectInvolved] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage('')
        setSuccessMessage('')

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.')
            return
        }

        setIsLoading(true)

        try {
            const response = await axiosInstance.post('auth/register/', {
                first_name: firstName,
                last_name: lastName,
                project_involved: projectInvolved,
                password: password,
                password_confirm: confirmPassword
            })

            const employeeId = response.data.employee_id

            setSuccessMessage(`Success! Your Employee ID is: ${employeeId}. Contact Administrator for Approval`)
            
            setTimeout(() => {
                navigate('/login')
            }, 2000)

        } catch (error) {
            if (error.response && error.response.data) {
                const firstErrorField = Object.values(error.response.data)[0]
                setErrorMessage(firstErrorField[0]) 
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="signup-container">
            <div className="outer-wrapper">
                <div className="signup-form-box">
                    <h2 className="signup-title">Welcome to Logs</h2><br />
                    
                    {errorMessage && <div className="signup-error">{errorMessage}</div>}
                    {successMessage && <div className="signup-success">{successMessage}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="name-row">
                            <div className="name-col">
                                <label className="signup-label">First Name</label>
                                <input 
                                    type="text" 
                                    value={firstName} 
                                    onChange={(e) => setFirstName(e.target.value)} 
                                    className="signup-input" 
                                    placeholder="Vishal"
                                    required 
                                />
                            </div>
                            <div className="name-col">
                                <label className="signup-label">Last Name</label>
                                <input 
                                    type="text" 
                                    value={lastName} 
                                    onChange={(e) => setLastName(e.target.value)} 
                                    className="signup-input" 
                                    placeholder="M"
                                    required 
                                />
                            </div>
                        </div>

                        <label className="signup-label">Project</label>
                        <input 
                            type="text" 
                            value={projectInvolved} 
                            onChange={(e) => setProjectInvolved(e.target.value)} 
                            className="signup-input standalone" 
                            placeholder="e.g. BitHab, Teno"
                        />

                        <label className="signup-label">Create Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="signup-input standalone" 
                            placeholder="Enter your passwword"
                            required 
                        />

                        <label className="signup-label">Confirm Password</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            className="signup-input standalone" 
                            placeholder="Re-enter the password"
                            required 
                        />

                        <button type="submit" disabled={isLoading || successMessage !== ''} className="signup-button">
                            {isLoading ? 'Creating Account' : 'Register'}
                        </button>
                    </form>

                    <div className="signup-footer">
                        <span>Already registered? </span>
                        <Link to="/login" className="sign-up-link">Log In</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup