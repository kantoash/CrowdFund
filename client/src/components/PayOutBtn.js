import React from 'react'

function PayOutBtn({contract , id}) {
  const pay = async () => {
    const PayTxn = await contract.payOut(id);
    await PayTxn.wait();
  }
  return (
    <>
        <div className='cursor-pointer bg-blue-500 rounded-full 
        p-4 uppercase text-white text-xl active:scale-105 
        duration-200 ease-in-out w-1/5 text-center'
          onClick={pay}
        >
          PayOut
        </div>
    </>
  )
}

export default PayOutBtn