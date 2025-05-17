import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'
import Dashboard from './pages/dashboard.jsx'
import Notfound from './pages/notfound.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Scholarships from './pages/scholarships.jsx'
import Profile from './pages/Profile.jsx'
import Apply from './pages/ApplyScholarship.jsx'
import MyScholarships from './pages/MyScholarships.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import MainLayout from './pages/MainLayout.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='*' element={<Notfound />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
        <Route path='/scholarships' element={<Scholarships />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/apply-scholarship' element={<Apply />} />
        <Route path='/my-scholarships' element={<MyScholarships />} />
        <Route path='/adminlogin' element={<AdminLogin />} />

        <Route element={<MainLayout />}>
          <Route path='/' element={<Dashboard />} />
          <Route path='/scholarships' element={<Scholarships />} />
          <Route path='/my-scholarships' element={<MyScholarships />} />
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
