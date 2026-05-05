import { dataResultDetection } from '@/lib/data/dataResultDetection'
import { CreateUser, GetDataUser } from '@/lib/function/userFunction'
import { dataLog } from '@/type/dataLogType'
import Image from 'next/image'
import React, { useState } from 'react'

const DataUser = () => {
  const [data, setData] = useState<dataLog[]>(dataResultDetection)
  const {dataUser} = GetDataUser()
//   const [data, setData] = useState<dataLog[]>([])

  const [isDelete, setisDelete] = useState(false)
  const [isAddUser, setisAddUser] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [error, setError] = useState('')

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')


  const addUser = async () => {
    setisLoading(true);
    try{
        if (password !== confirmPassword) {
        alert('Password dan konfirmasi password tidak sesuai.');
        //   setError('Password dan konfirmasi password tidak sesuai.');
          return;
        }
        const res = await CreateUser({ 
            username: username,
            email: email,
            password: password 
        });
        if (res) {
            alert(res);
            setisAddUser(false);
        } else {
            alert(res);
        }
    }finally{
        setisLoading(false);
    }
  }

  return (
    <div className='relative flex flex-row items-center justify-between gap-5 w-full h-full px-12'>
        {dataUser.length === 0 ? (
            <>
                <div className='w-full h-full flex flex-col items-center justify-center'>
                    <p className='text-gray-500'>Tidak ada user sama sekali.</p>
                    <button onClick={()=>{setisAddUser(true)}} className='p-2 px-4 font-bold border-1 border-white rounded-md mt-3 hover:bg-white hover:text-black'>+ Add User</button>
                </div>
            </>
        ):(
            <div className='w-full h-full flex flex-col items-center justify-center gap-2'>
                <div className='w-full h-full p-6 rounded-md border-1 border-gray-600 mt-4 mb-3'>
                    <div className='w-full flex flex-row flex-wrap gap-3 justify-start items-start'>
                        {dataUser.map((item,index)=>{
                            return(
                                <div key={index} className='w-[300px] h-[80px] flex flex-row p-3 items-center justify-between rounded-xl border-1 border-white'>
                                    <div className='flex flex-row items-center justify-center'>
                                        <div className='w-[50px] h-[50px] flex justify-center items-center rounded-full border-1 border-gray-700 mr-3'>
                                            <Image src="/admin.png" alt="Logo" width={20} height={20} className='mb-1' />
                                        </div>
                                        <div className=' h-full flex flex-col justify-center'>
                                            <p className='font-bold text-[15px]'>{item.username}</p>
                                            <p className=''>{item.email}</p>
                                        </div>
                                    </div>
                                    <button onClick={()=>setisDelete(true)} className='w-[50px] h-[50px] flex justify-center items-center rounded-md border-1 border-gray-700 hover:border-white hover:bg-gray-900 transition-all duration-200 cursor-pointer'>
                                        <Image src="/delete.png" alt="Logo" width={15} height={15} className='mb-1' />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )}

        {dataUser.length > 0 && (
            <button onClick={()=>{setisAddUser(true)}} className='absolute w-[200px] h-[1px] rounded-l-full bg-white text-black -top-5 right-0 p-5 flex justify-center items-center border-1 border-white hover:text-white hover:border-white hover:bg-black transition duration-200 ease-in-out cursor-pointer'>
                <p className='font-bold'>+ Add User</p>
            </button>
        )}

        {isDelete && (
            <>
                <div className='fixed w-full h-full bg-black opacity-90'></div>
                <div className='fixed w-full h-full top-0 bottom-0 flex justify-center items-center'>
                    <div className='absolute rounded-xl flex flex-col p-10 items justify-center border-1 border-white bg-black'>
                        
                        <p className='mb-7'>yakin ingin di delete ?</p>
                        

                        <button className='w-full p-3 rounded-md border-1 border-white text-white font-bold hover:bg-white hover:text-black transition-all duration-250'>Delete</button>
                        {/* <div className='w-full h-[.5px] my-5 bg-gray-600'/>
                        <button className='w-full p-3 rounded-md border-1 border-white text-white font-bold flex flex-row gap-2 justify-center items-center hover:bg-gray-900 transition-all duration-250'>
                            <Image src="/google.png" alt="Logo" width={20} height={20}/>
                            <p>Login with Google</p>
                        </button> */}

                        <button onClick={()=>{setisDelete(false)}} className='w-[35px] h-[35px] bg-black font-bold border-3 border-white rounded-md absolute -top-2 -right-2 hover:bg-white hover:text-black transition-all duration-250'>X</button>
                    </div>
                </div>
            </>
        )}
        
        {isAddUser && (
            <>
                <div className='fixed w-full h-full bg-black opacity-90'></div>
                <div className='fixed w-full h-full top-0 bottom-0 flex justify-center items-center'>
                    <div className='absolute rounded-xl flex flex-col p-10 items justify-center border-1 border-white bg-black'>    
                        <p className='text-[20px] font-bold'>Add User</p>
                        <p className='mb-7'>masukan username, email dan password yang belum terdaftar</p>

                        <p className='mb-2'>Username :</p>
                        <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='w-full border-1 border-gray-600 rounded-md p-2 mb-2'
                        />

                        <p className='mb-2'>Email :</p>
                        <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full border-1 border-gray-600 rounded-md p-2 mb-2'
                        />

                        <p className='mb-2'>Password :</p>
                        <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full border-1 border-gray-600 rounded-md p-2 mb-2'
                        />

                        <p className='mb-2'>Confirm Password :</p>
                        <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='w-full border-1 border-gray-600 rounded-md p-2'
                        />

                        <button onClick={()=>{addUser()}} className='w-full p-3 rounded-md border-1 border-white text-white font-bold mt-7 hover:bg-white hover:text-black transition-all duration-250'>+ Create</button>

                        <button onClick={()=>{setisAddUser(false)}} className='w-[35px] h-[35px] bg-black font-bold border-3 border-white rounded-md absolute -top-2 -right-2 hover:bg-white hover:text-black transition-all duration-250'>X</button>
                    </div>
                </div>
            </>
        )}
        
    </div>
  )
}

export default DataUser