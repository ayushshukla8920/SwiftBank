import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { serverURL } from '@/config';
import axios from 'axios';
import FadeLoader from "react-spinners/FadeLoader";
import ClockLoader from "react-spinners/ClockLoader";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MdVerified } from "react-icons/md";
import throwError from '@/lib/toast';
import TransactionProcessing from './TransactionProcessing';
import TransactionSuccess from './TransactionSuccess';
import TransactionFailed from './TransactionFailed';

const TransferFunds = (props) => {
  const sessionId = localStorage.getItem('sessionId');
  const [type,setType] = useState('');
  const [accNo,setAccNo] = useState('');
  const [accountValid, setAccountValid] = useState('');
  const [ploader, setPloader] = useState('');
  const [tloader, setTloader] = useState('');
  const [amount, setAmount] = useState('');
  const [processed, setProcessed] = useState('');
  const [trxnRcp, setTrxnRcp] = useState('');

  const handleAccountNumber = (e) => {
    if(!isNaN(e.target.value)){
      setAccountValid('')
      setAccNo(e.target.value);
    }
  }
  const handleAmount = (e) => {
    if(!isNaN(e.target.value)){
      setAmount(e.target.value);
    }
  }


  const handleAccountVerify = async() =>{
    setPloader(true);
    try {
      if(type == 'UPI'){
        const nameResponse = await axios.post(`${serverURL}/trxn/verify`,{type,mobNo: accNo,sessionId});
        if(nameResponse.data.name){
          setAccountValid(nameResponse.data.name);
        }
        else{
          throwError(nameResponse.data.error);
        }
      }
      if(type == 'IMPS' || type == 'NEFT'){
        const nameResponse = await axios.post(`${serverURL}/trxn/verify`,{type,accNo,sessionId});
        if(nameResponse.data.name){
          setAccountValid(nameResponse.data.name);
        }
        else{
          throwError(nameResponse.data.error);
        }
      }
    } catch (error) {
      throwError('Something went wrong !!');
    }
    setPloader('');
  }

  const handleTransaction = async () =>{
    if(amount==''){
      return throwError('Amount must be greater than 0.')
    }
    setTloader(true);
    setProcessed('processing');
    try {
      const transactionResponse = await axios.post(`${serverURL}/trxn/pay`,{sessionId,from: props.user.BankDetails.accNo, to: accNo, type, amount});
      console.log(transactionResponse);
      if(transactionResponse.data.reciept){
        setProcessed('success');
        setTrxnRcp(transactionResponse.data.reciept);
      }
      if(transactionResponse.data.error){
        setProcessed('failure');
        setTrxnRcp(transactionResponse.data.error);
      }
    } catch (error) {
      return throwError('Internal Server Error');
    }
  }


  return (
    <div className="px-[5vw] py-11">
      <div className="flex items-end">
        <h1 className="text-5xl font-semibold tracking-tighter">{tloader ? 'Transaction Status':'Transfer Funds'}</h1>
      </div>
      {!tloader && <Card className="w-[70vw] p-4 mt-[5vh]">
        <CardTitle className='px-5 py-3 text-xl'>
          Beneficiary Details
        </CardTitle>
        <CardContent>
          <RadioGroup className='flex gap-10 my-10' onValueChange={(value) => {setType(value);setAccNo('');setAccountValid('')}}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="NEFT" id="r1" />
              <Label htmlFor="r1">NEFT</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="IMPS" id="r2" />
              <Label htmlFor="r2">IMPS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="UPI" id="r3" />
              <Label htmlFor="r3">UPI</Label>
            </div>
          </RadioGroup>


          {(type == 'NEFT' || type == 'IMPS') && <div className='flex justify-start items-center'>
            <div>
            <Label className='mx-5'>Account Number</Label>
            <Input
              id="account"
              value={accNo}
              onChange={handleAccountNumber}
              required
              className="w-[30vw] h-[7vh] rounded-2xl !text-2xl font-bold px-7"
            /></div>
            {!accountValid && ploader && <Button
              type="button"
              onClick={handleAccountVerify}
              className="h-[7vh] w-[10vw] rounded-xl bg-blue-600 mt-5 ml-10 text-white font-bold text-xl tracking-tight hover:bg-blue-600"
            ><FadeLoader className='mt-5 ml-5' color='white' height={8} margin={-8} radius={1} width={4} speedMultiplier={1.5} /></Button>}
            {!accountValid && !ploader && <Button
              type="button"
              onClick={handleAccountVerify}
              className="h-[7vh] w-[10vw] rounded-xl bg-blue-600 mt-5 ml-10 text-white font-bold text-xl tracking-tight hover:bg-blue-600"
            >Proceed</Button>}
            {accountValid && <div>
              <h1 className='flex items-center gap-2 mt-5 mx-5'><MdVerified className="text-white text-3xl" /> Verified Name: <h2 className='text-[#FFBA00] font-bold'>{accountValid}</h2></h1>
              </div>}
          </div>}


          {(type == 'UPI') && <div className='flex justify-start items-center'>
            <div className='flex flex-col'>
              <Label className='mx-5 my-1'>UPI ID</Label>
              <div className='flex'>
                <Input
                  id="account"
                  onChange={handleAccountNumber}
                  required
                  className="w-[25vw] h-[7vh] rounded-bl-2xl rounded-tl-2xl !text-2xl font-bold px-7"
                />
                <div className="flex items-center justify-center w-[8vw] h-[7vh] rounded-br-2xl rounded-tr-2xl fle border-[1px] border-[#27272A]">
                  <h1 className='text-lg font-bold'>@swiftbnk</h1>
                </div>
              </div>
            </div>
            {!accountValid && !ploader && <Button
              type="button"
              onClick={handleAccountVerify}
              className="h-[7vh] w-[10vw] rounded-xl bg-blue-600 mt-5 ml-10 text-white font-bold text-xl tracking-tight hover:bg-blue-600"
            >Proceed</Button>}
            {!accountValid && ploader && <Button
              type="button"
              onClick={handleAccountVerify}
              className="h-[7vh] w-[10vw] rounded-xl bg-blue-600 mt-5 ml-10 text-white font-bold text-xl tracking-tight hover:bg-blue-600"
            ><FadeLoader className='mt-5 ml-5' color='white' height={8} margin={-8} radius={1} width={4} speedMultiplier={1.5} /></Button>}
            {accountValid && <div>
              <div className='flex items-center gap-2 mt-5 mx-5'><MdVerified className="text-white text-3xl" /> Verified Name: <h2 className='text-[#FFBA00] font-bold'>{accountValid}</h2></div>
              </div>}
          </div>}
          
          {accountValid && <div className='mt-5 flex items-center gap-5 mb-10'>
            <div className='flex flex-col gap-2'>
              <Label className='mx-5'>Amount</Label>
              <Input
                id="account"
                value={amount}
                onChange={handleAmount}
                required
                className={`${type == 'UPI' ? 'w-[33vw]':'w-[30vw]'} h-[7vh] rounded-2xl !text-2xl font-bold px-7`}
              />
            </div>
            <Button
              type="button"
              onClick={handleTransaction}
              className="h-[7vh] w-[10vw] rounded-xl bg-blue-600 mt-5 text-white font-bold text-xl tracking-tight hover:bg-blue-600"
            >Pay Now
            </Button>
          </div>}

        </CardContent>
      </Card>}


      {tloader && <Card className="w-[70vw] p-4 mt-[5vh]">
        {processed == 'processing' && <TransactionProcessing user={props.user} type={type} amount={amount} accNo={accNo} />}
        {processed == 'success' && <TransactionSuccess user={props.user} rcp={trxnRcp} />}
        {processed == 'failure' && <TransactionFailed user={props.user} rcp={trxnRcp} type={type} amount={amount} accNo={accNo} />}
      </Card>}


      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        />
    </div>
  )
}

export default TransferFunds
