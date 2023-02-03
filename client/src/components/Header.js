import React from "react";
import { CircleStackIcon } from "@heroicons/react/24/outline";
import { ethers } from "ethers";
import { useNavigate } from "react-router";
import { truncate } from "../utils/func";
import { setGlobalState, useGlobalState } from "../utils";

function Header({ account }) {
  const navigate = useNavigate();
  const [connectedAccount] = useGlobalState("connectedAccount");

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert('Please install Metamask')
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
    } catch (error) {
      console.log("wallet connect error", error);
    }
  }
  return (
    <header className="flex flex-row items-center justify-between py-5 px-8 bg-white shadow-lg z-50">
      <div
        onClick={() => navigate("/")}
        className="flex flex-row items-center text-xl text-black space-x-1 cursor-pointer"
      >
        <h3>CrowdFunding</h3>
        <CircleStackIcon className="h-6" />
      </div>
     
      <div className="">
        {connectedAccount ? (
          <button type="button" className="ConnectBtn">
            {connectedAccount.slice(0, 4) +
              "..." +
              connectedAccount.slice(connectedAccount.length - 4)}
          </button>
        ) : (
          <button type="button" className="ConnectBtn" onClick={connectWallet}>
            connected
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
