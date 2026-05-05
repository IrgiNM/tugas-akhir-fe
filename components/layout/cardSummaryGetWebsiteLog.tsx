"use client"
import Image from 'next/image'
import React, { useState } from 'react'

const CardSummaryGetWebsiteLog = () => {
    const [isStatusCode, setisStatusCode] = useState(false)
    const [isMethod, setisMethod] = useState(false)
    const [isProtocol, setisProtocol] = useState(false)
    const [isIpAddress, setisIpAddress] = useState(false)
  return (
    <div className='w-full bg-[#10101b] flex flex-row p-5 gap-3 rounded-md'>
        {/* IP ADDRESS */}
        <div className='flex flex-1 flex-row items-center justify-center p-5 gap-3 rounded-xl border-[.5px] border-gray-700'>
            <div className='flex justify-center items-center w-[50px] h-[50px] rounded-full bg-[#022c3a] border-2 border-blue-500'>
                <p className='font-bold text-[22px]'>IP</p>
            </div>
            <div className='flex flex-col justify-center items-start'>
                <div className='flex flex-row items-center gap-3'>
                    <p className='font-bold text-[25px]'>4</p>
                    <button onClick={()=>{setisIpAddress(true)}} className='flex flex-row justify-between items-center gap-4 px-2 py-1 border-1 border-gray-500 rounded-lg hover:bg-gray-700'>
                        <p>More</p>
                        <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                    </button>
                    <div className=''>

                    </div>
                </div>
                <p className=''>total IP Address</p>
            </div>
        </div>
        {/* WAKTU LOG */}
        <div className='flex flex-row items-center justify-center p-5 gap-3 rounded-xl border-[.5px] border-gray-700'>
            <div className='flex justify-center items-center w-[50px] h-[50px] rounded-full bg-[#3a1402] border-2 border-orange-500'>
                <Image src="/time.png" alt="Logo" width={25} height={25} />
            </div>
            <div className='flex flex-1 gap-2 flex-col justify-center items-start'>
                <div className='flex flex-row items-center gap-3'>
                    <p className='w-full border-[.5px] border-gray-700 p-2 rounded-lg font-bold text-[15px]'>28 Jun 2025 03:00</p>
                    <p>-</p>
                    <p className='w-full border-[.5px] border-gray-700 p-2 rounded-lg font-bold text-[15px]'>28 Jun 2025 03:00</p>
                </div>
                <p className=''>rentang aktivitas waktu log</p>
            </div>
        </div>
        {/* HTTP METHOD */}
        <div className='flex flex-1 flex-row justify-center p-5 gap-3 rounded-xl border-[.5px] items-center border-gray-700'>
            <div className='flex justify-center items-center w-[50px] h-[50px] rounded-full bg-[#023a1e] border-2 border-green-500'>
                <Image src="/http.png" alt="Logo" width={18} height={18} />
            </div>
            <div className='flex flex-col justify-center items-start'>
                <div className='flex flex-row items-center gap-3'>
                    <p className='font-bold text-[25px]'>4</p>
                    <button onClick={()=>{setisMethod(true)}} className='flex flex-row justify-between items-center gap-4 px-2 py-1 border-1 border-gray-500 rounded-lg hover:bg-gray-700'>
                        <p>More</p>
                        <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                    </button>
                    <div className=''>

                    </div>
                </div>
                <p className=''>total HTTP method</p>
            </div>
        </div>
        {/* PROTOCOL */}
        <div className='flex flex-1 flex-row justify-center p-5 gap-3 rounded-xl border-[.5px] items-center border-gray-700'>
            <div className='flex justify-center items-center w-[50px] h-[50px] rounded-full bg-[#2c023a] border-2 border-purple-500'>
                <Image src="/wifi.png" alt="Logo" width={22} height={22} />
            </div>
            <div className='flex flex-col justify-center items-start'>
                <div className='flex flex-row items-center gap-3'>
                    <p className='font-bold text-[25px]'>4</p>
                    <button onClick={()=>{setisProtocol(true)}} className='flex flex-row justify-between items-center gap-4 px-2 py-1 border-1 border-gray-500 rounded-lg hover:bg-gray-700'>
                        <p>More</p>
                        <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                    </button>
                    <div className=''>

                    </div>
                </div>
                <p className=''>total jenis protocol</p>
            </div>
        </div>
        {/* STATUS CODE */}
        <div className='flex-1 flex flex-row justify-center p-5 gap-3 rounded-xl border-[.5px] items-center border-gray-700'>
            <div className='flex justify-center items-center w-[50px] h-[50px] rounded-full bg-[#3a020f] border-2 border-red-500'>
                <Image src="/status.png" alt="Logo" width={22} height={22} />
            </div>
            <div className='flex flex-col justify-center items-start'>
                <div className='flex flex-row items-center gap-3'>
                    <p className='font-bold text-[25px]'>4</p>
                    <button onClick={()=>{setisStatusCode(true)}} className='flex flex-row justify-between items-center gap-4 px-2 py-1 border-1 border-gray-500 rounded-lg hover:bg-gray-700'>
                        <p>More</p>
                        <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                    </button>
                    <div className=''>

                    </div>
                </div>
                <p className=''>total status code</p>
            </div>
        </div>

        {isStatusCode && (
          <>
              <div className='w-screen h-screen bg-black fixed z-11 top-0 left-0 opacity-90'>
              </div>
              <div className='fixed z-12 w-full h-full top-0 bottom-0 flex justify-center items-start gap-2 top-[200px]'>
                  <div className=' rounded-xl flex flex-col p-10 items justify-center border-1 border-white bg-black'>    
                      <p className='font-bold text-[20px]'>Status Code</p>
                      <p className=' mb-5'>bisa dilihat disini ada status code apa saja yang ada</p>

                      <div className='w-full flex flex-row justify-between items-center p-3 border-1 border-gray-700 rounded-lg mb-2'>
                        <p>200</p>
                        <p>435 pcs</p>
                      </div>
                  </div>
                  <button onClick={()=>{setisStatusCode(false)}} className=' rounded-lg flex flex-col p-3 items justify-center border-2 border-white bg-black hover:bg-gray-700'>
                    <Image src="/close.png" alt="Logo" width={12} height={12} />
                  </button>
              </div>
          </>
      )}
        {isMethod && (
          <>
              <div className='w-screen h-screen bg-black fixed z-11 top-0 left-0 opacity-90'>
              </div>
              <div className='fixed z-12 w-full h-full top-0 bottom-0 flex justify-center items-start gap-2 top-[200px]'>
                  <div className=' rounded-xl flex flex-col p-10 items justify-center border-1 border-white bg-black'>    
                      <p className='font-bold text-[20px]'>HTTP Method</p>
                      <p className=' mb-5'>bisa dilihat disini ada http method apa saja yang ada</p>

                      <div className='w-full flex flex-row justify-between items-center p-3 border-1 border-gray-700 rounded-lg mb-2'>
                        <p>GET</p>
                        <p>435 pcs</p>
                      </div>
                  </div>
                  <button onClick={()=>{setisMethod(false)}} className=' rounded-lg flex flex-col p-3 items justify-center border-2 border-white bg-black hover:bg-gray-700'>
                    <Image src="/close.png" alt="Logo" width={12} height={12} />
                  </button>
              </div>
          </>
      )}
        {isProtocol && (
          <>
              <div className='w-screen h-screen bg-black fixed z-11 top-0 left-0 opacity-90'>
              </div>
              <div className='fixed z-12 w-full h-full top-0 bottom-0 flex justify-center items-start gap-2 top-[200px]'>
                  <div className=' rounded-xl flex flex-col p-10 items justify-center border-1 border-white bg-black'>    
                      <p className='font-bold text-[20px]'>Protocol</p>
                      <p className=' mb-5'>bisa dilihat disini ada protocol apa saja yang ada</p>

                      <div className='w-full flex flex-row justify-between items-center p-3 border-1 border-gray-700 rounded-lg mb-2'>
                        <p>HTTP/1.1</p>
                        <p>435 pcs</p>
                      </div>
                  </div>
                  <button onClick={()=>{setisProtocol(false)}} className=' rounded-lg flex flex-col p-3 items justify-center border-2 border-white bg-black hover:bg-gray-700'>
                    <Image src="/close.png" alt="Logo" width={12} height={12} />
                  </button>
              </div>
          </>
      )}
        {isIpAddress && (
          <>
              <div className='w-screen h-screen bg-black fixed z-11 top-0 left-0 opacity-90'>
              </div>
              <div className='fixed z-12 w-full h-full top-0 bottom-0 flex justify-center items-start gap-2 top-[200px]'>
                  <div className=' rounded-xl flex flex-col p-10 items justify-center border-1 border-white bg-black'>    
                      <p className='font-bold text-[20px]'>IP Address</p>
                      <p className=' mb-5'>bisa dilihat disini ada IP address apa saja yang ada</p>

                      <div className='w-full flex flex-row justify-between items-center p-3 border-1 border-gray-700 rounded-lg mb-2'>
                        <p>192.168.0.1</p>
                        <p>435 pcs</p>
                      </div>
                  </div>
                  <button onClick={()=>{setisIpAddress(false)}} className=' rounded-lg flex flex-col p-3 items justify-center border-2 border-white bg-black hover:bg-gray-700'>
                    <Image src="/close.png" alt="Logo" width={12} height={12} />
                  </button>
              </div>
          </>
      )}
    </div>
  )
}

export default CardSummaryGetWebsiteLog