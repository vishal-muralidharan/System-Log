import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Sidebar.css';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const [confirm, setConfirm] = useState(false);
    const confirmRef = useRef(null);

    const [active, setActive] = useState(() => {
        const savedTab = localStorage.getItem("activeTab");
        return savedTab ? savedTab : "Home";
    });

    useEffect(() => {
        localStorage.setItem("activeTab", active);
    }, [active]);

    useEffect(() => {
        const handleConfirmClick = (event) => {
            if (confirmRef.current && !confirmRef.current.contains(event.target)) {
                setConfirm(false);
            }
        };

        const handleConfirmScroll = () => {
            setConfirm(false);
        };

        if (confirm) {
            document.addEventListener("scroll", handleConfirmScroll, true);
            document.addEventListener("mousedown", handleConfirmClick);
        }

        return () => {
            document.removeEventListener("scroll", handleConfirmScroll, true);
            document.removeEventListener("mousedown", handleConfirmClick);
        };
    }, [confirm]);

    const handleLogout = () => {
        setConfirm(false);

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.setItem("activeTab", "Home");
        navigate('/login');
    };

    return (
        <div className="sidebar-style">
            <ul className="sidebar-items">
                <div className="main-items">
                    <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setActive('Home')}>
                        <li className={`list-item ${active === 'Home' ? "active" : ""}`}>Home</li>
                    </Link>
                    <Link to="/admin/logs" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setActive('History')}>
                        <li className={`list-item ${active === 'History' ? "active" : ""}`}>Log Attendance History</li>
                    </Link>
                    <Link to="/admin/employees" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setActive('Profile')}>
                        <li className={`list-item ${active === 'Profile' ? "active" : ""}`}>Employees Data</li>
                    </Link>
                </div>
                <div>
                    <li className="logout-item" onClick={() => setConfirm(true)}>Logout</li>
                </div>
            </ul>

            {/* Added modal-overlay wrapper for full-screen blur effect */}
            {confirm && (
                <div className="modal-overlay">
                    <div className='confirmation' ref={confirmRef}>
                        <h4>Click on 'Confirm' to Logout</h4>
                        <div className='buttons'>
                            <button onClick={handleLogout}>Confirm</button>
                            <button onClick={() => setConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSidebar;