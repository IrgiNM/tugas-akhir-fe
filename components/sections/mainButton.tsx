"use client"
import { buttonActionType } from '@/type/buttonActionType'
import Image from 'next/image'
import React, { useState } from 'react'

const MainButton = () => {
  const [isActive, setIsActive] = useState(false)
  const [logLimit, setLogLimit] = useState(1000)
  const limit = [100, 500, 1000, 5000]

  return (
    <>
        <div className='relative flex flex-col gap-2 justify-center items-center'>
            <ButtonAction
                label='Get Log UPA TIK'
            />
            <ButtonAction
                label='Deteksi Malware'
            />
            <ButtonAction
                label='Reset data'
            />
            <button className='border-1 border-white py-1 w-[200px] z-3 rounded-md flex flex-row gap-3 items-center justify-center hover:bg-gray-700' onClick={()=>{
                setIsActive(!isActive)
            }}>
                <p>batas log: <span className='text-green-400'>{logLimit}</span></p>
                <Image src="/arrow-icon.png" alt="Logo" width={10} height={10} />
            </button>
            {isActive && (
                <div className='bg-black absolute top-[210px] z-3 p-3 w-[200px] border-1 flex flex-col gap-2 items-start justify-center rounded-md'>
                    {limit.map((item,index)=>{
                        return(
                            <button key={index} className={`hover:pl-2 transition-all duration-200 cursor-pointer ${logLimit === item ? 'text-green-400' : ''}`} onClick={()=>{
                                setLogLimit(item)
                                setIsActive(false)
                            }}>{item}</button>
                        )
                    })}
                </div>
            )}
        </div>
    </>
  )
}

const ButtonAction = ({label,onClick}:buttonActionType) => {
    return(
        <button className='w-[200px] p-3 border-1 bg-white rounded-md text-black font-semibold hover:border-1 hover:border-white hover:bg-black hover:text-white transition duration-200 ease-in-out'>
            {label}
        </button>
    )
}

export default MainButton