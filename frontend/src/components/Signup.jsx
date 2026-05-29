import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import '../css/Signup.css';

const Signup = () => {
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

        try {
            const response = await axiosInstance.post('auth/register/', {
                FirstName: FirstName,
                LastName: LastName,
                ProjectInvolved: ProjectInvolved,
                password: Password,
                password_confirm: ConfirmPassword
            });

            const EmployeeID = response.data.EmployeeId;

            SetSuccessMessage(`Success! Your Employee ID is: ${EmployeeID}. Contact Administrator for Approval`);
            
            setTimeout(() => {
                NavigateTo('/login');
            }, 2000);

        } catch (error) {
            if (error.response && error.response.data) {
                const firstErrorField = Object.values(error.response.data)[0];
                SetErrorMessage(firstErrorField[0]); 
            } else {
                SetErrorMessage("An unexpected error occurred. Please try again.");
            }
        } finally {
            SetIsLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="outer-wrapper">
                <div className="signup-form-box">
                    <h2 className="signup-title">Welcome to Logs</h2><br />
                    
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
                                    placeholder="Vishal"
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
                                    placeholder="M"
                                    required 
                                />
                            </div>
                        </div>

                        <label className="signup-label">Project</label>
                        <input 
                            type="text" 
                            value={ProjectInvolved} 
                            onChange={(E) => SetProjectInvolved(E.target.value)} 
                            className="signup-input standalone" 
                            placeholder="e.g. BitHab, Teno"
                        />

                        <label className="signup-label">Create Password</label>
                        <input 
                            type="password" 
                            value={Password} 
                            onChange={(E) => SetPassword(E.target.value)} 
                            className="signup-input standalone" 
                            placeholder="Enter your passwword"
                            required 
                        />

                        <label className="signup-label">Confirm Password</label>
                        <input 
                            type="password" 
                            value={ConfirmPassword} 
                            onChange={(E) => SetConfirmPassword(E.target.value)} 
                            className="signup-input standalone" 
                            placeholder="Re-enter the password"
                            required 
                        />

                        <button type="submit" disabled={IsLoading || SuccessMessage !== ''} className="signup-button">
                            {IsLoading ? 'Creating Account' : 'Register'}
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