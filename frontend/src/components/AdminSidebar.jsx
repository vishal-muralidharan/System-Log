import React, {useEffect, useState, useRef} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import '../css/Sidebar.css';

const AdminSidebar = () => {
    const NavigateTo = useNavigate()
    const [Confirm, SetConfirm] = useState(false)
    const ConfirmRef = useRef(null)

    const [Active, SetActive] = useState(() => {
        const savedTab = localStorage.getItem("activeTab");
        return savedTab ? savedTab : "Home";
    });

    useEffect(() => {
        localStorage.setItem("activeTab", Active);
    }, [Active]);

    useEffect(() => {
        const HandleConfirmClick = (event) => {
            if (ConfirmRef.current && !ConfirmRef.current.contains(event.target)) {
                SetConfirm(false)
            }
        }

        const HandleConfirmScroll = () => {
            SetConfirm(false)
        }

        if (Confirm) {
            document.addEventListener("scroll", HandleConfirmScroll, true)
            document.addEventListener("mousedown", HandleConfirmClick)
        }

        return () => {
            document.removeEventListener("scroll", HandleConfirmScroll, true)
            document.removeEventListener("mousedown", HandleConfirmClick)
        }
    }, [Confirm])

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
                    <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => SetActive('Home')}>
                        <li className={`list-item ${Active === 'Home' ? "active" : ""}`}>Home</li>
                    </Link>
                    <Link to="/admin/logs" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => SetActive('History')}>
                        <li className={`list-item ${Active === 'History' ? "active" : ""}`}>Log Attendance History</li>
                    </Link>
                    <Link to="/admin/employees" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => SetActive('Profile')}>
                        <li className={`list-item ${Active === 'Profile' ? "active" : ""}`}>Employees</li>
                    </Link>
                    
                </div>
                <div>
                    <li className="logout-item" onClick={() => SetConfirm(true)}>Logout</li>
                </div>
            </ul>

            {Confirm && (
                <div className='confirmation' ref={ConfirmRef}>
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


export default AdminSidebar