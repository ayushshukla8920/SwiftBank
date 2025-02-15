import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { serverURL } from '@/config';
import axios from 'axios';
import FadeLoader from "react-spinners/FadeLoader";

const Deposit = (props) => {
  const sessionId = localStorage.getItem('sessionId');
  const navigate = useNavigate();
  const [loader, setLoader] = useState("");
  const [feedback, setFeedback] = useState({ message: "", error: "" });
  const [amount, setAmount] = useState('');
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    let value = e.target.value;
    if (value === '') {
      setAmount('');
      return;
    }
    value = value.replace(/^0+(?!$)/, '');
    if (!isNaN(value)) {
      setAmount(value);
    }
  };

  const handleAmountChange = (amt) => {
    setAmount((prevAmount) => {
      const numericPrevAmount = parseFloat(prevAmount) || 0;
      return numericPrevAmount + amt;
    });
  };

  const handlePayment = async (e) => {
    setLoader(true);
    try {
      const response = await axios.post(`${serverURL}/deposit/generate-orderid`, {
        amount: amount * 100,
        currency: "INR",
        receipt: "order_rcptid_11",
        sessionId,
      });

      var options = {
        "key": "rzp_test_4lF84FAK3EkxMx",
        "amount": response.data.amount,
        "currency": response.data.currency,
        "name": "SwiftBank",
        "description": "Account Funding",
        "image": "/icon.png",
        "order_id": response.data.id,
        "handler": async function (response) {
          const validation = await axios.post(`${serverURL}/deposit/validate`, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            username: props.user.username,
            amount: amount,
            account: props.user.BankDetails.accNo,
            sessionId,
          });
          if (validation.data.msg === "Success") {
            navigate('/payment-success', { state: { validationData: validation.data, amount: amount } });
          } else {
            setFeedback({ error: validation.data.message, message: "" });
          }
        },
        "prefill": {
          "name": props.user.name,
          "email": props.user.email,
          "contact": props.user.mobno
        },
        "notes": {
          "address": "Razorpay Corporate Office"
        },
        "theme": {
          "color": "#2463eb"
        }
      };

      var rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        console.log("Payment failed event triggered");
        console.log(response);
        setFeedback({ error: "Payment failed! Please try again.", message: "" });
      });
      rzp1.open();
      e.preventDefault();
    } catch (error) {
      console.error(error);
      setFeedback({ error: "Error during payment! Please try again later.", message: "" });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="px-[5vw] py-11">
      <div className="flex items-end">
        <h1 className="text-5xl font-semibold tracking-tighter">Add Funds</h1>
      </div>
      <Card className="w-[70vw] p-4 mt-[10vh]">
        <CardHeader>
          <CardTitle>Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <Input
                id="amount"
                ref={inputRef}
                type="text"
                value={amount}
                onChange={handleInputChange}
                placeholder="0"
                required
                className="w-[50%] h-[10vh] rounded-3xl text-right !text-3xl font-bold px-7"
              />
              <Button
                onClick={() => handleAmountChange(500)}
                type="button"
                className="h-[6vh] w-[5vw] rounded-xl bg-black text-white hover:bg-black border-2 border-blue-300/80"
              >
                +500
              </Button>
              <Button
                onClick={() => handleAmountChange(1000)}
                type="button"
                className="h-[6vh] w-[5vw] rounded-xl bg-black text-white hover:bg-black border-2 border-blue-300/80"
              >
                +1000
              </Button>
              <Button
                onClick={() => handleAmountChange(2000)}
                type="button"
                className="h-[6vh] w-[5vw] rounded-xl bg-black text-white hover:bg-black border-2 border-blue-300/80"
              >
                +2000
              </Button>
              <Button
                onClick={() => handleAmountChange(5000)}
                type="button"
                className="h-[6vh] w-[5vw] rounded-xl bg-black text-white hover:bg-black border-2 border-blue-300/80"
              >
                +5000
              </Button>
            </div>
            {!loader && <Button
              type="button"
              className="h-[8vh] w-[18vw] rounded-xl bg-blue-600 text-white font-bold !mt-[8vh] text-2xl tracking-tight hover:bg-blue-600"
              onClick={handlePayment}
            >Pay Now</Button>}
            {loader && <Button
              type="button"
              className="h-[8vh] w-[18vw] rounded-xl bg-blue-600 text-white font-bold !mt-[8vh] text-2xl tracking-tight hover:bg-blue-600"
            ><FadeLoader className='mt-4 ml-4' color='white' height={8} margin={-5} radius={15} width={5} speedMultiplier={1.5} /></Button>}
            
            {feedback.error && <p className="text-center text-red-500 font-semibold">{feedback.error}</p>}
            {feedback.message && <p className="text-center text-green-500 font-semibold">{feedback.message}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Deposit;
