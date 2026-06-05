"use client"
import DataTopReportsFunction from '@/lib/data/dataTopReports'
import { dataTopReportsType } from '@/type/dataTopReportsType'
import { nameDataTopType } from '@/type/nameDataTopType'
import Image from 'next/image'
import { useState } from 'react'
import DashboardDeviceUserActivityInformation from './dashboardDeviceUserActivityInformation'
import DashboardEventInformation from './dashboardEventInformation'
import NavbarSecurityEvent from './navbarSecurityEvent'

const CardSummarySecurityEvents = () => {
    const [selectedView,setSelectedView] = useState<boolean>(false)
    const [selectedDate,setSelectedDate] = useState<boolean>(false)
    const [selectedMonth,setSelectedMonth] = useState<boolean>(false)
    const [pickJenisTop, setPickJenisTop] = useState<string>('')
    const [pickDateTop, setPickDateTop] = useState<string>('')
    const [pickMonthTop, setPickMonthTop] = useState<string>('')
    const [pickYearTop, setPickYearTop] = useState<string>('')
    const {dataTopReports, dataJenisTop, dataNameCountTop, dataDateAt,dataMonthAt,dataYearAt, dataStatistikPerMonth,dataNamePerMonth} = DataTopReportsFunction( pickDateTop,pickMonthTop,pickYearTop)
    const [totalConnections, setTotalConnections] = useState<number>(0)
    const [totalBytes, setTotalBytes] = useState<number>(0)
    const [totalReports, setTotalReports] = useState<number>(0)
    const [dataTop, setDataTop] = useState<dataTopReportsType[]>([])
    const [topBlocked, setTopBlocked] = useState<nameDataTopType[]>([])
    const [pickNavbar, setPickNavbar] = useState<string>('Event Information')

  return (
    <div className='w-full bg-[#0c0b20] border-[.5px] border-[#353b6c] flex flex-col p-8 rounded-md mt-[135px] flex-wrap'>
        <div className='flex flex-row gap-2 items-center relative mb-3'>
            <p className='font-bold text-[20px] mr-3'>Security Events Report</p>
            <button onClick={()=>{setSelectedDate(true)}} className='flex flex-row justify-between items-center px-3 py-2 border-1 border-gray-700 rounded-md hover:bg-gray-700 transition-all duration-200 ease-in-out'>
                <p className='font-bold mr-2'>Date</p>
                <p className='mr-2 text-gray-500'>{pickYearTop+'-'+pickMonthTop+'-'+pickDateTop}</p>
                <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
            </button>
            <div className='flex flex-row justify-between items-center px-3 py-2 border-1 border-gray-700 rounded-md'>
                <p className='font-bold mr-2'>Total Data : </p>
                <p className='mr-2 text-gray-500'>{dataTopReports.length} data/hari</p>
            </div>
            <button onClick={()=>{setSelectedView(true)}} className='absolute right-0 flex flex-row justify-between items-center px-3 py-2 border-1 border-white rounded-md hover:bg-gray-700 transition-all duration-200 ease-in-out'>
                <p className='font-bold mr-2'>View</p>
                <p className='mr-2 text-gray-500'>{pickJenisTop}</p>
                <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
            </button>
        </div>
        <NavbarSecurityEvent
            pick={pickNavbar}
            click={(value) => setPickNavbar(value)}
        />
        {pickNavbar === 'Event Information' && (
            <DashboardEventInformation/>
        )}
        {pickNavbar === 'Device User Activity Information' && (
            <DashboardDeviceUserActivityInformation/>
        )}
    </div>
  )
}

export default CardSummarySecurityEvents