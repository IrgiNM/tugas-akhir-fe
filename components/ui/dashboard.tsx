"use client"
import React, { useState } from 'react'
import Header from '../layout/header'
import TrafficAndButton from '../layout/trafficAndButton'
import TableResultSSCL from '../layout/tableResultSSCL'
import Image from 'next/image'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <div className='w-full flex flex-col gap-3 items-center bg-black'>
          <Header></Header>
          <TrafficAndButton></TrafficAndButton>
          <TableResultSSCL></TableResultSSCL>
      </div>

      {/* POPUP PROSESS */}
      {isLoading && (
        <>  
          <div className='w-screen h-screen bg-black fixed z-8 top-0 left-0 opacity-80'>
            <p>ssd</p>
          </div>
          <div className='w-screen h-screen fixed z-9 top-0 left-0 flex items-center justify-center'>
            <div className='w-[400px] h-[200px] rounded-md flex flex-col gap-3 items-center justify-center'>
              <Image src="/Loading.png" alt="Logo" width={50} height={50} className='animate-spin'/>
              <p>Progres...</p>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Dashboard