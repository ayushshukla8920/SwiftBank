import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import Auth from './lib/auth'
import Signup from './Pages/Signup'
import Kyc from './Pages/Kyc'
import PaymentSuccess from './Pages/PaymentSuccess'

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      
      {/* Protected Routes */}
      <Route path='/' element={<Auth><Dashboard tab={'home'} /></Auth>} />
      <Route path='/transactions' element={<Auth><Dashboard tab={'transactions'} /></Auth>} />
      <Route path='/transfer-funds' element={<Auth><Dashboard tab={'transfer-funds'} /></Auth>} />
      <Route path='/deposit' element={<Auth><Dashboard tab={'deposit'} /></Auth>} />
      <Route path='/payment-success' element={<Auth><PaymentSuccess /></Auth>} />
      <Route path='/user/kyc/pending' element={<Auth><Kyc status={'pending'} /></Auth>} />
      <Route path='/user/kyc/processing' element={<Auth><Kyc status={'processing'} /></Auth>} />
    </Routes>
  )
}

export default App
