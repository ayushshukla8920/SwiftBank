import React from 'react'
import Navbar from '@/components/Navbar'
import LoginForm from '@/components/LoginForm'
import { Navigate } from 'react-router-dom'

const Login = () => {
  const isAuthenticated = document.cookie.includes("sessionId");
  if (isAuthenticated) {
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
