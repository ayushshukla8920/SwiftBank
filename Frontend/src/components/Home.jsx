import { serverURL } from '@/config';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { TbReload } from "react-icons/tb";
import TransactionGraph from './TransactionGraph';
import { BarChart, Bar, XAxis, YAxis, LabelList, Legend, ResponsiveContainer,Cell } from "recharts";


const Home = (props) => {
  const sessionId = localStorage.getItem('sessionId');
  const [showbal, setShowbal] = useState(true);
  const firstName = props.user.name.split(' ')[0];
  const formattedBalance = props.user.Bal.toFixed(2);
  const [trxns, setTrxns] = useState([]);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchgraph = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      const response = await axios.post(`${serverURL}/trxn/getsevendays`,{sessionId, cid: props.user.BankDetails.customerId});
      const transactions = response.data;
      let creditTotal = 0;
      let debitTotal = 0;
      transactions.forEach((tx) => {
        if (tx.type === "Credit" || tx.type === "DEPOSIT") {
          creditTotal += tx.transactionAmount;
        } else if (tx.type === "Debit") {
          debitTotal += tx.transactionAmount;
        }
      });
      setData([
        { name: "Money Received", amount: creditTotal, fill: '#60A5FA' },
        { name: "Money Spent", amount: debitTotal, fill: '#FFFFFF' },
      ]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const TimeStamp = (t)=>{
    const mon = ['January','February','March','April','May','June','July','August','September','October','November','December']
    const parts = t.split('-');
    const time = parts[0].split(':');
    const date = parts[1].split('/');
    return {
      date: `${mon[parseInt(date[1])-1]} ${date[0]} ${date[2]}`,
      time: `${parseInt(time[0])>'12'? parseInt(time[0])-12+':'+time[1]+' PM': time[0]+':'+time[1]+' AM'}`
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await axios.post(`${serverURL}/trxn/getlatest`, {
        cid: props.user.BankDetails.customerId,
        sessionId
      });
      setTrxns(response.data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions.");
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchgraph();
  }, []);
  

  return (
    <div className='px-[5vw] pt-10'>
    <div className='flex'>
      <div className='w-[50%]'>
        <div className='flex items-end'>
          <h1 className='text-3xl font-semibold tracking-tighter'>Welcome</h1>
          <h1 className='ml-2 text-5xl font-semibold tracking-tighter text-blue-400'>{props.user.name}</h1>
        </div>
        <h1 className='text-xl tracking-tight font-bold mt-10'>Your Bank Account</h1>
        <div className='hover:cursor-pointer hover:scale-[1.02] hover:transition-all transition-all rounded-3xl px-8 py-7 bg-gradient-to-b from-[#002b5b] via-[#013a73] to-[#011c3c] w-[26vw] h-[30vh] mt-7'>
          <h1 className='font-bold tracking-tighter text-white text-xl'>SWIFTBANK {props.user.BankDetails.accType}</h1>
          {!showbal && <div className='flex items-center justify-between'>
            <h1 className='text-2xl mt-3 font-bold'>&#8377; {formattedBalance}</h1>
            <button className='text-2xl mt-4' onClick={()=>{setShowbal(true)}}><BsEye /></button>
          </div>}
          {showbal && <div className='flex items-center justify-between'>
            <h1 className='text-2xl mt-3 font-bold'>&#8377; XXXX</h1>
            <button className='text-2xl mt-4' onClick={()=>{setShowbal("")}}><BsEyeSlash/></button>
          </div>}
          <h1 className='mt-7 text-lg ml-2 tracking-wider text-slate-400'>{props.user.BankDetails.accNo}</h1>
          <h1 className='mt-1 text-lg ml-2 tracking-wide text-slate-400'>{props.user.name}</h1>
        </div>
      </div>
      <div className='text-center mt-[8vh] w-[50%]'>
        <h1 className='text-xl tracking-tight font-bold mt-5 mb-5'>Last 7 Days</h1>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical">
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Legend />
            <Bar dataKey="amount" name="Amount (₹)" barSize={30}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill || "#4CAF50"} />
              ))}
              <LabelList dataKey="amount" position="insideRight" fill="#000" fontSize={14} overflow={"visible"} className='font-bold' />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className='w-[100%]'>
      <div className='flex items-center justify-between mt-6'>
        <h1 className=' text-xl tracking-tight font-bold mb-5'>Recent Transactions</h1>
        <div className='flex items-center justify-start gap-5'>
          <button className='bg-none hover:underline text-blue-400' onClick={()=>{navigate("/transactions", { replace: true });}}>Show more</button>
          <button onClick={()=>{setTrxns([]);fetchTransactions();}}><TbReload /></button>
        </div>
      </div><hr />
      {console.log(trxns)}
      {trxns.length > 0 ? (
        trxns.map((txn, index) => (
          <div key={index} className="p-[7px] flex items-center ">
            <div className='w-[50%] text-slate-400'><strong>{`${txn.transactionMode}-${txn.accountName}`}</strong></div>
            <div className='w-[20%] text-slate-400'><strong> {TimeStamp(txn.timestamp).date}</strong></div>
            <div className='w-[20%] text-slate-400'><strong> {TimeStamp(txn.timestamp).time}</strong></div>
            <div className={`text-right w-[10%] ${txn.type == 'Debit' ? 'text-red-500': 'text-green-400'}`}><strong>&#8377;  {txn.transactionAmount}</strong> </div>
          </div>
        ))
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
    </div>
  )
}

export default Home
