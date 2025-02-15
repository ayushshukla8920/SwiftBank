import React from 'react'
import Navbar from '@/components/Navbar'
import LoginForm from '@/components/LoginForm'
import { Navigate } from 'react-router-dom'

const Login = () => {
  const sessionId = localStorage.getItem('sessionId');
  if (sessionId) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
        <Navbar />
        <div>
            <LoginForm />
        </div>
    </>
  )
}

export default Login
