import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import '../css/Sidebar.css';

const Sidebar = () => {
    const NavigateTo = useNavigate()

    const HandleLogout =    () => {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            NavigateTo('/login')
    }

    return (
        <div className="sidebar-style">
            <ul className="sidebar-items">
                <div className="main-items">
                    <li className="list-item">
                        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
                    </li>
                    <li className="list-item">
                        <Link to="/dashboard/history" style={{ textDecoration: 'none', color: 'inherit' }}>Attendance History</Link>
                    </li>
                    <li className="list-item">
                        <Link to="/dashboard/profile" style={{ textDecoration: 'none', color: 'inherit' }}>Profile</Link>
                    </li>
                </div>
                <div>
                    <li className="logout-item" onClick={HandleLogout}>Logout</li>
                </div>
            </ul>
        </div>
    )
}


export default Sidebar