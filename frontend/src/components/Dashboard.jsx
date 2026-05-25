import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import AxiosInstance from '../api/axios'



const Dashboard = () => {
    const Overall = {
        fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: '#334155',
    }

    const DataContainer = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }

    const ContainerStyle = {
        backgroundColor: '#deeefe', 
        height: '84vh',
        borderRadius: '20px',
        margin: '25px 10px 0 10px',
        width: '75%'
    }

    const SideBarStyle = {
        backgroundColor: '#fff2c3', 
        height: '84vh',    
        borderRadius: '20px',
        margin: '25px 10px 0 10px',
        width: '22%'
    }

    const SideBarItems = {
        height: '74vh',
        listStyleType: 'None',
        margin: '30px 0px',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column'
    }

    const MainItems = {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: '15vh'
    }

    return (
        <div style={Overall}>
            <div>
                <h1 style={{ margin: '15px 0 0px 0', fontSize: '36px', fontWeight: '700', color: '#1E293B', textAlign: 'center' }}>
                    Dashboard
                </h1>
            </div>
            <div style={DataContainer}>
                <div style={SideBarStyle}>
                    <ul style={SideBarItems}>
                        <div style={MainItems}>
                            <li>Home</li>
                            <li>Attendance Details</li>
                            <li>Profile</li>
                        </div>
                        <div>
                            <li>Logout</li>
                        </div>
                    </ul>
                </div>
                <div style={ContainerStyle}>

                </div>
            </div>
            
        </div>
    )
}


export default Dashboard