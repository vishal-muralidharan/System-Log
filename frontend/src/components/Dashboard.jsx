import React from "react";
import { useNavigate, Link } from 'react-router-dom';
import AxiosInstance from '../api/axios';
import '../Dashboard.css';

const Dashboard = () => {
    return (
        <div className="overall-container">
            <div>
                <h1 className="dashboard-title">
                    Dashboard
                </h1>
            </div>
            
            <div className="data-container">
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
                            <li className="logout-item">Logout</li>
                        </div>
                    </ul>
                </div>
                
                <div className="container-style">

                </div>
            </div>
        </div>
    );
}


export default Dashboard;