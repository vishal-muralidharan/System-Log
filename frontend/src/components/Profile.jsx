import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import '../css/Profile.css';

const Profile = () => {
    const [ProfileData, SetProfileData] = useState(null);
    const [IsLoading, SetIsLoading] = useState(true);
    const [ErrorMessage, SetErrorMessage] = useState('');

    useEffect(() => {
        const FetchProfile = async () => {
            try {
                const Response = await axiosInstance.get('employees/');
                
                if (Response.data && Response.data.length > 0) {
                    SetProfileData(Response.data[0]);
                } else {
                    SetErrorMessage('Profile data not found.');
                }
            } catch (ErrorObj) {
                console.error(ErrorObj);
                SetErrorMessage('Failed to load profile details.');
            } finally {
                SetIsLoading(false);
            }
        };

        FetchProfile();
    }, []);

    if (IsLoading) return <div className="loading-text">Loading profile...</div>;

    return (
        <div className="profile-container">
            <h2 className="profile-title">Employee Profile</h2>

            <div className="profile-card">
                {ErrorMessage && <div className="error-message">{ErrorMessage}</div>}

                {ProfileData && (
                    <div>
                        <div className="profile-avatar">
                            {ProfileData.EmployeeId ? ProfileData.EmployeeId.slice(-2) : 'ID'}
                        </div>

                        <div>
                            <span className={`profile-badge ${ProfileData.IsAdmin ? 'badge-admin' : 'badge-standard'}`}>
                                {ProfileData.IsAdmin ? 'Administrator' : 'Standard Employee'}
                            </span>
                        </div>

                        <div className="profile-label">Employee ID</div>
                        <div className="profile-value">{ProfileData.EmployeeId}</div>

                        <div className="profile-label">Assigned Project</div>
                        <div className="profile-value">{ProfileData.ProjectInvolved || 'Unassigned'}</div>

                        <div className="profile-label">Account Status</div>
                        <div className="profile-value no-border">
                            {ProfileData.IsActive ? (
                                <span className="status-active">Active</span>
                            ) : (
                                <span className="status-inactive">Inactive</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;