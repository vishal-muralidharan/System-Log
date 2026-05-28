import React from "react";
import { useNavigate, Link, Outlet } from 'react-router-dom';
import '../css/Dashboard.css';
import AdminSidebar from "./AdminSidebar";
import Home from "./Home";

const AdminDashboard = () => {
    return (
        <div className="overall-container">
            <div>
                <h1 className="dashboard-title">
                    Admin Dashboard
                </h1>
            </div>
            
            <div className="data-container">
                <AdminSidebar />
                <div className="container-style">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}


export default AdminDashboard;