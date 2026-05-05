"use client"

import { dataResultDetection } from '@/lib/data/dataResultDetection'
import { dataLog } from '@/type/dataLogType'
import Image from 'next/image'
import React, { useState } from 'react'

const TableResultSSCL = () => {
  const [data, setData] = useState<dataLog[]>(dataResultDetection)
  const [isActive, setIsActive] = useState(false)
  const [filter, setFilter] = useState('All')
  const limit = [100, 500, 1000, 5000]

  return (
    <div className='w-full px-12 flex flex-col gap-2'>
        <div className='relative w-full flex flex-row items-center justify-evenly gap-3 p-3 rounded-md border-1 border-white mt-5 mb-3'>
            <p className=' border-1 border-gray-700 rounded-md p-3 flex justify-center'>No.</p>
            <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>Protokol</p>
            <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>durasi</p>
            <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>jumlah byte</p>
            <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>jumlah packet</p>
            <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>status koneksi</p>
            <p className='w-full border-1 border-white rounded-md p-3 flex justify-center'>status label</p>
            <button className='absolute right-0 -top-13 border-1 border-white py-1 w-[250px] rounded-md flex flex-row gap-3 items-center justify-center hover:bg-gray-700' onClick={()=>{
                setIsActive(!isActive)
            }}>
                <div className='flex flex-row items-center gap-3'>
                    <p>filter :</p>
                    <div className='flex flex-row items-center gap-2'>
                        {filter !== 'All' && (
                            <div className={`w-[12px] h-[12px] 
                                ${filter==='DDoS'?'bg-orange-500':
                                filter==='Port Scanning'?'bg-purple-500':
                                filter==='Botnet'?'bg-yellow-500':
                                filter==='Brute Force'?'bg-blue-500':''} 
                                rounded-full`}
                            />
                        )}
                        <p>{filter}</p>
                    </div>
                </div>
                <Image src="/arrow-icon.png" alt="Logo" width={10} height={10} />
            </button>
            {isActive && (
                <div className='bg-black absolute -top-2 right-0 p-3 w-[200px] border-1 flex flex-col gap-2 items-start justify-center rounded-md'>
                    <button onClick={()=>{setIsActive(false);setFilter('DDoS')}} className='hover:pl-2 transition-all duration-200 flex flex-row items-center gap-2'>
                        <div className='w-[12px] h-[12px] bg-orange-500 rounded-full'/>
                        <p>DDoS</p>
                    </button>
                    <button onClick={()=>{setIsActive(false);setFilter('Port Scanning')}} className='hover:pl-2 transition-all duration-200 flex flex-row items-center gap-2'>
                        <div className='w-[12px] h-[12px] bg-purple-500 rounded-full'/>
                        <p>Port Scanning</p>
                    </button>
                    <button onClick={()=>{setIsActive(false);setFilter('Botnet')}} className='hover:pl-2 transition-all duration-200 flex flex-row items-center gap-2'>
                        <div className='w-[12px] h-[12px] bg-yellow-500 rounded-full'/>
                        <p>Botnet</p>
                    </button>
                    <button onClick={()=>{setIsActive(false);setFilter('Brute Force')}} className='hover:pl-2 transition-all duration-200 flex flex-row items-center gap-2'>
                        <div className='w-[12px] h-[12px] bg-blue-500 rounded-full'/>
                        <p>Brute Force</p>
                    </button>
                </div>
            )}
        </div>
        <div className='w-full h-[470px] flex flex-col gap-3 pt-[10px] pb-[50px] items-center justify-start overflow-auto'>
            {data.map((item,index)=>{
                return(
                    <div className='w-full flex flex-row items-center justify-evenly gap-3 p-3 rounded-md border-1 border-gray-700'>
                        <p className='flex justify-center pl-5'>{index+1}</p>
                        <p className='w-full flex justify-center'>{item.protocol}</p>
                        <p className='w-full flex justify-center'>{item.duration}</p>
                        <p className='w-full flex justify-center'>{item.bytes}</p>
                        <p className='w-full flex justify-center'>{item.packets}</p>
                        <p className='w-full flex justify-center'>{item.connectionStatus}</p>
                        <p className={`w-full flex justify-center py-3 rounded-md border-2
                            ${item.label === 'DDoS'?'border-orange-500 bg-[#3a1402] text-orange-500 font-bold':
                            item.label === 'Port Scanning'?'border-purple-500 bg-[#2e023a] text-purple-500 font-bold':
                            item.label === 'Botnet'?'border-yellow-500 bg-[#3a3402] text-yellow-500 font-bold':
                            'border-blue-500 bg-[#021a3a] text-blue-500 font-bold'
                            } font-bold`}>{item.label}</p>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default TableResultSSCL