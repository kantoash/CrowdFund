import React from 'react'

function DeleteBtn({contract , id}) {
  const Delete = async () => {
    const DelTxn = await contract.deleteProject(id);
    await DelTxn.wait();
  }
  return (
    <>
        <div className='cursor-pointer bg-red-500 rounded-full 
        p-4 uppercase text-white text-xl active:scale-105 duration-200 ease-in-out w-1/5 text-center' onClick={Delete}>Delete</div>
    </>
  )
}


export default DeleteBtn