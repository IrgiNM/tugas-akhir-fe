import { statistikDataType } from '@/type/statistikDataType'
import React from 'react'

const CountData = () => {
  return (
    <div className='flex flex-row gap-2 items-center'>
        <div className='flex flex-col gap-2 items-start justify-center'>
            <DataCard label='Total Malware' value={900}/>
            <DataCard label='Total Normal' value={300}/>
        </div>
        <div className='flex flex-col gap-2 items-start justify-center'>
            <DataCard label='Total Log' value={1200}/>
            <DataCard label='Tingkat Akurasi' value={95}/>
        </div>
    </div>
  )
}

const DataCard = ({label,value}:statistikDataType) => {
    return(
        <div className='p-5 w-[200px] border-1 border-white rounded-md flex flex-col'>
            <p className=''>{label}</p>
            <p className='text-[20px] font-bold'>{value}{label==='Tingkat Akurasi'&&" %"}</p>
        </div>
    )
}

export default CountData