import React from 'react'
import ClockLoader from "react-spinners/ClockLoader";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const TransactionProcessing = (props) => {
  return (
    <CardContent className='flex flex-col items-center'>
        <ClockLoader color='white' speedMultiplier={1.5} className='mt-5' />
        <h1 className='text-5xl mt-5 font-bold tracking-tight'>Processing</h1>
        <div className='flex flex-col w-[100%] justify-center items-center mt-10 mb-10'>
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
        </div>
    </CardContent>
  )
}

export default TransactionProcessing
