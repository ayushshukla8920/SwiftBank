import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from 'react-router-dom';
import {InputOTP,InputOTPGroup,InputOTPSlot,InputOTPSeparator} from "@/components/ui/input-otp";
import FadeLoader from "react-spinners/FadeLoader";
import { serverURL } from '@/config';
import axios from 'axios';

const KYCForm = () => {
  const sessionId = localStorage.getItem('sessionId');
  const [loader,setLoader] = useState("");
  const [aadhar,setAadhar] = useState("");
  const [pan,setPan] = useState("");
  const [pin,setPin] = useState("");
  const [address,setAddress] = useState("");
  const [feedback, setFeedback] = useState({ message: "", error: "" });
  const navigate = useNavigate();
  
  const handleSubmit = async (event)=>{
    event.preventDefault();
    setFeedback({ message: "", error: "" });
    setLoader(true);
    try {
      const response = await axios.post(`${serverURL}/kyc/submit`, { pan, aadhar, address, pin, sessionId });

      if (response.status === 201 && response.data.msg) {
        setFeedback({ message: response.data.msg, error: "" });
        setLoader("");
        navigate("/", { replace: true });
      } else {
        console.log(response.data);
        setFeedback({ message: "", error: response.data.error || "Unexpected error occurred." });
      }
    } catch (error) {
      console.error(error)
      if (error.response && error.response.data) {
        setFeedback({ message: "", error: error.response.data.error });
      } else {
        setFeedback({ message: "", error: "An error occurred. Please try again." });
      }
    }
    setLoader("");

  }

  const handlePanChange = (otp, setter) => {
    const formattedOtp = otp;
    if(formattedOtp.length == 0){
      setter(otp);
    }
    if (formattedOtp.length <= 5 && formattedOtp.length>0) {
      if (/^[A-Za-z]$/.test(formattedOtp.slice(-1))) {
        setter(formattedOtp.toUpperCase());
      }
    } else if (formattedOtp.length <= 9) {
      if (/^\d$/.test(formattedOtp.slice(-1))) {
        setter(formattedOtp);
      }
    } else {
      if (/^[A-Za-z]$/.test(formattedOtp.slice(-1))) {
        setter(formattedOtp.toUpperCase());
      }
    }
  };
  const handleAadharChange = (otp, setter) => {
    if (/^\d*$/.test(otp)) {
      setter(otp);
    }
  };
  const handleAddressChange = (otp, setter) => {
    setter(otp.toUpperCase())
  };
  return (
    <div className="flex mt-[10vh] justify-center">
      <Card className="w-[39vw] p-4">
        <CardHeader>
          <CardTitle className='text-5xl'>KYC</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
                <div>
                <Label htmlFor="username">PAN No.</Label>
                <InputOTP maxLength={12} onChange={(otp) => handlePanChange(otp, setPan)} value={pan}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSeparator className='mt-7' />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} />
                        <InputOTPSlot index={8} />
                        <InputOTPSeparator className='mt-7' />
                        <InputOTPSlot index={9} />
                    </InputOTPGroup>
                    </InputOTP>
                </div>
                <div>
                    <Label htmlFor="password" className='text-md'>Aadhar No.</Label>
                    <InputOTP maxLength={12} onChange={(otp) =>handleAadharChange(otp, setAadhar)} value={aadhar}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSeparator className='mt-7' />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} />
                        <InputOTPSeparator className='mt-7' />
                        <InputOTPSlot index={8} />
                        <InputOTPSlot index={9} />
                        <InputOTPSlot index={10} />
                        <InputOTPSlot index={11} />
                    </InputOTPGroup>
                    </InputOTP>
                </div>
                <div>
                  <Label htmlFor="username">Address</Label>
                  <Input
                    id="address"
                    type="address"
                    value={address}
                    onChange={(otp) => handleAddressChange(otp.target.value,setAddress)}
                    placeholder="Enter your Address"
                    required
                    className='mt-4'
                  />
                </div>
                <div>
                  <Label htmlFor="password">PinCode</Label>
                  <InputOTP maxLength={6} onChange={(otp) =>handleAadharChange(otp, setPin)} value={pin}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
            </div>
          </CardContent>
          <br></br>
          {feedback.message && <p className="text-center text-green-500 font-semibold">{feedback.message}</p>}
          {feedback.error && <p className="text-center text-red-500 font-semibold">{feedback.error}</p>}
          <CardFooter className="flex flex-col items-center space-y-4 mt-12">
          {!loader && <Button type="submit" className="w-full">Submit</Button>}
          {loader && <Button type="submit" className="w-full pt-6 pl-8" ><FadeLoader color='black' height={8} margin={-8} radius={15} width={3} speedMultiplier={1.5}/></Button>}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default KYCForm
