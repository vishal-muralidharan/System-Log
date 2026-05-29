import React, {useEffect, useState} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import '../css/Sidebar.css';

const Sidebar = () => {
    const NavigateTo = useNavigate()
    const [Confirm, SetConfirm] = useState(false)

    const [Active, SetActive] = useState(() => {
        const savedTab = localStorage.getItem("activeTab");
        return savedTab ? savedTab : "Home";
    });

    useEffect(() => {
        localStorage.setItem("activeTab", Active);
    }, [Active]);

    const HandleLogout = () => {
        SetConfirm(false)

        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.setItem("activeTab", "Home");
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
                    <li className="logout-item" onClick={() => SetConfirm(true)}>Logout</li>
                </div>
            </ul>
            {Confirm && (
                <div className='confirmation'>
                    <h4>Click on 'Confirm' to Logout</h4>
                    <div className='buttons'>
                        <button onClick={HandleLogout}>Confirm</button>
                        <button onClick={() => SetConfirm(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}


export default Sidebar