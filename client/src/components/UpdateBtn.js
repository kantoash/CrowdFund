import { XMarkIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { setGlobalState, useGlobalState } from '../utils'
import axios from "axios";
import { ethers } from 'ethers';

function UpdateBtn({ id, contract }) {
  const [updateModal] = useGlobalState('updateModal')

  return (
    <>
        <div className='cursor-pointer bg-yellow-500 rounded-full 
        p-4 uppercase text-white text-xl active:scale-105 duration-200 ease-in-out w-1/5 text-center' 
        onClick={() => setGlobalState('updateModal','scale-100')}>Update</div>
        <UpdateTemplate id={id} contract={contract} key={id} />
    </>
  )
}


function UpdateTemplate({ id, contract }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrL, setImageUrl] = useState('');
  const [cost, setCost] = useState('');
  const [minBid, setMinBid] = useState('');
  const [expiresAt, setExpireAt] = useState(null);
  const [preview, setPreview] = useState(null);
  const [updateModal] = useGlobalState('updateModal')
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
          setImageUrl(imageURL);
          console.log("image uploaded", imageURL);
        } catch (error) {
          console.log("error image upload", error);
        }
      }
    };

    
  const Update = async (e) => {
    e.preventDefault();
    if (!title || !description || !cost || !expiresAt || !imageUrL || !minBid) {
      return;
    }
   

    try {
      const response = await contract.UpdateProject(
        id,
        title,
        description,
        imageUrL,
        ethers.utils.parseEther(cost.toString()),
        ethers.utils.parseEther(minBid.toString()),
        toTimestamp(expiresAt)
      );
      await response.wait();
      console.log(response);
      reset();
      setGlobalState('updateModal', 'scale-0')
    } catch (error) {
      console.log("Create Project error", error);
    }
  };

  const reset = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setCost("");
    setMinBid("");
    setExpireAt(null);
  };


  return (
    <div className={`fixed h-screen w-screen top-0 left-0 bg-black bg-opacity-50 flex items-center justify-center ${updateModal} `}>
        <div className='bg-white shadow-lg shadow-black rounded-xl md:w-3/4 lg:w-1/2 p-6 space-y-5'>
        <div className="flex flex-row items-center justify-between pb-12 ">
          <h1 className="text-3xl font-semibold text-black ">Update Project</h1>
          <XMarkIcon onClick={() => setGlobalState('updateModal', 'scale-0')} className="h-8 p-1 rounded-full border-[1px] border-gray-600 text-gray-600 cursor-pointer" />
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
          onSubmit={Update}
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
                setExpireAt(e.target.value);
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
  )
}

export default UpdateBtn