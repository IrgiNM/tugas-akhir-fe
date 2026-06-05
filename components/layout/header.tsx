"use client"
import { GetDataUser } from '@/lib/function/userFunction'
import Image from 'next/image'
import { useEffect, useState } from 'react'

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
    <div className='fixed z-10 w-full p-8 px-12 bg-[#120b2f] flex flex-row justify-between items-end'>
        <div className='flex flex-row items-center justify-center gap-3'>
            <div className='flex justify-center items-center border-[.5px] rounded-full w-[70px] h-[70px] border-[#353b6c] bg-gradient-to-b from-white to-[#91caff]'>
                <Image src="/polindra-logo.png" alt="Logo" width={50} height={50} />
            </div>
            <div className='flex flex-col'>
                <h1 className='text-xl font-bold mb-1'>UPA-TIK Log Monitoring</h1>
                <h2 className='text-md'>monitoring log jaringan pada server UPA-TIK Polindra</h2>
            </div>
        </div>
            <div className='flex flex-row items-center justify-center'>
                {/* <div className='animate-ping flex items-center justify-center border-2 rounded-full w-[70px] h-[70px] border-red-500 mr-8'>
                    <Image src="/warning.png" alt="Logo" width={30} height={30} />
                </div> */}
                <div className={`w-4 h-4 mr-2 ${test ? 'bg-green-400':'bg-red-400'} rounded-full`}></div>
                <p>API</p>
            </div>
        </div>
  )
}

export default Header