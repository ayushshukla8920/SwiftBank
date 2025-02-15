import KYCForm from '@/components/KYCForm';
import Navbar from '@/components/Navbar'
import { serverURL } from '@/config';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Kyc = (props) => {
  const navigate = useNavigate();
  const sessionId = localStorage.getItem('sessionId');
  const [kyc,setKYC] = useState(props.status);
  const handleuserKYC = async ()=>{
    try{
      const response = await axios.get(`${serverURL}/user`,{sessionId});
      if(response.data.msg == "PENDING"){
        navigate("/user/kyc/pending", { replace: true });
      }
      if(response.data.msg == "VERIFICATION"){
        navigate("/user/kyc/processing", { replace: true });
      }
      if(!response.data.msg){
        navigate("/", { replace: true });
      }
    }
    catch (error){
      // handleLogout();
    }

  }
  useEffect(() => {
      handleuserKYC();
    }, []);
  
  return (
    <div>
      <Navbar logout={true}></Navbar>
      {kyc==='processing' && <><div className='flex justify-center'>
          <video src="/kyc.mp4" autoPlay loop className='h-[60vh]'></video>
        </div>
        <h1 className='text-5xl font-semibold text-center'>KYC is Processing</h1>
        <h1 className='text-5xl font-semibold text-center'>Please wait 10-15 mins or Reload Page to Update Status</h1>
      </>}
      {kyc==='pending' && <>
        <KYCForm />
      </>}
    </div>
  )
}

export default Kyc
