"use client"
import { dataTopReportsType } from '@/type/dataTopReportsType'
import Image from 'next/image'
import { useEffect, useState } from 'react';

const TableTopReports = ({click1, data, pick}: { click1: (name: string) => void, data: dataTopReportsType[], pick: string }) => {
//   const [data, setData] = useState<dataLog[]>(dataResultDetection)
  const [permissionsNow, setPermissionsNow] = useState<string[]>([]);

  useEffect(() => {
    const storedPermissions = localStorage.getItem("permission");
    if (storedPermissions) {
      setPermissionsNow(JSON.parse(storedPermissions));
    }
  }, []);
    
  return (
    <>
        <div className='w-[100%] h-[100%] flex flex-col items-end gap-2'>
            {/* HEADER */}
            <div className='relative w-full flex flex-row items-center justify-evenly gap-3 p-3 rounded-md border-1 border-white bg-gradient-to-t from-[#111c45] to-[#120b2f] mb-3'>
                <p className='border-1 border-gray-700 rounded-md p-3 flex justify-center text-[#fcff50] font-bold'>No.</p>
                <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>Name</p>
                <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>Connections</p>
                <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>Bytes</p>
                <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>Detail</p>
                <p className='w-full border-1 border-gray-700 rounded-md p-3 flex justify-center'>Fetched At</p>
            </div>

            {/* BODY */}
            <div className='w-full flex flex-col gap-3 rounded-lg pt-[10px] pb-[10px] items-center justify-start overflow-auto scrollbar-hide'>

                {data.map((item, index) => {
                    return (
                        <div
                            key={item.id}
                            className='w-full flex flex-row items-center justify-evenly gap-3 p-3 rounded-md border-1 bg-gradient-to-t from-[#111c45] to-[#160e39] border-[#353b6c]'
                        >
                            <p className='flex justify-center pl-5 text-[#fcff50] font-bold'>{index + 1}</p>
                            {(permissionsNow.includes("geolocation")&&(pick === "top_blocked_destinations" || pick === "top_blocked_botnet_sites" || pick === "top_blocked_clients")) ?(
                                <button onClick={() => click1(item.name)} className='w-full flex flex-row py-2 ml-5 justify-center text-center rounded-md border-[1px] border-[#353b6c] hover:bg-[#353b6c]'>
                                    <p className='mr-5'>
                                        {item.name}
                                    </p>
                                    <div className='flex items-center justify-center'>
                                        <Image src="/arrow-right.png" alt="Logo" width={18} height={18} />
                                    </div>
                                </button>
                            ):(
                                <p className='w-full flex justify-center text-center'>{item.name}</p>
                            )}
                            <p className='w-full flex justify-center'>{item.connections}</p>
                            <p className='w-full flex justify-center'>{item.formatted_bytes}</p>
                            <p className='w-full flex justify-center text-center'>{item.detail || '-'}</p>
                            <p className='w-full flex justify-center text-center text-[#fcff50]'>{new Date(item.fetched_at).toLocaleString()}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    </>
  )
}

export default TableTopReports