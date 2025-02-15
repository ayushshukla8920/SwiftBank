import React from 'react'
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { MdOutlineError } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TransactionFailed = (props) => {
    const navigate = useNavigate();
    const handleRedirect = ()=>{
      navigate('/',{replace: true});
    }
  return (
    <CardContent className='flex flex-col items-center'>
        <MdOutlineError className='mb-4 justify-center text-6xl mt-5 text-red-500' />
        <h1 className='text-5xl mt-5 font-bold tracking-tight text-red-500'>Transaction Failed</h1>
        <div className='flex flex-col w-[100%] justify-center items-center mt-10 mb-10'>
            <div className='text-3xl font-bold mb-10 text-red-500'>{props.rcp}</div>
        <div className='w-[50%] flex items-center justify-between'>
            <h1 className='font-bold'>From Account: </h1>
            <h1 className='font-semibold text-[#FFBA00]'>{props.user.BankDetails.accNo}</h1>
        </div>
        <div className='w-[50%] flex items-center justify-between'>
            <h1 className='font-bold'>To: </h1>
            <h1 className='font-semibold text-[#FFBA00]'>{props.type=='UPI'? props.accNo+'@swiftbnk': props.accNo}</h1>
        </div>
        <div className='w-[50%] flex items-center justify-between'>
            <h1 className='font-bold'>Amount: </h1>
            <h1 className='font-semibold text-[#FFBA00]'>&#8377; {props.amount}</h1>
        </div>
        <Button
            type="button"
            className="h-[5vh] w-[10vw] rounded-3xl bg-blue-600 text-white font-bold !mt-[6vh] text-lg tracking-tight hover:bg-blue-600"
            onClick={handleRedirect}
        >Back to Home</Button>
        </div>
    </CardContent>
  )
}

export default TransactionFailed
