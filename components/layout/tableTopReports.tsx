"use client"
import { dataResultDetection } from '@/lib/data/dataResultDetection'
import { dataNetworkTrafficFunction } from '@/lib/function/dataNetworkTrafficFunction'
import DataTopReportsFunction from '@/lib/function/dataTopReports'
import { ClickType } from '@/type/clickType'
import { dataLog } from '@/type/dataLogType'
import { dataTopReportsType } from '@/type/dataTopReportsType'
import { tableTopReportsType } from '@/type/tableTopReportsType'
import React, { useState } from 'react'

const TableTopReports = ({click1, data}: { click1: () => void, data: dataTopReportsType[] }) => {
//   const [data, setData] = useState<dataLog[]>(dataResultDetection)
  return (
    <>
        <div className='w-[100%] h-[100%] flex flex-col items-end gap-2'>
            {/* HEADER */}
            <div className='relative w-full flex flex-row items-center justify-evenly gap-3 p-3 rounded-md border-1 border-white bg-[#10101b] mb-3'>
                <p className='border-1 border-gray-700 rounded-md p-3 flex justify-center'>No.</p>
                <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>Name</p>
                <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>Connections</p>
                <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>Bytes</p>
                <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>Detail</p>
                <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>Fetched At</p>
            </div>

            {/* BODY */}
            <div className='w-full flex flex-col gap-3 bg-[#10101b] rounded-lg pt-[10px] pb-[50px] items-center justify-start overflow-auto scrollbar-hide'>

                {data.map((item, index) => {
                    return (
                        <div
                            key={item.id}
                            className='w-full flex flex-row items-center justify-evenly gap-3 p-3 rounded-md border-1 border-gray-700'
                        >
                            <p className='flex justify-center pl-5'>{index + 1}</p>
                            <p className='w-full flex justify-center text-center'>{item.name}</p>
                            <p className='w-full flex justify-center'>{item.connections}</p>
                            <p className='w-full flex justify-center'>{item.formatted_bytes}</p>
                            <p className='w-full flex justify-center text-center'>{item.detail || '-'}</p>
                            <p className='w-full flex justify-center text-center'>{new Date(item.fetched_at).toLocaleString()}</p>
                        </div>
                    )
                })}

                {data.length === 0 && (
                    <div className='w-full h-full flex flex-col items-center justify-center'>
                        <p className='text-gray-500'>
                            Tidak ada data top reports yang tersedia.
                        </p>
                        <button
                            onClick={click1}
                            className='p-2 px-4 font-bold border-1 border-white rounded-md mt-3 hover:bg-white hover:text-black'
                        >
                            Get Data
                        </button>
                    </div>
                )}
            </div>
        </div>
    </>
  )
}

export default TableTopReports