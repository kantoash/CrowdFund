import { UserIcon } from "@heroicons/react/24/outline";
import { ethers } from "ethers";
import React from "react";
import { useNavigate } from "react-router-dom";
import { daysRemaining } from "../utils";

function ProjectsCard({ project }) {
  const navigate = useNavigate();
  let owner =
    project?.owner.slice(0, 4) +
    " ... " +
    project?.owner.slice(project?.owner.length - 4);
  const expired = new Date().getTime() > Number(project?.expiresAt + "000");
  return (
    <div
      onClick={() => navigate("/projects/" + project?.id)}
      className="flex flex-col justify-center flex-wrap w-80 bg-slate-200 p-3 rounded-lg shadow-xl shadow-gray-400 "
    >
      <div className="flex justify-start items-start ">
        <img
          src={`https://gateway.pinata.cloud/ipfs//${project?.imageURL.substring(
            7
          )}`}
          alt="projectImage"
          className="rounded-xl h-64 object-cover w-full  "
        />
      </div>

      <div className="p-5 flex flex-col flex-wrap space-y-1 ">
        <h1 className="text-xl text-gray-700 font-medium mb-2 ">
          {project?.title}
        </h1>

        <div className="flex flex-row justify-between items-center font-semibold text-gray-700 ">
          <UserIcon className="h-6 p-0.5 rounded-full border-[1px] border-gray-700" />
          <span>{owner}</span>
        </div>

        <div className="flex flex-col justify-center space-y-0.5 py-2">
          <small className="text-gray-500 text-sm">
            {" "}
            {expired ? "Expired" : daysRemaining(project?.expiresAt) + " left"}
          </small>
          <div className="w-full bg-gray-300 overflow-hidden">
            <div
              className="p-0.5 bg-green-600 rounded-l-full text-sm font-medium text-green-100 text-center leading-none  "
              style={{ width: `${(project?.raised / project?.cost) * 100}% ` }}
            />
          </div>

          <div className="flex justify-between flex-row items-center text-sm font-semibold ">
            <p>{ethers.utils.formatEther(project?.raised)} ETH Raised</p>
            <p>{ethers.utils.formatEther(project?.cost)} ETH</p>
          </div>
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
  );
}

export default ProjectsCard;
