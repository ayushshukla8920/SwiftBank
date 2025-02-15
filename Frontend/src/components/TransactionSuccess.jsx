import React from 'react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { GrValidate } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TransactionSuccess = (props) => {
  const navigate = useNavigate();
  const handleRedirect = ()=>{
    navigate('/',{replace: true});
  }
  return (
    <CardContent className='flex flex-col items-center'>
        <GrValidate className='mb-4 justify-center text-6xl mt-5 text-green-500' />
        <h1 className='text-5xl mt-5 font-bold tracking-tight text-green-500'>Transaction Successful</h1>
        <div className='flex flex-col w-[100%] justify-center items-center mt-10 mb-10'>
        <div className='w-[50%] flex items-center justify-between'>
            <h1 className='font-bold'>Transaction ID: </h1>
            <h1 className='font-semibold text-[#FFBA00]'>{props.rcp.transactionId}</h1>
        </div>
        <div className='w-[50%] flex items-center justify-between'>
            <h1 className='font-bold'>From Account: </h1>
            <h1 className='font-semibold text-[#FFBA00]'>{props.user.BankDetails.accNo}</h1>
        </div>
        <div className='w-[50%] flex items-center justify-between'>
            <h1 className='font-bold'>Beneficiary Name: </h1>
            <h1 className='font-semibold text-[#FFBA00]'>{props.rcp.accountName}</h1>
        </div>
        <div className='w-[50%] flex items-center justify-between'>
            <h1 className='font-bold'>To: </h1>
            <h1 className='font-semibold text-[#FFBA00]'>{props.rcp.transactionMode=='UPI'? props.rcp.accNo+'@swiftbnk': props.rcp.accNo}</h1>
        </div>
        <div className='w-[50%] flex items-center justify-between'>
            <h1 className='font-bold'>Mode: </h1>
            <h1 className='font-semibold text-[#FFBA00]'>{props.rcp.transactionMode}</h1>
        </div>
        <div className='w-[50%] flex items-center justify-between'>
            <h1 className='font-bold'>Amount: </h1>
            <h1 className='font-semibold text-[#FFBA00]'>&#8377; {props.rcp.transactionAmount}</h1>
        </div>
        <div className='w-[50%] flex items-center justify-between'>
            <h1 className='font-bold'>TimeStamp: </h1>
            <h1 className='font-semibold text-[#FFBA00]'>{props.rcp.timestamp}</h1>
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

export default TransactionSuccess
