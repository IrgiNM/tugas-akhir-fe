"use client"
import Header from '@/components/layout/header';
import Navbar from '@/components/layout/navbar';
import DataUser from '@/components/ui/dataUser';
import GetLogPage from '@/components/ui/getLogPage';
import SecurityEventsPage from '@/components/ui/securityEventsPage';
import { dataNetworkTrafficFunction } from '@/lib/data/dataNetworkTrafficFunction';
import { getMe, getPermission } from '@/lib/function/api';
import { getToken, setIdUserToken, setUsernameToken } from '@/lib/function/token';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState('Top Reports')
  const [isRemoveData, setisRemoveData] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const {dataNerworkTraffic} = dataNetworkTrafficFunction()
  const [permissionsNow, setPermissionsNow] = useState<string[]>([]);

  useEffect(()=>{
    const token = getToken();
    if(!token){
      router.push('/');
    }
  }, [])

  useEffect(()=>{
    const fetch = async () => {
      const res = await getMe();
      if(res.status === 200){
        setUsernameToken(res.data.username)
        setIdUserToken(res.data.id)
        
      }
    }
    fetch();
  }, [])

  useEffect(()=>{
    const fetch = async () => {
      const id = localStorage.getItem("id_user");
      const res = await getPermission(Number(id));
      if(res.status === 200){
        const permissions: string[] = res.data.map(
          (item: { name: string }) => item.name
        );
        setPermissionsNow(permissions);
        localStorage.setItem(
          "permission",
          JSON.stringify(permissions)
        );
      }
    }
    fetch();
  }, [])

  

  return (
    <>
      <div className='w-full relative h-full flex flex-col gap-3 items-center bg-[#070616]'>
          <Header></Header>
          <Navbar 
            click1={() => setIsActive('Top Reports')}
            click4={() => setIsActive('Data User')}
            click3={() => setisRemoveData(true)}
            click2={() => setIsActive('Security Events')}
            isActived={isActive}
          ></Navbar>
          <div className='h-[80%] w-full'>
            {(isActive==='Top Reports' && permissionsNow.includes("top reports"))&&(
              <GetLogPage click1={()=>{setIsLoading(true)}} />
            )}
            {(isActive==='Security Events' && permissionsNow.includes("security event"))&&(
              <SecurityEventsPage />
            )}
            {isActive==='Data User'&&(
              <DataUser/>
            )}
          </div>
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