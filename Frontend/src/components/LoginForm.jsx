import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { serverURL } from "@/config";
import {InputOTP,InputOTPGroup,InputOTPSlot} from "@/components/ui/input-otp"
import { Link, useNavigate } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";

const LoginForm = () => {
  const [loader,setLoader] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState({ message: "", error: "" });
  const [showotp, setShowOtp] = useState("");
  const [otp,setOtp] = useState("");
  const [email,setEmail]=useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback({ message: "", error: "" });
    setLoader(true);
    try {
      const response = await axios.post(`${serverURL}/auth/login`, { username, password });

      if (response.status === 200 && response.data.msg) {
        setFeedback({ message: response.data.msg, error: "" });
        setShowOtp(true);
        setLoader("");
        setEmail(response.data.email);
      } else {
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
  };
  const handleOTPSubmit = async(event)=>{
    event.preventDefault();
    setLoader(true);
    try {
      const response = await axios.post(`${serverURL}/auth/login/verify-otp`, { username, otp });
      if (response.data.msg === "Success") {
        localStorage.setItem('sessionId',response.data.sessionId);
        console.log('Session Saved');
        navigate("/", { replace: true });
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

  return (
    <div className="flex mt-[10vh] justify-center">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle>Login</CardTitle>
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
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
          </CardContent>
          <br></br>
          {feedback.message && <p className="text-center text-green-500 font-semibold">{feedback.message}</p>}
          {feedback.error && <p className="text-center text-red-500 font-semibold">{feedback.error}</p>}
          <CardFooter className="flex flex-col items-center space-y-4 mt-12">
          {!loader && <Button type="submit" className="w-full">Login</Button>}
          {loader && <Button type="submit" className="w-full pt-6 pl-8" ><FadeLoader color='black' height={8} margin={-8} radius={15} width={3} speedMultiplier={1.5}/></Button>}
            <Link to="/signup" className="hover:underline">Don't have an account? Open Now!</Link>
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
          {feedback.error && <p className="text-center text-red-500 font-semibold">{feedback.error}</p>}
          {feedback.message && <p className="text-center text-green-500 font-semibold">{feedback.message}</p>}
          <CardFooter className="flex flex-col items-center space-y-4 mt-12">
            {!loader && <Button type="submit" className="w-full">Login</Button>}
            {loader && <Button type="submit" className="w-full pt-6 pl-8" ><FadeLoader color='black' height={8} margin={-8} radius={15} width={3} speedMultiplier={1.5}/></Button>}
            <Link to="/signup" className="hover:underline">Don't have an account? Open Now!</Link>
          </CardFooter>
        </form>}
      </Card>
    </div>
  );
};

export default LoginForm;
