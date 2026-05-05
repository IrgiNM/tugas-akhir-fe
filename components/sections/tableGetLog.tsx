"use client"
import { dataResultDetection } from '@/lib/data/dataResultDetection'
import { dataNetworkTrafficFunction } from '@/lib/function/dataNetworkTrafficFunction'
import { ClickType } from '@/type/clickType'
import { dataLog } from '@/type/dataLogType'
import React, { useState } from 'react'

const TableGetLog = ({click1}: ClickType) => {
  const [data, setData] = useState<dataLog[]>(dataResultDetection)
  const {dataNerworkTraffic} = dataNetworkTrafficFunction()
  return (
    <>
        <div className='w-[60%] h-full flex flex-col items-end gap-2'>
            <div className='relative w-full flex flex-row items-center justify-evenly gap-3 p-3 rounded-md border-1 border-white mt-4 mb-3'>
                <p className=' border-1 border-gray-700 rounded-md p-3 flex justify-center'>No.</p>
                <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>Protokol</p>
                <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>durasi</p>
                <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>jumlah byte</p>
                <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>jumlah packet</p>
                <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>status koneksi</p>
                <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>label</p>
            </div>
            <div className='w-full h-full flex flex-col gap-3 pt-[10px] pb-[50px] items-center justify-start overflow-auto scrollbar-hide'>
                {dataNerworkTraffic.map((item,index)=>{
                    return(
                        <div className='w-full flex flex-row items-center justify-evenly gap-3 p-3 rounded-md border-1 border-gray-700'>
                            <p className='flex justify-center pl-5'>{item.id}</p>
                            <p className='w-full flex justify-center'>{item.protokol}</p>
                            <p className='w-full flex justify-center'>{item.durasi}</p>
                            <p className='w-full flex justify-center'>{item.jumlah_bytes}</p>
                            <p className='w-full flex justify-center'>{item.jumlah_packet}</p>
                            <p className='w-full flex justify-center'>{item.status_koneksi}</p>
                            <p className='w-full flex justify-center'>{item.label}</p>
                        </div>
                    )
                })}
                {dataNerworkTraffic.length === 0 && (
                    <>
                        <div className='w-full h-full flex flex-col items-center justify-center'>
                            <p className='text-gray-500'>Tidak ada data log yang tersedia.</p>
                            <button onClick={click1} className='p-2 px-4 font-bold border-1 border-white rounded-md mt-3 hover:bg-white hover:text-black'>Get Log</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    </>
  )
}

export default TableGetLog