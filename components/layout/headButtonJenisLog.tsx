import DataLogDatasetFunction from '@/lib/function/dataLogDatasetFunction'
import { headButtonJenisLogType } from '@/type/headButtonJenisLogType'
import Image from 'next/image'
import React, { useState } from 'react'

const HeadButtonJenisLog = ({pick, click, click2}: headButtonJenisLogType) => {
  const [jenisLog, setJenisLog] = useState('HTTP Request')
  const {dataLogDataset} = DataLogDatasetFunction()

  return (
    <div className='w-full bg-[#10101b] flex flex-row py-3 px-5 gap-3 rounded-md'>
        <div className='flex flex-row gap-2 items-center'>
            <p className='font-bold'>Jenis Log : </p>
            <div className='p-2 border-1 border-gray-700 rounded-full flex items-center justify-center gap-2'>
                <button onClick={()=>{setJenisLog('HTTP Request')}} className={`p-2 px-5 rounded-full border-1 border-white font-bold ${jenisLog==='HTTP Request'?'text-black bg-white':'text-white bg-black hover:bg-gray-700'}`}>HTTP Request</button>
                <button onClick={()=>{setJenisLog('Traffic Network')}} className={`p-2 px-5 rounded-full border-1 border-white font-bold ${jenisLog==='Traffic Network'?'text-black bg-white':'text-white bg-black hover:bg-gray-700'}`}>Traffic Network</button>
            </div>
        </div>
        <div className='flex flex-row gap-2 items-center'>
            <p className='font-bold'>Jumlah Log HTTP Request : </p>
            <div className='p-2 border-1 border-gray-700 rounded-lg flex items-center justify-center gap-2'>
                <p className='text-white'>{dataLogDataset.length} pcs</p>
            </div>
        </div>
        <button onClick={click2} className='flex flex-col justify-center items-center px-5 border-1 rounded-lg border-white bg-black text-white hover:bg-gray-700'>
            <p>Created Log</p>
            <div className='flex flex-row items-center gap-2'>
                <p className='font-bold'>21/07/2026</p>
                <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
            </div>
        </button>
        {pick === 'get log' && (
            <>
                <div className='flex items-center justify-center mx-10'>
                    <Image src="/arrow-right.png" alt="Logo" width={18} height={18} />
                </div>
                <button onClick={click} className='p-2 px-5 flex flex-row items-center gap-3 rounded-lg bg-[#023a1e] border-2 border-green-500 font-bold text-white hover:bg-[#000000] hover:px-10 transition-all duration-200 ease-in-out'>
                    <p>Detection Malware</p>
                    <Image src="/scan.png" alt="Logo" width={18} height={18} />
                </button>
            </>
        )}
        {pick === 'malware' && (
            <>
                <button className='p-2 px-5 flex flex-row items-center ml-auto gap-3 rounded-lg border-2 border-gray-700 font-bold text-white'>
                    <p className='font-bold'>21 Jun 2025</p>
                    <p className=''>-</p>
                    <p className='font-bold'>28 Jun 2025</p>
                    <Image src="/time.png" alt="Logo" width={18} height={18} />
                </button>
                <button className='p-2 px-5 flex flex-row items-center gap-3 rounded-lg border-2 border-gray-700 font-bold text-white'>
                    <p className='font-bold'>Updated:</p>
                    <p className=''>2s ago</p>
                    <Image src="/time.png" alt="Logo" width={18} height={18} />
                </button>
                <button className='p-2 px-5 flex flex-row items-center gap-3 rounded-lg bg-[#3a0222] border-2 border-red-500 font-bold text-white hover:bg-[#000000] hover:px-10 transition-all duration-200 ease-in-out'>
                    <p>Reset Detection</p>
                    <Image src="/reset.png" alt="Logo" width={18} height={18} />
                </button>
            </>
        )}
    </div>
  )
}

export default HeadButtonJenisLog