"use client"
import { dataResultDetection } from '@/lib/data/dataResultDetection'
import { dataNetworkTrafficFunction } from '@/lib/function/dataNetworkTrafficFunction'
import { ClickType } from '@/type/clickType'
import { dataLog } from '@/type/dataLogType'
import React, { useState } from 'react'

const TableDetectionWesiteLog = () => {
    const [data, setData] = useState<dataLog[]>(dataResultDetection)
    const {dataNerworkTraffic} = dataNetworkTrafficFunction()

    return (
      <>
          <div className='w-[100%] h-[78%] flex flex-col items-end gap-2'>
              <div className='relative w-full flex flex-row items-center justify-evenly gap-3 p-3 rounded-md border-1 border-white bg-[#10101b] mb-3'>
                  <p className=' border-1 border-gray-700 rounded-md p-3 flex justify-center'>No.</p>
                  <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>ip_address</p>
                  <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>timestamp</p>
                  <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>method</p>
                  <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>url</p>
                  <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>status_code</p>
                  <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>label</p>
                  <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>detail_label</p>
              </div>
              <div className='w-full flex flex-col gap-3 bg-[#10101b] rounded-lg pt-[10px] pb-[50px] items-center justify-start overflow-auto scrollbar-hide'>
                  {dataNerworkTraffic.map((item,index)=>{
                      return(
                          <div className='w-full flex flex-row items-center justify-evenly gap-3 p-3 rounded-md border-1 border-gray-700'>
                              <p className='flex justify-center pl-5'>{item.id}</p>
                              <p className='w-full flex justify-center'>103.24.213.141</p>
                              <p className='w-full flex justify-center'>28/Jun/2025:03:06:58 +0000</p>
                              <p className='w-full flex justify-center'>GET</p>
                              <p className='w-full flex justify-center'>/pengumuman-penting-jadwal-pengumuman-hasil-ujian-mandiri-konsorsium-diundur/?=cGjvsvvpP</p>
                              <p className='w-full flex justify-center'>444</p>
                              <p className='w-full flex justify-center'>malware</p>
                              <p className='w-full flex justify-center'>botnet</p>
                          </div>
                      )
                  })}
                  {dataNerworkTraffic.length === 0 && (
                      <>
                          <div className='w-full h-full flex flex-col items-center justify-center'>
                              <p className='text-gray-500'>Tidak ada data log yang tersedia.</p>
                          </div>
                      </>
                  )}
              </div>
          </div>
      </>
    )
}

export default TableDetectionWesiteLog