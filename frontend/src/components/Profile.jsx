import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axios'
import '../css/Profile.css'

const Profile = () => {
    const [profileData, setProfileData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get('employees/')
                
                if (response.data && response.data.length > 0) {
                    setProfileData(response.data[0])
                } else {
                    setErrorMessage('Profile data not found.')
                }
            } catch (errorObj) {
                console.error(errorObj)
                setErrorMessage('Failed to load profile details.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [])

    if (isLoading) return <div className="loading-text">Loading profile...</div>

    return (
        <div className="profile-container">
            <h2 className="profile-title">Employee Profile</h2>

            <div className="profile-card">
                {errorMessage && <div className="error-message">{errorMessage}</div>}

                {profileData && (
                    <div>
                        <div className="profile-avatar">
                            {profileData.employee_id ? profileData.employee_id.slice(-2) : 'ID'}
                        </div>

                        <div>
                            <span className={`profile-badge ${profileData.is_admin ? 'badge-admin' : 'badge-standard'}`}>
                                {profileData.is_admin ? 'Administrator' : 'Standard Employee'}
                            </span>
                        </div>

                        <div className="profile-label">Employee ID</div>
                        <div className="profile-value">{profileData.employee_id}</div>

                        <div className="profile-label">Assigned Project</div>
                        <div className="profile-value">{profileData.project_involved || 'Unassigned'}</div>

                        <div className="profile-label">Account Status</div>
                        <div className="profile-value no-border">
                            {profileData.is_active ? (
                                <span className="status-active">Active</span>
                            ) : (
                                <span className="status-inactive">Inactive</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile