import { dataNetworkTrafficFunction } from '@/lib/function/dataNetworkTrafficFunction'
import React from 'react'

const DiagramStatusKoneksi = () => {
  const {dataStatusKoneksi, dataCount, dataTenY, dataNerworkTraffic} = dataNetworkTrafficFunction()
  const datacolorBG = ['bg-[#3a1402]', 'bg-[#2e023a]', 'bg-[#3a3402]', 'bg-[#023a2e]', 'bg-[#022e3a]', 'bg-[#3a022e]']
  const datacolorText = ['text-orange-500', 'text-purple-500', 'text-yellow-500', 'text-green-500', 'text-blue-500', 'text-pink-500']
  const datacolorBorder = ['border-orange-500', 'border-purple-500', 'border-yellow-500', 'border-green-500', 'border-blue-500', 'border-pink-500']

  return (
    <div className='w-full flex flex-col border-1 border-white rounded-md p-5'>
        <p className='text-[20px] font-bold'>Status Koneksi</p>
        <p className='mb-7'>Statistik banyak nya Status Koneksi yang ada</p>
        {dataNerworkTraffic.length === 0 ? (
            <p className='text-[12px]'>Tidak ada data</p>
        ):(
            <div className='w-full h-full rounded-md flex items-end justify-center gap-3'>
                <div className='h-[330px] flex flex-col justify-between items-end mr-3 pr-3 border-r-1 border-gray-600'>
                    {dataTenY.map((item,index)=>{
                        return(
                            <p key={index} className='text-[10px]'>{item}</p>
                        )
                    })}
                    <p className='text-[10px]'>0</p>
                </div>
                {dataStatusKoneksi.map((item,index)=>{
                    const count = Math.round(330/dataCount)
                    return (
                        <div key={index} style={{ height: `${item.value * count}px` }} className={`w-full border-2 ${datacolorBorder[index]} ${datacolorBG[index]} flex items-center justify-center rounded-md`}>
                            <p className={`font-bold text-[12px] ${datacolorText[index]}`}>{item.name}</p>
                        </div>
                    )
                })}
            </div>
        )}
    </div>
  )
}

export default DiagramStatusKoneksi