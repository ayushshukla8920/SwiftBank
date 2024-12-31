import React, { useState } from 'react'
import { BsEye, BsEyeSlash } from "react-icons/bs";

const Home = (props) => {
  console.log(props.user);
  const [showbal, setShowbal] = useState(true);
  const firstName = props.user.name.split(' ')[0];
  const formattedBalance = props.user.Bal.toFixed(2);
  return (
    <div className='px-[5vw] py-10'>
        <div className='flex items-end'>
          <h1 className='text-3xl font-semibold tracking-tighter'>Welcome</h1>
          <h1 className='ml-2 text-5xl font-semibold tracking-tighter text-blue-400'>{firstName}</h1>
        </div>
        <h1 className='text-xl tracking-tight font-bold mt-[8vh]'>Your Bank Account</h1>
        <div className='hover:cursor-pointer hover:scale-[1.02] hover:transition-all transition-all rounded-3xl px-8 py-7 bg-gradient-to-b from-[#002b5b] via-[#013a73] to-[#011c3c] w-[26vw] h-[30vh] mt-7'>
          <h1 className='font-bold tracking-tighter text-white text-2xl'>SWIFTBANK {props.user.BankDetails.accType}</h1>
          {!showbal && <div className='flex items-end justify-between'>
            <h1 className='text-4xl mt-6 font-bold'>&#8377; {formattedBalance}</h1>
            <button className='text-4xl' onClick={()=>{setShowbal(true)}}><BsEye /></button>
          </div>}
          {showbal && <div className='flex items-end justify-between'>
            <h1 className='text-4xl mt-6 font-bold'>&#8377; XXXX</h1>
            <button className='text-4xl' onClick={()=>{setShowbal("")}}><BsEyeSlash/></button>
          </div>}
          <h1 className='mt-9 text-xl ml-2 tracking-wider text-slate-400'>{props.user.BankDetails.accNo}</h1>
          <h1 className='mt-3 text-xl ml-2 tracking-wide text-slate-400'>{props.user.name}</h1>
        </div>
        <div>
          <h1 className='mt-10'>Recent Transactions</h1>
        </div>
    </div>
  )
}

export default Home
