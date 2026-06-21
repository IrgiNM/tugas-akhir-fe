"use client"
import { ClickType } from '@/type/clickType'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import CardSummaryGetTopReports from '../layout/cardSummaryGetTopReports'

const GetLogPage = ({click1}: ClickType) => {
    const [isActive, setIsActive] = useState('Top Reports')
    const [isAddCSV, setisAddCSV] = useState(false)
    const [isPickCreatedLog, setisPickCreatedLog] = useState(false)
    const [pickDate, setpickDate] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isDeteksiMalware, setisDeteksiMalware] = useState(false)
    const [filter, setFilter] = useState('All')
    const limit = [100, 500, 1000, 5000]

  
    return (
        <>
            <div className='relative flex flex-col items-center gap-5 w-full h-full px-12'>
                
                
                {isActive === 'Top Reports' && (
                    <>
                        <CardSummaryGetTopReports/>
                    </>
                )}
            </div>
        </>
    )
}

export default GetLogPage