import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { GrValidate } from "react-icons/gr";

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { validationData, amount } = location.state || {};
    const handleRedirect = ()=>{
        navigate('/');
    }
    return (
        <>
            <Navbar />
            <div className='flex w-full h-[90vh] flex-col items-center justify-center'>
                {validationData ? (
                <div className='flex w-full h-[90vh] bg-black flex-col items-center'>
                    <Card className='text-center h-[75vh] w-[30vw] mt-[5vh] flex items-center flex-col'>
                        <CardHeader>
                            <CardTitle className='text-lg'>Reciept</CardTitle>
                        </CardHeader>
                        <GrValidate className='mb-4 justify-center text-8xl text-green-500' />
                        <h1 className='font-extrabold text-xl text-green-500'>Payment Success</h1>
                        <div className='w-full text-left px-11 text-xl mt-11'>
                            <div className='flex justify-between'>
                                <h1 className='font-bold'>Order ID:</h1>
                                <h1>{validationData.razorpay_order_id}</h1>
                            </div>
                            <div className='flex justify-between'>
                                <h1 className='font-bold'>Amount:</h1>
                                <h1>&#8377; {Number(amount)?.toFixed(2) || "0.00"}</h1>
                            </div>
                        </div>
                        <h1 className='font-bold mt-10'>The Amount will be Credited to your <br />Account within 15 minutes.</h1>
                        <Button
                        type="button"
                        className="h-[5vh] w-[10vw] rounded-3xl bg-blue-600 text-white font-bold !mt-[6vh] text-lg tracking-tight hover:bg-blue-600"
                        onClick={handleRedirect}
                        >Back to Home</Button>
                    </Card>
                </div>
                ) : (
                    <div className='flex flex-col items-center justify-center'>
                        <h1 className='text-5xl font-extrabold'>404 Not Found</h1>
                        <Button
                        type="button"
                        className="h-[5vh] w-[14vw] rounded-3xl bg-blue-600 text-white font-bold !mt-[8vh] text-2xl tracking-tight hover:bg-blue-600"
                        onClick={handleRedirect}
                        >Back to Home</Button>
                    </div>
                )}
            </div>
        </>
    )
}

export default PaymentSuccess
