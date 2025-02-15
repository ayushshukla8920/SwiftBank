import React, { useEffect, useState } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { TbReload } from "react-icons/tb";
import axios from 'axios';
import { serverURL } from '@/config';

const Transactions = (props) => {
  const sessionId = localStorage.getItem('sessionId');
  const [page, setPage] = useState(1);
  const [trxns, setTrxns] = useState([]);
  const [totalTrxn,setTotalTrxn] = useState(0);

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
      const response = await axios.post(`${serverURL}/trxn/get-by-page`, {
        cid: props.user.BankDetails.customerId,
        page: page,
        sessionId
      });
      setTrxns((prevTrxns) => [...prevTrxns, ...response.data.transactions]);
      setTotalTrxn(response.data.totalTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions.");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  return (
    <div className="px-[5vw] py-11">
      <div className="flex items-end">
        <h1 className="text-5xl font-semibold tracking-tighter">Transactions</h1>
      </div>
      <Card className="w-[70vw] p-4 mt-[5vh]">
        <CardTitle className='px-5 py-3 text-xl'>
          <div className='flex items-center justify-between'>
            <h1>Transaction History</h1>
            <div className='flex items-center justify-center gap-10'>
              <h1 className='text-[#FFBA00] text-base'>Showing {trxns.length} of {totalTrxn}</h1>
              <button onClick={()=>{setTrxns([]);setPage(1);fetchTransactions();}}><TbReload /></button>
            </div>
          </div>
        </CardTitle>
        <CardContent className='mt-10'>
          {trxns.length > 0 ? (
            trxns.map((txn, index) => (
              <div key={index} className="p-3 border-b border-gray-700 flex items-center ">
                <div className='w-[50%]'><strong>{`${txn.transactionMode}-${txn.accountName}`}</strong></div>
                <div className='w-[20%]'><strong> {TimeStamp(txn.timestamp).date}</strong></div>
                <div className='w-[20%]'><strong> {TimeStamp(txn.timestamp).time}</strong></div>
                <div className={`text-right w-[10%] ${txn.type == 'Debit' ? 'text-red-500': 'text-green-400'}`}><strong>&#8377;  {txn.transactionAmount}</strong> </div>
              </div>
            ))
          ) : (
            <p>No transactions found.</p>
          )}
        </CardContent>
        <div className="flex justify-center mt-5">
        {(trxns.length < totalTrxn) ? <button className="px-5 py-2 bg-blue-600 text-white rounded-2xl" onClick={() => setPage(prevPage => prevPage + 1)}>
          Load More
        </button>: <h1 className='text-slate-500 font-bold'>End of Transactions</h1>}
      </div>
      </Card>
      
      

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
  );
};

export default Transactions;
