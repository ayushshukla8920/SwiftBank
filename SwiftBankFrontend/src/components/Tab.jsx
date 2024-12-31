import React from 'react'
import { useNavigate } from 'react-router-dom';

const Tab = (props) => {
  const navigate = useNavigate();
  const handleClick = ()=>{
    if (props.text==='Home'){
      navigate('/',{replace: true});
    }
    if (props.text==='Transaction History'){
      navigate('/transactions',{replace: true});
    }
    if (props.text==='Transfer Funds'){
      navigate('/transfer-funds',{replace: true});
    }
    if (props.text==='Deposit'){
      navigate('/deposit',{replace: true});
    }
  }
  const selected = props.selected;
  return (
    <>
      {selected && <div className='bg-blue-600 text-left px-8 w-100% rounded-xl py-4 my-7 ml-6 hover:cursor-pointer' onClick={handleClick}>
            <h1 className='text-xl font-semibold'>{props.text}</h1>
        </div>}
      {!selected && <div className='text-left w-100% rounded-md py-4 px-8 my-7 ml-6 hover:cursor-pointer' onClick={handleClick}>
          <h1 className='text-xl font-semibold'>{props.text}</h1>
      </div>}
    </>
  )
}

export default Tab
