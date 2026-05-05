import { dataNetworkTrafficFunction } from '@/lib/function/dataNetworkTrafficFunction'
import React from 'react'

const DiagramJumlahPacket = () => {
  const {dataJumlahPacket, dataCount, dataTenY, dataNerworkTraffic} = dataNetworkTrafficFunction()
  const datacolorBG = ['bg-[#3a1402]', 'bg-[#2e023a]', 'bg-[#3a3402]', 'bg-[#023a2e]', 'bg-[#022e3a]', 'bg-[#3a022e]']
  const datacolorText = ['text-orange-500', 'text-purple-500', 'text-yellow-500', 'text-green-500', 'text-blue-500', 'text-pink-500']
  const datacolorBorder = ['border-orange-500', 'border-purple-500', 'border-yellow-500', 'border-green-500', 'border-blue-500', 'border-pink-500']

  return (
    <div className='w-full flex flex-col border-1 border-white rounded-md p-5'>
        <p className='text-[20px] font-bold'>Jumlah Packet</p>
        <p className='mb-7'>Statistik banyak nya Jumlah Packet yang ada</p>
        {dataNerworkTraffic.length === 0 ? (
            <p className='text-[12px]'>Tidak ada data</p>
        ):(
            <div className='w-full h-full rounded-md flex flex-col pr-2 items-start justify-center gap-3'>
                {dataJumlahPacket.map((item,index)=>{
                    const count = Math.round(330/dataCount)
                    return (
                        <div className='w-full flex flex-row'>
                            <p className={`font-bold text-[12px] w-[50px] ${datacolorText[index]}`}>{Math.round(Number(item.name))}</p>
                            <div key={index} style={{ width: `${(item.value * 80)/dataCount}%` }} className={`w-full border-2 ${datacolorBorder[index]} ${datacolorBG[index]} flex items-center justify-center rounded-md`}>
                            </div>
                            <p className={`font-bold text-[12px] ml-3 w-[50px] ${datacolorText[index]}`}>{item.value}</p>
                        </div>
                    )
                })}
                <div className='w-[80%] flex flex-row justify-between items-end ml-[48px] mr-3 border-t-1 border-gray-600'>
                    <p className='text-[10px]'>0</p>
                    <p className='text-[10px]'>{dataCount}</p>
                </div>
            </div>
        )}
    </div>
  )
}

export default DiagramJumlahPacket