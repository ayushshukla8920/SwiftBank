import React from 'react'
import { Button } from './ui/button';
import { serverURL } from '@/config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Navbar = (props) => {
  const sessionId = localStorage.getItem('sessionId');
  const navigate = useNavigate();
  const handleLogout = async()=>{
    axios.get(`${serverURL}/logout`,{sessionId})
    .then((response) => {
        if (response.data.msg === "Logout Successful") {
          localStorage.removeItem('sessionId');
          navigate('/login', { replace: true });
        }
    })
    .catch((error) => {
        console.error("Logout error:", error.response?.data?.error || error.message);
        alert("Failed to log out. Please try again.");
    });
  }
  return (
    <div className='w-full h-[12vh] border-b-2 border-white/20 py-5 px-7 flex justify-between' >
      <div className='flex'>
        <img className='w-12 h-12' src="/icon.png" alt="" />
        <h1 className='text-white text-2xl mt-2 ml-4 font-semibold'>SwiftBank</h1>
      </div>
      {props.logout && <Button className="mt-1" onClick={handleLogout} >Logout</Button>}
    </div>
  )
}

export default Navbar
