import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { daysRemaining, truncate, useGlobalState } from "./utils";
import { UserIcon } from "@heroicons/react/24/outline";
import FundBtn from "./components/FundBtn";
import Moment from 'react-moment';
import DeleteBtn from "./components/DeleteBtn";
import PayOutBtn from "./components/PayOutBtn";
import UpdateBtn from "./components/UpdateBtn";

function ProjectPage({ contract }) {
  const { id } = useParams();
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [allFunders, setAllFunders] = useState(null);
  const [connectedAccount] = useGlobalState('connectedAccount')

  useEffect(() => {
    const loadProject = async () => {
      let Project = await contract.projects(id);
      let item = {
        id: Project.id,
        owner: Project.owner,
        title: Project.title,
        description: Project.description,
        imageURL: Project.imageURL,
        cost: ethers.utils.formatEther(Project?.cost),
        raised: ethers.utils.formatEther(Project?.raised),
        timestamp: Project.timestamp,
        expiresAt: Project.expiresAt,
        minBid: Project.minBid,
        fundersCount: Project.fundersCount,
        status: Project.status,
      };
      setProject(item);

    };
    loadProject();
  }, [contract]);

  useEffect(() => {
    const loadFunders = async () => {
      const AllFunders = await contract.getFunders(id);
      const temp = AllFunders.map((funder, id) => {
        let item = {
          owner: funder.owner,
          contribution: ethers.utils.formatEther(funder?.contribution),
          timestamp: funder.timestamp,
          refunded: funder.refunded,
        };
        return item;
      });
      setAllFunders(temp);
      setLoading(false);
    };
    loadFunders();
  }, [contract]);

  const expired = new Date().getTime() > Number(project?.expiresAt + "000");

  if (loading) {
    return (
      <>
        <div className="uppercase text-4xl text-blue-500 animate-pulse text-center pt-10">
          loading...
        </div>
      </>
    );
  }

 

  return (
    <div className="flex flex-col justify-center space-y-8 max-w-6xl mx-auto m-5">
      <div className="w-3/4 mx-auto mt-6 flex flex-row items-center space-x-10 justify-center ">
        <div className="flex-shrink-0">
          <img
            alt="projectImage"
            src={`https://gateway.pinata.cloud/ipfs//${project?.imageURL.substring(7)}`}
            className="h-40 md:h-52 lg:h-60 rounded-lg object-contain"
          />
        </div>
        <div className="flex flex-col space-y-2 justify-center flex-wrap">
          <div className="flex flex-col space-y-0.5 ">
            <h3 className="text-2xl text-gray-600 ">{project?.title}</h3>
            <p className="text-base text-gray-700 truncate">
              {project?.description}
            </p>
          </div>
          <small className="text-gray-500 text-sm">
            {" "}
            {expired ? "Expired" : daysRemaining(project?.expiresAt) + " left"}
          </small>
          <div className="flex flex-row space-x-3 justify-between items-center font-semibold text-gray-700 ">
            <UserIcon className="h-6 p-0.5 rounded-full border-[1px] border-gray-700" />
            <span>{truncate(connectedAccount,4,4,11)}</span>
          </div>
          <div className="w-full bg-gray-300 overflow-hidden">
            <div
              className="p-0.5 bg-green-600 rounded-full text-sm font-medium text-green-100 text-center leading-none  "
              style={{ width: `${(project?.raised / project?.cost) * 100}% ` }}
            />
          </div>
          <div className="flex justify-between flex-row items-center text-sm font-semibold ">
            <p> {project?.raised} ETH Raised</p>
            <p> {project?.cost} ETH</p>
          </div>
            
        <div className="flex flex-row items-center justify-between text-sm font-semibold ">
          <div>Funder Count: {Number(project?.fundersCount)}</div>
          <div className="text-base">
            {expired ? (
              <small className="text-red-500">Expired</small>
            ) : project?.status == 0 ? (
              <small className="text-gray-500">Open</small>
            ) : project?.status == 1 ? (
              <small className="text-green-500">Approved</small>
            ) : project?.status == 2 ? (
              <small className="text-gray-500">Reverted</small>
            ) : project?.status == 3 ? (
              <small className="text-red-500">Deleted</small>
            ) : (
              <small className="text-blue-500">payOut</small>
            )}
          </div>
        </div>
        </div>
      </div>
      <div className="flex flex-row items-center space-x-3 justify-center">
        <FundBtn id={id} contract={contract} key={id} />
        <DeleteBtn id={id} contract={contract} key={id} />
        <PayOutBtn id={id} contract={contract} key={id} />
        <UpdateBtn id={id} contract={contract} key={id} />
      </div>

      <div className="flex flex-col space-y-3 justify-center items-center m-4 ">
        {allFunders.map((funder, id) => (
          <div className={`flex flex-row space-x-5 justify-between py-3 px-6 rounded-full w-full  items-center text-lg text-gray-700 font-semibold ${!funder?.refunded ? 'bg-green-300' :  'bg-red-300'} `}>
            <h3>
              {funder?.owner.slice(0, 4) +
                "..." +
                funder?.owner.slice(funder?.owner.length - 4)}
            </h3>
            <Moment fromNow>{funder?.timestamp}</Moment>
            <h3>{funder?.contribution}</h3>
          </div>
        ))}
      </div>

    </div>
  );
}

export default ProjectPage;
