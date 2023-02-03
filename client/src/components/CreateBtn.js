import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { setGlobalState, useGlobalState } from "../utils";
import { XMarkIcon } from "@heroicons/react/24/outline";

function CreateBtn({ contract }) {
  return (
   <>
    <div
        className="CreateProject "
        onClick={() => setGlobalState('createModal', 'scale-100')}
      >
        Add project
      </div>
      <CreateProject contract={contract}/>
   </>
  )
}

function CreateProject({ contract }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [minBid, setMinBid] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState(null);
  const [preview, setPreview] = useState(null);
  const [createModal] = useGlobalState("createModal");
  const Pinata_key = "597362dfc5807385f2b0";
  const Pinata_secret =
    "244390cd0cb6c389181435356593b53aedfe6799e537ce67c859f40042568109";

  
  const toTimestamp = (dateStr) => {
    const dateObj = Date.parse(dateStr);
    return dateObj / 1000;
  };

  const uploadToIpfs = async (e) => {
    e.preventDefault();
    const imageData = e.target.files[0];
    if (imageData) {
      setPreview(URL.createObjectURL(imageData));
      try {
        const formData = new FormData();
        formData.append("file", imageData);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: Pinata_key,
            pinata_secret_api_key: Pinata_secret,
          },
        });
        const imageURL = `ipfs://${response.data.IpfsHash}`;
        setImageURL(imageURL);
        console.log("image uploaded", imageURL);
      } catch (error) {
        console.log("error image upload", error);
      }
    }
  };

  const Create = async (e) => {
    if (!title || !description || !cost || !date || !imageURL || !minBid) {
      return;
    }
    e.preventDefault();

    try {
      const fee = await contract.projectTax();
      const response = await contract.createProject(
        title,
        description,
        imageURL,
        ethers.utils.parseEther(cost.toString()),
        ethers.utils.parseEther(minBid.toString()),
        toTimestamp(date),
        { value: ethers.utils.parseUnits(fee.toString(), "wei") }
      );
      await response.wait();
      console.log(response);
      reset();
      setGlobalState('createModal', 'scale-0')
    } catch (error) {
      console.log("Create Project error", error);
    }
  };

  const reset = () => {
    setTitle("");
    setDescription("");
    setImageURL("");
    setCost("");
    setMinBid("");
    setDate(null);
  };

  return (
    <div
      className={`fixed h-screen w-screen top-0 left-0
       bg-black bg-opacity-50 items-center justify-center ${createModal}`}
    >
      <div
        className="bg-white shadow-xl shadow-black
       rounded-xl w-3/4 m-10 mx-auto p-6 space-y-7"
      >
        <div className="flex flex-row items-center justify-between pb-12 ">
          <h1 className="text-3xl font-semibold text-black ">Add Project</h1>
          <XMarkIcon
            onClick={() => setGlobalState("createModal", "scale-0")}
            className="h-8 p-1 rounded-full border-[1px] border-gray-600
             text-gray-600 cursor-pointer"
          />
        </div>

        <div>
          <img
            src={
              preview ||
              "https://media.wired.com/photos/5926e64caf95806129f50fde/master/pass/AnkiHP.jpg"
            }
            alt="project title"
            className="h-52 object-contain rounded-xl mx-auto "
          />
        </div>

        <form
          onSubmit={Create}
          className="flex flex-col justify-center space-y-6"
        >
          <div className="CreateInput">
            <p>title</p>
            <input
              type="text"
              className="flex-1 pl-5 px-3 outline-none bg-transparent "
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div className="CreateInput">
            <p>description</p>
            <input
              type="text"
              className="flex-1 pl-5 px-3 outline-none bg-transparent "
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
          <div className="CreateInput">
            <p>cost ETH</p>
            <input
              type="text"
              className="flex-1 pl-5 px-3 outline-none bg-transparent "
              onChange={(e) => {
                setCost(e.target.value);
              }}
            />
          </div>
          <div className="CreateInput">
            <p>Minimum Donation</p>
            <input
              type="text"
              className="flex-1 pl-5 px-3 outline-none bg-transparent "
              onChange={(e) => {
                setMinBid(e.target.value);
              }}
            />
          </div>
          <div className="CreateInput">
            <p>date</p>
            <input
              type="date"
              className="flex-1 pl-5 px-3 outline-none bg-transparent "
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </div>
          <div className="CreateInput">
            <p>image</p>
            <input
              type="file"
              onChange={uploadToIpfs}
              className="flex-1 pl-5 px-3 outline-none bg-transparent file:rounded-xl file:outline-none file:border-[1px] file:border-blue-400 file:py-0.5 file:px-1 file:text-sm "
            />
          </div>
          <button
            type="submit"
            className="py-3 px-5 
            rounded-lg bg-blue-500 text-white font-semibold text-xl
             active:scale-105 transition-transform duration-200 ease-in-out"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBtn;
