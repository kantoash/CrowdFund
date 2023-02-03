import React, { useState } from "react";
import { useGlobalState, setGlobalState } from "../utils";
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ethers } from "ethers";
function FundBtn({ id, contract }) {
  return (
    <>
      <div
        className="cursor-pointer bg-green-500 rounded-full 
        p-4 uppercase text-white text-xl active:scale-105 duration-200 ease-in-out w-1/5 text-center"
        onClick={() => setGlobalState("fundProject", "scale-100")}
      >
        Contribute
      </div>
      <FundTemplate id={id} contract={contract} />
    </>
  );
}

function FundTemplate({ id, contract }) {

  const [fundProject] = useGlobalState("fundProject");
  const [fundAmt, setFundAmt] = useState(null);


  const FundProject = async () => {
    const FundTxn = 
    await contract.contribution(id, {value: ethers.utils.parseUnits(fundAmt.toString(), "ether")})
    await FundTxn.wait()
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex
    items-center justify-center bg-black bg-opacity-50 w ${fundProject} '`} 
    >
      <div className="bg-white shadow-lg shadow-black rounded-xl md:w-3/4 lg:w-1/2 p-6 space-y-5">
        <div className="flex flex-row items-center justify-between pb-12 ">
          <h1 className="text-3xl font-semibold text-black ">Fund Project</h1>
          <XMarkIcon onClick={() => setGlobalState('fundProject', 'scale-0')} className="h-8 p-1 rounded-full border-[1px] border-gray-600 text-gray-600 cursor-pointer" />
        </div>
        <div className="CreateInput">
            <p>Fund Amount</p>
            <input
              type="text"
              className="flex-1 pl-5 px-3 outline-none bg-transparent "
              onChange={(e) => {
                setFundAmt(e.target.value);
              }}
            />
          </div>
          <button onClick={FundProject} className="py-3 px-5 w-full
            rounded-lg bg-blue-500 text-white font-semibold text-xl
             active:scale-105 transition-transform duration-300 ease-in-out">
            Fund Project
          </button>
      </div>
    </div>
  );
}

export default FundBtn;
