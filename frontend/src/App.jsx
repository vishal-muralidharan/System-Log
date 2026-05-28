import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Home from './components/Home'
import History from './components/History'
import Profile from './components/Profile'
import AdminDashboard from './components/AdminDashboard'
import AdminHome from './components/AdminHome'
import AdminLogs from './components/AdminLogs'
import AdminEmployees from './components/AdminEmployees'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />}>
                    <Route index element={<Home />} />
                    <Route path="history" element={<History />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
                <Route path="/admin" element={<AdminDashboard />}>
                    <Route index element={<AdminHome />} />
                    <Route path="logs" element={<AdminLogs />} />
                    <Route path="employees" element={<AdminEmployees />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App