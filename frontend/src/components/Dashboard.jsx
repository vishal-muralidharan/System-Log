import React from "react";
import { useNavigate, Link } from 'react-router-dom';
import '../Dashboard.css';
import Sidebar from "./Sidebar";
import Home from "./Home";

const Dashboard = () => {
    return (
        <div className="overall-container">
            <div>
                <h1 className="dashboard-title">
                    Dashboard
                </h1>
            </div>
            
            <div className="data-container">
                <Sidebar />
                <div className="container-style">
                    <Home />
                </div>
            </div>
        </div>
    );
}


export default Dashboard;