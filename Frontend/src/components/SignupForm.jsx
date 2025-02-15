import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import axios from 'axios';
import { serverURL } from '@/config';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import {Popover,PopoverContent,PopoverTrigger,} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from '@/components/ui/input';
import {InputOTP,InputOTPGroup,InputOTPSlot} from "@/components/ui/input-otp";
import FadeLoader from "react-spinners/FadeLoader";
import {Select,SelectContent,SelectGroup,SelectItem,SelectLabel,SelectTrigger,SelectValue,} from "@/components/ui/select";


const SignupForm = () => {
  const d = new Date();
  const [loader,setLoader] = useState("");
  const [showotp, setShowOtp] = useState("");
  const [otp,setOtp] = useState("");
  const [date, setDate] = useState(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cnfpassword, setCnfPassword] = useState("");
  const [mobno, setMobno] = useState("");
  const [feedback, setFeedback] = useState({ message: "", error: "" });
  const navigate = useNavigate();

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setLoader(true);
    setFeedback({ message: "", error: "" });
    console.log(gender);
    const dob = date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate();
    try {
      const response = await axios.post(`${serverURL}/auth/signup`, { username, password, name, dob, mobno, email, gender });
      if (response.status === 200 && response.data.msg) {
        setFeedback({ message: response.data.msg, error: "" });
        setLoader("");
        setShowOtp(true);
        setEmail(response.data.email);
      } else {
        setFeedback({ message: "", error: response.data.error || "Unexpected error occurred." });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setFeedback({ message: "", error: error.response.data.error });
      } else {
        setFeedback({ message: "", error: "An error occurred. Please try again." });
      }
    }
    setLoader("");
  }
  const handleOTPSubmit = async(event)=>{
    event.preventDefault();
    setLoader(true);
    const dob = date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate();
    try {
      const response = await axios.post(`${serverURL}/auth/verify-otp`, { username, password, name, dob, mobno, email, gender, otp });
      console.log(response.data);
      if (response.data.msg === "Success") {
        localStorage.setItem('sessionId',response.data.sessionId);
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.log(error)
      if (error.response && error.response.data) {
        setFeedback({ message: "", error: error.response.data.error });
      } else {
        setFeedback({ message: "", error: "An error occurred. Please try again." });
      }
    }
    setLoader("");
  }

  return (
    <div className="flex mt-[5vh] justify-center">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>
        {!showotp && <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter a username"
                    required
                  />
              </div>
              <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your Name"
                    required
                  />
              </div>
              <div>
                  <Label htmlFor="mobno">Mobile No.</Label>
                  <Input
                    id="mobno"
                    type="mobno"
                    value={mobno}
                    onChange={(e) => setMobno(e.target.value)}
                    placeholder="Enter your Mobile No."
                    required
                  />
              </div>
              <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email"
                    required
                  />
              </div>
              <div>
                  <Label htmlFor="email">Gender</Label>
                  <Select onValueChange={(value)=>{setGender(value)}}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select your Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
              </div>
              <div>
                <Label htmlFor="dob" className='block mb-2'>
                  Date of Birth
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                      <CalendarIcon />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar captionLayout="dropdown-buttons" fromYear={1900} toYear={d.getFullYear()} mode="single" selected={date} onSelect={setDate} initialFocus/>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cnfpassword">Confirm Password</Label>
                <Input
                  id="cnfpassword"
                  type="password"
                  value={cnfpassword}
                  onChange={(e) => setCnfPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                />
              </div>
            </div>
          </CardContent>
          <br></br>
          {feedback.message && <p className="text-center text-green-500 font-semibold">{feedback.message}</p>}
          {feedback.error && <p className="text-center text-red-500 font-semibold">{feedback.error}</p>}
          <CardFooter className="flex flex-col items-center space-y-4 mt-5">
            {!loader && <Button type="submit" className="w-full">Create Account</Button>}
            {loader && <Button type="submit" className="w-full pt-6 pl-8" ><FadeLoader color='black' height={8} margin={-8} radius={15} width={3} speedMultiplier={1.5}/></Button>}
            <Link to="/login" className="hover:underline">Already Have an Account? Login</Link>
          </CardFooter>
        </form>}
        {showotp && <form onSubmit={handleOTPSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  required
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="password">One-Time Password</Label>
                <InputOTP maxLength={6} onChange={(otp) => setOtp(otp)} value={otp}>
                  <InputOTPGroup className='gap-5'>
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
            {!loader && <Button type="submit" className="w-full">Create Account</Button>}
            {loader && <Button type="submit" className="w-full pt-6 pl-8" ><FadeLoader color='black' height={8} margin={-8} radius={15} width={3} speedMultiplier={1.5}/></Button>}
            <Link to="/signup" className="hover:underline">Don't have an account? Open Now!</Link>
          </CardFooter>
        </form>}
      </Card>
    </div>
  )
}

export default SignupForm
