"use client"
import { getToken } from '@/lib/function/token';
import { loginUser } from '@/lib/function/userFunction';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


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
          router.push('/dashboard');
        } else {
            alert(res);
        }
    }finally{
        setIsLoading(false);
    }
  }

  useEffect(()=>{
    const token = getToken();
    if(token){
      router.push('/dashboard');
    }
  }, [])

  


  return (
    <div className='w-full h-screen fixed z-30 flex justify-center items-center'>
      <div className='w-full h-screen bg-[#0c0b20] opacity-100'></div>
      <div className='absolute w-[400px] rounded-xl flex flex-col p-10 items justify-center border-1 border-white bg-gradient-to-t from-[#111c45] to-[#120b2f]'>
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
        <button onClick={()=>{handleLogin()}} className='w-full p-3 rounded-md border-1 border-white text-white font-bold mt-7 hover:bg-white hover:text-[#0c0b20] transition-all duration-250'>Login</button>
        {/* <div className='w-full h-[.5px] my-5 bg-gray-600'/>
        <button className='w-full p-3 rounded-md border-1 border-white text-white font-bold flex flex-row gap-2 justify-center items-center hover:bg-gray-900 transition-all duration-250'>
          <Image src="/google.png" alt="Logo" width={20} height={20}/>
          <p>Login with Google</p>
        </button> */}
        {/* <button onClick={()=>{setLogin(false)}} className='w-[35px] h-[35px] bg-[#0c0b20] font-bold border-3 border-white rounded-md absolute -top-2 -right-2 hover:bg-white hover:text-[#0c0b20] transition-all duration-250'>X</button> */}
      </div>
    </div>
  )
}

export default page