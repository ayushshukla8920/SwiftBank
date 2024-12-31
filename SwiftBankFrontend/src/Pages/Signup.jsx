import React from 'react'
import Navbar from '@/components/Navbar'
import { Navigate } from 'react-router-dom'
import SignupForm from '@/components/SignupForm';

const Signup = () => {
    const isAuthenticated = document.cookie.includes("sessionId");
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return (
      <>
          <Navbar />
          <div>
            <SignupForm />
          </div>
      </>
    )
}

export default Signup
