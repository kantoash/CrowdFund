import React from "react";
import { useEffect, useState } from "react";
import { ABI, ADDRESS } from "./contract/index";
import { ethers } from "ethers";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import MyProject from "./MyProject";
import ProjectPage from "./ProjectPage";
import {  setGlobalState } from "./utils";

function App() {
  const [contract, setContract] = useState({});
  
  // useEffect(() => {
  //   const isWallectConnected = async () => {
  //     try {
  //       const Provider = new ethers.providers.Web3Provider(window.ethereum);

  //       window.ethereum.on("chainChanged", () => {
  //         window.location.reload();
  //       });

  //       window.ethereum.on("accountsChanged", () => {
  //         window.location.reload();
  //       });

  //       await Provider.send("eth_requestAccounts", []);
  //       const signer = Provider.getSigner();
  //       const accounts = signer.getAddress();
  //       setGlobalState("connectedAccount", (await accounts).toLowerCase());
  //       const contract = new ethers.Contract(ADDRESS, ABI, signer);
  //       setContract(contract);
  //     } catch (error) {
  //       console.log("wallet connect error", error);
  //     }
  //   };
  //   isWallectConnected();
  // }, []);

  useEffect(() => {
    const isWallectConnected = async () => {
      try {
        if (!window.ethereum) {
          console.log("window etherum no found please install metamask");
        }
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        setGlobalState("connectedAccount", accounts[0]?.toLowerCase());

        window.ethereum.on("chainChanged", (chainId) => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", async () => {
          await isWallectConnected();
          setGlobalState("connectedAccount", accounts[0]?.toLowerCase());
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(ADDRESS, ABI, signer);
        setContract(contract);
      } catch (error) {
        console.log("app loader error", error);
      }
    };
    isWallectConnected();
  }, []);

  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<Home contract={contract} />} />
        <Route path="/My-project" element={<MyProject contract={contract} />} />
        <Route
          path="/projects/:id"
          element={<ProjectPage contract={contract} />}
        />
      </Routes>
    </div>
  );
}

export default App;
