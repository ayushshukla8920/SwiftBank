import React from 'react';
import { Button } from './ui/button';
import { serverURL } from '@/config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Tab from './Tab';

const Sidebar = (props) => {
  const sessionId = localStorage.getItem('sessionId');
    const navigate = useNavigate();
    const tab = props.tab;
    const handleLogout = async()=>{
        axios.post(`${serverURL}/logout`,{sessionId})
        .then((response) => {
            console.log(response.data);
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
        <div className='w-[18vw] h-screen flex flex-col justify-between items-center border-r-[0.5px] border-[#27272A]'>
            <div className='w-full'>
                <div className='flex py-8 justify-center'>
                    <img className='w-12 h-12' src="/icon.png" alt="" />
                    <h1 className='text-white text-2xl mt-2 ml-4 font-semibold'>SwiftBank</h1>
                </div>
                <div className='w-full'>
                    <Tab text={'Home'} selected={tab==='home'}/>
                    <Tab text={'Transaction History'} selected={tab==='transactions'}/>
                    <Tab text={'Transfer Funds'} selected={tab==='transfer-funds'}/>
                    <Tab text={'Deposit'} selected={tab==='deposit'}/>
                </div>
            </div>
            <div className='px-5 pb-8'>
                <Button className='w-[18vh] rounded-xl' onClick={handleLogout}>Logout</Button>
            </div>
        </div>
    )
}

export default Sidebar;
