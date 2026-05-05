"use client"
import Header from '@/components/layout/header';
import TableResultSSCL from '@/components/layout/tableResultSSCL';
import TrafficAndButton from '@/components/layout/trafficAndButton';
import Navbar from '@/components/layout/navbar';
import Dashboard from '@/components/ui/dashboard'
import Image from 'next/image';
import React, { useState } from 'react'
import GetLogPage from '@/components/ui/getLogPage';
import DataUser from '@/components/ui/dataUser';
import { loginUser } from '@/lib/function/userFunction';
import { setToken } from '@/lib/function/token';
import { dataNetworkTrafficFunction } from '@/lib/function/dataNetworkTrafficFunction';
import DetectionMalwarePage from '@/components/ui/detectionMalwarePage';

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState('Get Log UPA TIK')
  const [Login, setLogin] = useState(true)
  const [isRemoveData, setisRemoveData] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const {dataNerworkTraffic} = dataNetworkTrafficFunction()


  const handleLogin = async () => {
    setIsLoading(true);
    try{
        const res = await loginUser({ 
            username: username,
            password: password 
        });
        if (res) {
          setUsername('');
          setPassword('');
          setLogin(false);
        } else {
            alert(res);
        }
    }finally{
        setIsLoading(false);
    }
  }

  


  return (
    <>
      <div className='w-full relative h-screen flex flex-col gap-3 items-center bg-black'>
          <Header></Header>
          <Navbar 
            click1={() => setIsActive('Get Log UPA TIK')}
            click4={() => setIsActive('Data User')}
            click3={() => setisRemoveData(true)}
            click2={() => setIsActive('Detection Malware')}
            isActived={isActive}
          ></Navbar>
          <div className='h-[80%] w-full'>
            {isActive==='Get Log UPA TIK'&&(
              <GetLogPage click1={()=>{setIsLoading(true)}} />
            )}
            {isActive==='Detection Malware'&&(
              <DetectionMalwarePage />
            )}
            {isActive==='Data User'&&(
              <DataUser/>
            )}
          </div>
          
          {Login && (  
            <div className='w-full h-screen fixed z-30 flex justify-center items-center'>
              <div className='w-full h-screen bg-black opacity-100'></div>
              <div className='absolute w-[400px] rounded-xl flex flex-col p-10 items justify-center border-1 border-white bg-black'>
                <p className='text-[20px] font-bold'>Login</p>
                <p className='mb-7'>masukan username dan password yang sudah terdaftar</p>

                <p className='mb-2'>Username :</p>
                <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='w-full border-1 border-gray-600 rounded-md p-2 mb-2'
                />
                
                <p className='mb-2'>Password :</p>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full border-1 border-gray-600 rounded-md p-2 mb-2'
                />

                <button onClick={()=>{handleLogin()}} className='w-full p-3 rounded-md border-1 border-white text-white font-bold mt-7 hover:bg-white hover:text-black transition-all duration-250'>Login</button>
                {/* <div className='w-full h-[.5px] my-5 bg-gray-600'/>
                <button className='w-full p-3 rounded-md border-1 border-white text-white font-bold flex flex-row gap-2 justify-center items-center hover:bg-gray-900 transition-all duration-250'>
                  <Image src="/google.png" alt="Logo" width={20} height={20}/>
                  <p>Login with Google</p>
                </button> */}

                <button onClick={()=>{setLogin(false)}} className='w-[35px] h-[35px] bg-black font-bold border-3 border-white rounded-md absolute -top-2 -right-2 hover:bg-white hover:text-black transition-all duration-250'>X</button>
              </div>
            </div>
          )}
      </div>

      {isRemoveData && (
          <>
              <div className='w-screen h-screen bg-black fixed z-11 top-0 left-0 opacity-90'>
              </div>
              <div className='fixed z-12 w-full h-full top-0 bottom-0 flex justify-center items-center'>
                  <div className='absolute rounded-xl flex flex-col p-10 items justify-center border-1 border-white bg-black'>    
                      <p className='text-[20px] font-bold'>Reset Data</p>
                      {dataNerworkTraffic.length > 0 ? (
                        <>
                          <p className='mb-7'>yakin mau mereset semua data?</p>
                          <button onClick={()=>{}} className='w-full p-3 rounded-md border-1 border-white text-white font-bold mt-7 hover:bg-white hover:text-black transition-all duration-250'>Ya</button>
                        </>
                      ):(
                        <p>data tidak ada satupun. apa yang mau di reset?</p>
                      )}

                      <button onClick={()=>{setisRemoveData(false)}} className='w-[35px] h-[35px] bg-black font-bold border-3 border-white rounded-md absolute -top-2 -right-2 hover:bg-white hover:text-black transition-all duration-250'>X</button>
                  </div>
              </div>
          </>
      )}
    </>
  )
}

export default page