import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import '../css/Sidebar.css';

const Sidebar = () => {
    const NavigateTo = useNavigate()
    const [Active, SetActive] = useState('Home')

    const HandleLogout =    () => {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            NavigateTo('/login')
    }

    return (
        <div className="sidebar-style">
            <ul className="sidebar-items">
                <div className="main-items">
                    <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => SetActive('Home')}>
                        <li className={`list-item ${Active === 'Home' ? "active" : ""}`}>Home</li>
                    </Link>
                    <Link to="/dashboard/history" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => SetActive('History')}>
                        <li className={`list-item ${Active === 'History' ? "active" : ""}`}>Attendance History</li>
                    </Link>
                    <Link to="/dashboard/profile" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => SetActive('Profile')}>
                        <li className={`list-item ${Active === 'Profile' ? "active" : ""}`}>Profile</li>
                    </Link>
                    
                </div>
                <div>
                    <li className="logout-item" onClick={HandleLogout}>Logout</li>
                </div>
            </ul>
        </div>
    )
}


export default Sidebar