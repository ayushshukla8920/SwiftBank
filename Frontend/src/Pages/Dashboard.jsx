import Deposit from '@/components/Deposit';
import Home from '@/components/Home';
import Sidebar from '@/components/Sidebar';
import Transactions from '@/components/Transactions';
import TransferFunds from '@/components/TransferFunds';
import { serverURL } from '@/config';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = (props) => {
  const tab = props.tab;
  const sessionId = localStorage.getItem('sessionId');
  const navigate = useNavigate();
  const [kycOK,setKycOK] = useState("");
  const [user,setUser] = useState("");
  const handleuserKYC = async ()=>{
    try{
      const response = await axios.post(`${serverURL}/user`,{sessionId});
      if(response.data.msg == "PENDING"){
        navigate("/user/kyc/pending", { replace: true });
      }
      if(response.data.msg == "VERIFICATION"){
        navigate("/user/kyc/processing", { replace: true });
      }
      if(response.data.error == "Unauthorised"){
        localStorage.removeItem('sessionId');
        navigate('/login', { replace: true });
      }
      if(!response.data.msg){
        setKycOK(true);
        console.log(response.data)
        setUser(response.data);
      }
    }
    catch (error){
      console.log(error);
    }
  }

  useEffect(() => {
      handleuserKYC();
    }, []);
  
  return (
    <div className='flex'>
      <Sidebar logout={true} tab={tab} />
      {kycOK && tab==='home' && <>
        <div className='w-[82vw]'>
          <Home user={user}/>
        </div>
      </>}
      {kycOK && tab==='transactions' && <>
        <div>
          <Transactions user={user}/>
        </div>
      </>}
      {kycOK && tab==='transfer-funds' && <>
        <div>
          <TransferFunds user={user}/>
        </div>
      </>}
      {kycOK && tab==='deposit' && <>
        <div>
          <Deposit user={user}/>
        </div>
      </>}
    </div>
  )
}

export default Dashboard
