import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import '../css/Signup.css';

const Signup = () => {
    // New State for Names
    const [FirstName, SetFirstName] = useState('');
    const [LastName, SetLastName] = useState('');
    const [ProjectInvolved, SetProjectInvolved] = useState('');
    const [Password, SetPassword] = useState('');
    const [ConfirmPassword, SetConfirmPassword] = useState('');
    
    const [ErrorMessage, SetErrorMessage] = useState('');
    const [SuccessMessage, SetSuccessMessage] = useState('');
    const [IsLoading, SetIsLoading] = useState(false);
    const NavigateTo = useNavigate();

    const HandleSubmit = async (EventObj) => {
        EventObj.preventDefault();
        SetErrorMessage('');
        SetSuccessMessage('');

        if (Password !== ConfirmPassword) {
            SetErrorMessage('Passwords do not match.');
            return;
        }

        SetIsLoading(true);

        // Auto-generate a secure 5-digit Employee ID
        const GeneratedID = 'EMP' + Math.floor(10000 + Math.random() * 90000);

        try {
            await axiosInstance.post('auth/register/', {
                EmployeeId: GeneratedID,
                password: Password,
                ProjectInvolved: ProjectInvolved,
                // Passing names in case your backend is configured to accept them
                first_name: FirstName, 
                last_name: LastName    
            });

            // Display the new ID to the user so they can log in!
            SetSuccessMessage(`Success! Your Employee ID is: ${GeneratedID}. Redirecting...`);
            
            setTimeout(() => {
                NavigateTo('/login');
            }, 4000); // Give them 4 seconds to read their new ID before redirecting

        } catch (ErrorObj) {
            if (ErrorObj.response && ErrorObj.response.data) {
                SetErrorMessage(JSON.stringify(ErrorObj.response.data));
            } else {
                SetErrorMessage('Registration failed. Please try again.');
            }
        } finally {
            SetIsLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="outer-wrapper">
                <div className="signup-form-box">
                    <h2 className="signup-title">Employee Onboarding</h2>
                    <p className="signup-subtitle">Enter your details to generate your credentials.</p>
                    
                    {ErrorMessage && <div className="signup-error">{ErrorMessage}</div>}
                    {SuccessMessage && <div className="signup-success">{SuccessMessage}</div>}

                    <form onSubmit={HandleSubmit}>
                        
                        <div className="name-row">
                            <div className="name-col">
                                <label className="signup-label">First Name</label>
                                <input 
                                    type="text" 
                                    value={FirstName} 
                                    onChange={(E) => SetFirstName(E.target.value)} 
                                    className="signup-input" 
                                    placeholder="Jane"
                                    required 
                                />
                            </div>
                            <div className="name-col">
                                <label className="signup-label">Last Name</label>
                                <input 
                                    type="text" 
                                    value={LastName} 
                                    onChange={(E) => SetLastName(E.target.value)} 
                                    className="signup-input" 
                                    placeholder="Doe"
                                    required 
                                />
                            </div>
                        </div>

                        <label className="signup-label">Project / Department</label>
                        <input 
                            type="text" 
                            value={ProjectInvolved} 
                            onChange={(E) => SetProjectInvolved(E.target.value)} 
                            className="signup-input standalone" 
                            placeholder="e.g. Engineering"
                        />

                        <label className="signup-label">Create Password</label>
                        <input 
                            type="password" 
                            value={Password} 
                            onChange={(E) => SetPassword(E.target.value)} 
                            className="signup-input standalone" 
                            placeholder="••••••••"
                            required 
                        />

                        <label className="signup-label">Confirm Password</label>
                        <input 
                            type="password" 
                            value={ConfirmPassword} 
                            onChange={(E) => SetConfirmPassword(E.target.value)} 
                            className="signup-input standalone" 
                            placeholder="••••••••"
                            required 
                        />

                        <button type="submit" disabled={IsLoading || SuccessMessage !== ''} className="signup-button">
                            {IsLoading ? 'Generating ID...' : 'Complete Registration'}
                        </button>
                    </form>

                    <div className="signup-footer">
                        <span>Already registered? </span>
                        <Link to="/login" className="sign-up-link">Log In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;