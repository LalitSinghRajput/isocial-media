import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom';

// elements
import Home from './pages/home/Home'
import Profile from './pages/profile/Profile'
import Error from './pages/errorPage/ErrorPage.jsx'
import UpdateProfile from './pages/updateProfile/UpdateProfile';
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Messenger from './pages/messenger/Messenger'
import { AuthContext } from './context/AuthContext';

const App = () => {

  const { user } = useContext(AuthContext)

  return (
    <>
      <Routes>

        <Route exact path="/" element={user ? <Home username={user.username} /> : <Login />} />

        <Route exact path="/login" element={user ? <Home username={user.username} /> : <Login />} />

        <Route exact path="/register" element={user ? <Home username={user.username} /> : <Register />} />

        <Route exact path="/profile/:username" element={user ? <Profile /> : <Login />} />

        <Route exact path="/profile/:username/updateProfile" element={<UpdateProfile />} />

        <Route exact path="/profile/:username/messenger" element={<Messenger />} />

        <Route path='*' element={<Error />} />

      </Routes>
    </>
  )
}

export default App
