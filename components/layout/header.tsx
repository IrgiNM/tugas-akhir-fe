"use client"
import React, { useEffect, useState } from 'react'
import MainButton from '../sections/mainButton'
import Image from 'next/image'
import { GetDataUser } from '@/lib/function/userFunction'

const Header = () => {
  const [test, setTest] = useState(false)
  const {dataUser} = GetDataUser()

  useEffect(()=>{
    const fetch = async() => {
        if(dataUser.length > 0){
            setTest(true)
        }
    }
    fetch();
  }, [dataUser])
  
  return (
    <div className='relative z-10 w-full p-8 px-12 flex flex-row justify-between items-end'>
            <div className='flex flex-col'>
                <h1 className='text-xl font-bold mb-1'>Detection Malware</h1>
                <h2 className='text-md'>Klasifikasi Trafik Jaringan Server Kampus</h2>
            </div>
            <div className='flex flex-row items-center justify-center'>
                <div className='animate-ping flex items-center justify-center border-2 rounded-full w-[70px] h-[70px] border-red-500 mr-8'>
                    <Image src="/warning.png" alt="Logo" width={30} height={30} />
                </div>
                <div className={`w-4 h-4 mr-2 ${test ? 'bg-green-400':'bg-red-400'} rounded-full`}></div>
                <p>API</p>
            </div>
        </div>
  )
}

export default Header