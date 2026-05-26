import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Home from './components/Home'
import History from './components/History'
import Profile from './components/Profile'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />}>
                    <Route index element={<Home />} />
                    <Route path="/dashboard/history" element={<History />} />
                    <Route path="/dashboard/profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App