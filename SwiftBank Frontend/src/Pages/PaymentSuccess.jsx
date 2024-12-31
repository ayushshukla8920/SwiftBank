import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GrValidate } from "react-icons/gr";

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { validationData, amount } = location.state || {};
    console.log(validationData)
    const handleRedirect = ()=>{
        navigate('/');
    }
    return (
        <>
            <Navbar />
            <div className='flex w-full h-[90vh] flex-col items-center justify-center'>
                {validationData ? (
                <div className='flex w-full h-[90vh] bg-green-900 flex-col items-center'>
                    <Card className='text-center h-[60vh] w-[30vw] mt-[15vh] flex items-center flex-col'>
                        <CardHeader>
                            <CardTitle className='text-lg'>Reciept</CardTitle>
                        </CardHeader>
                        <GrValidate className='mb-4 justify-center text-5xl text-green-500' />
                        <h1 className='font-extrabold text-5xl text-green-500'>Payment Success</h1>
                        <div className='w-full text-left px-11 text-xl mt-11'>
                            <div className='flex justify-between'>
                                <h1 className='font-bold'>Order ID:</h1>
                                <h1>{validationData.razorpay_order_id}</h1>
                            </div>
                            <div className='flex justify-between'>
                                <h1 className='font-bold'>Amount:</h1>
                                <h1>&#8377; {amount.toFixed(2)}</h1>
                            </div>
                        </div>
                        <Button
                        type="button"
                        className="h-[8vh] w-[14vw] rounded-xl bg-blue-600 text-white font-bold !mt-[12vh] text-2xl tracking-tight hover:bg-blue-600"
                        onClick={handleRedirect}
                        >Back to Home</Button>
                    </Card>
                </div>
                ) : (
                    <div>
                        <h1 className='text-5xl font-extrabold'>404 Not Found</h1>
                        <Button
                        type="button"
                        className="h-[8vh] w-[14vw] rounded-xl bg-blue-600 text-white font-bold !mt-[8vh] text-2xl tracking-tight hover:bg-blue-600"
                        onClick={handleRedirect}
                        >Back to Home</Button>
                    </div>
                )}
            </div>
        </>
    )
}

export default PaymentSuccess
