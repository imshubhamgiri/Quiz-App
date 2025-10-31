import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import MyResultPage from './pages/MyResultpage'

function RequireAuth({ children }) {
  const IsLoggedIn = Boolean(localStorage.getItem("authToken")); // Replace with your auth logic
  const location = useLocation();
  return IsLoggedIn ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

function App() {


  return (
    <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/signup' element={<SignUp/>}/>
    <Route path='/result' element={
      <RequireAuth>
        <MyResultPage/>
      </RequireAuth>
    }/>
    </Routes>
  )
}

export default App
