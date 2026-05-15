"use client"
import DataTopReportsFunction from '@/lib/function/dataTopReports'
import { dataTopReportsType } from '@/type/dataTopReportsType'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import TableTopReports from './tableTopReports'
import { nameDataTopType } from '@/type/nameDataTopType'


const CardSummaryGetTopReports = () => {
    const [selectedView,setSelectedView] = useState<boolean>(false)
    const [selectedDate,setSelectedDate] = useState<boolean>(false)
    const [selectedMonth,setSelectedMonth] = useState<boolean>(false)
    const [pickJenisTop, setPickJenisTop] = useState<string>('')
    const [pickDateTop, setPickDateTop] = useState<string>('')
    const [pickMonthTop, setPickMonthTop] = useState<string>('')
    const [pickYearTop, setPickYearTop] = useState<string>('')
    const {dataTopReports, dataJenisTop, dataJenisAndCountTop, dataNameCountTop, dataDateAt,dataMonthAt,dataYearAt, dataStatistikPerMonth,dataNamePerMonth} = DataTopReportsFunction( pickDateTop,pickMonthTop,pickYearTop)
    const [totalConnections, setTotalConnections] = useState<number>(0)
    const [totalBytes, setTotalBytes] = useState<number>(0)
    const [totalReports, setTotalReports] = useState<number>(0)
    const [dataTop, setDataTop] = useState<dataTopReportsType[]>([])
    const [topBlocked, setTopBlocked] = useState<nameDataTopType[]>([])
    
    const COLORS = [
        "#ef4444", // red
        "#f97316", // orange
        "#eab308", // yellow
        "#84cc16", // lime
        "#22c55e", // green
        "#10b981", // emerald
        "#14b8a6", // teal
        "#06b6d4", // cyan
        "#0ea5e9", // sky
        "#3b82f6", // blue
        "#6366f1", // indigo
        "#8b5cf6", // violet
        "#a855f7", // purple
        "#d946ef", // fuchsia
        "#ec4899", // pink
        "#f43f5e", // rose
        "#f59e0b", // amber
        "#65a30d", // olive
        "#059669", // dark emerald
        "#0891b2", // dark cyan
        "#2563eb", // strong blue
        "#7c3aed", // strong violet
        "#c026d3", // magenta
        "#db2777", // hot pink
        "#dc2626", // strong red
        "#ea580c", // deep orange
        "#ca8a04", // mustard
        "#16a34a", // forest green
        "#0284c7", // ocean blue
        "#9333ea", // deep purple
    ];
    
    useEffect(() => {
        const filteredData = dataTopReports.filter(
            (item) => item.view_name === pickJenisTop
        )
        const filterNameData = dataNameCountTop.filter(
            (item) => item.view_name === pickJenisTop
        )
    
        const totalConnections = filteredData.reduce((acc, item) => {
            return acc + Number(item.connections || 0)
        }, 0)
    
        const totalBytes = filteredData.reduce((acc, item) => {
            return acc + Number(item.bytes || 0)
        }, 0)

        const uniqueViews = new Set(
            filteredData.map((item)=>item.name)
        ).size
    
        setTotalConnections(totalConnections)
        setTotalBytes(totalBytes)
        setTotalReports(uniqueViews)
        setDataTop(filteredData)
        setTopBlocked(filterNameData)
    }, [dataTopReports, pickJenisTop])
    
    useEffect(()=>{
        if(dataJenisTop.length > 0){
            setPickJenisTop(dataJenisTop[0])
        }
    }, [dataJenisTop])

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0].split('-')[2];
        const month = new Date().toISOString().split('T')[0].split('-')[1];
        const year = new Date().toISOString().split('T')[0].split('-')[0];
        setPickDateTop(today);
        setPickMonthTop(month);
        setPickYearTop(year);
    }, [])

  return (
    <div className='w-full bg-[#10101b] flex flex-col p-8 rounded-md flex-wrap'>
        <div className='flex flex-row gap-2 items-center relative mb-3'>
            <p className='font-bold text-[20px] mr-3'>Security Dashboard Report</p>
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
        
        <div className='w-full h-[350px] flex flex-row justify-center pr-10 py-10 items-center p-3 border-1 border-gray-700 rounded-lg mb-2'>
            <ResponsiveContainer width="50%" height="100%">
                <BarChart
                    data={topBlocked}
                    margin={{
                    top: 20,
                    right: 20,
                    left: -10,
                    bottom: 5,
                    }}
                    barSize={40}
                >
                    <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1f2937"
                    vertical={false}
                    />

                    <XAxis
                    dataKey="name"
                    stroke="#9ca3af"
                    tickLine={false}
                    axisLine={false}
                    />

                    <YAxis
                    stroke="#9ca3af"
                    tickLine={false}
                    axisLine={false}
                    />

                    <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                        backgroundColor: "#111827",
                        border: "1px solid #374151",
                        borderRadius: "12px",
                        color: "#fff",
                    }}
                    />

                    <Bar
                    dataKey="total"
                    radius={[12, 12, 0, 0]}
                    >
                    {topBlocked.map((entry, index) => (
                        <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        />
                    ))}

                    <LabelList
                        dataKey="total"
                        position="top"
                        fill="#fff"
                    />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            <div className='w-full flex flex-col p-3'>
                <div className=' rounded-md p-5'>
                    <p className='font-bold text-[18px]'>Top Blocked Protocols</p>
                    <p className='text-gray-500 mb-7'>monitoring protokol yang paling sering diblokir berdasarkan laporan yang tersedia</p>
                    <div className='flex flex-row gap-3 mb-3 p-0'>
                        {/* TOTAL REPORTS */}
                        <div className='flex flex-1 flex-row items-center p-5 gap-3 rounded-xl border-[.5px] border-gray-700'>
                            <div className='flex justify-center items-center w-[50px] h-[50px] rounded-full bg-[#022c3a] border-2 border-blue-500'>
                                <Image src="/status.png" alt="Logo" width={22} height={22} />
                            </div>

                            <div className='flex flex-col justify-center items-start'>
                                <div className='flex flex-row items-center gap-3'>
                                    <p className='font-bold text-[25px]'>{totalReports}</p>

                                    {/* <button onClick={()=>{setSelectedView('views')}} className='flex flex-row justify-between items-center gap-4 px-2 py-1 border-1 border-gray-500 rounded-lg hover:bg-gray-700'>
                                        <p>More</p>
                                        <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                                    </button> */}
                                </div>
                                <p>total reports</p>
                            </div>
                        </div>

                        {/* TOTAL CONNECTIONS */}
                        <div className='flex flex-1 flex-row items-center p-5 gap-3 rounded-xl border-[.5px] border-gray-700'>
                            <div className='flex justify-center items-center w-[50px] h-[50px] rounded-full bg-[#023a1e] border-2 border-green-500'>
                                <Image src="/http.png" alt="Logo" width={18} height={18} />
                            </div>

                            <div className='flex flex-col justify-center items-start'>
                                <p className='font-bold text-[25px]'>{totalConnections}</p>
                                <p>total connections</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row gap-3 p-0'>
                        {/* TOTAL BYTES */}
                        <div className='flex flex-1 flex-row items-center p-5 gap-3 rounded-xl border-[.5px] border-gray-700'>
                            <div className='flex justify-center items-center w-[50px] h-[50px] rounded-full bg-[#2c023a] border-2 border-purple-500'>
                                <Image src="/wifi.png" alt="Logo" width={22} height={22} />
                            </div>

                            <div className='flex flex-col justify-center items-start'>
                                <p className='font-bold text-[25px]'>{(totalBytes / (1024 * 1024)).toFixed(2)} MB</p>
                                <p>total traffic bytes</p>
                            </div>
                        </div>

                        {/* TOTAL VIEW TYPES */}
                        <div className='flex flex-1 flex-row items-center p-5 gap-3 rounded-xl border-[.5px] border-gray-700'>
                            {/* <div className='flex justify-center items-center w-[50px] h-[50px] rounded-full bg-[#3a020f] border-2 border-red-500'>
                                <Image src="/status.png" alt="Logo" width={22} height={22} />
                            </div>

                            <div className='flex flex-col justify-center items-start'>
                                <div className='flex flex-row items-center gap-3'>
                                    <p className='font-bold text-[25px]'>{totalViews}</p>

                                    <button onClick={()=>{setSelectedView('views')}} className='flex flex-row justify-between items-center gap-4 px-2 py-1 border-1 border-gray-500 rounded-lg hover:bg-gray-700'>
                                        <p>More</p>
                                        <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                                    </button>
                                </div>

                                <p>total report categories</p>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className='w-full h-[420px] flex flex-row justify-center py-5 items-center p-3 border-1 border-gray-700 rounded-lg mb-2'>
            <TableTopReports click1={()=>{}} data={dataTop}/>
        </div>

        <div className='w-full flex flex-col justify-center pr-10 py-10 p-3 border-1 border-gray-700 rounded-lg mb-2'>
            <div className='w-full flex flex-row justify-between items-end'>
                <p className='font-bold text-[18px] ml-10 mr-3'>Top Blocked Protocols</p>
                <div className='flex flex-row justify-end items-center gap-2'>
                    <button onClick={()=>{setSelectedMonth(true)}} className='flex flex-row justify-between items-center px-3 py-2 border-1 border-gray-700 rounded-md hover:bg-gray-700 transition-all duration-200 ease-in-out'>
                        <p className='font-bold mr-2'>Month</p>
                        <p className='mr-2 text-gray-500'>{pickYearTop+'-'+pickMonthTop}</p>
                        <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                    </button>
                    <button onClick={()=>{setSelectedView(true)}} className='flex flex-row justify-between items-center px-3 py-2 border-1 border-white rounded-md hover:bg-gray-700 transition-all duration-200 ease-in-out'>
                        <p className='font-bold mr-2'>View</p>
                        <p className='mr-2 text-gray-500'>{pickJenisTop}</p>
                        <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                    </button>
                </div>
            </div>
            <p className='text-gray-500 mb-10 ml-10'>monitoring protokol yang paling sering diblokir berdasarkan laporan yang tersedia</p>
            <div className='w-full h-[300px]'>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dataStatistikPerMonth.filter((item) => item.view_name === pickJenisTop)}>
                    <XAxis dataKey="time" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip />
                    <Legend
                            align="left"
                            wrapperStyle={{
                                display: "flex",
                                justifyContent: "flex-start",
                                flexWrap: "wrap",
                                gap: "10px",
                                paddingTop: "50px",
                                width: "100%",
                                left: 40,
                            }}
                        />
                    {/* Normal */}
                    {dataNamePerMonth.map((item,index)=>{
                            return(
                                <Line
                                    key={index}
                                    type="monotone"
                                    dataKey={item}
                                    stroke={COLORS[index % COLORS.length]}
                                    strokeWidth={2}
                                />
                            )
                    })}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* TOP */}
        {selectedView && (
            <>
                <div className='w-screen h-screen bg-black fixed z-11 top-0 left-0 opacity-90'>
                </div>
                <div className='fixed z-12 w-full h-full top-0 left-0 flex justify-center items-start gap-2 pt-[200px]'>
                    <div className='rounded-xl flex flex-col p-10 border-1 border-white bg-black min-w-[500px]'>
                        <p className='font-bold text-[20px]'>Report Categories</p>
                        <p className='mb-5'>daftar kategori report yang tersedia</p>
                        {dataJenisAndCountTop.map((item,index)=>{
                            return(
                                <button onClick={()=>{setPickJenisTop(item.view_name),setSelectedView(false)}} key={index} className='w-full flex flex-row justify-between items-center p-3 border-1 border-gray-700 rounded-lg mb-2 hover:bg-gray-900 transition-all duration-200 ease-in-out'>
                                    <p>{item.view_name}</p>
                                    <p>{item.count} data</p>
                                </button>
                            )
                        })}
                    </div>
                    <button onClick={()=>{setSelectedView(false)}} className='rounded-lg flex flex-col p-3 items-center justify-center border-2 border-white bg-black hover:bg-gray-700'>
                        <Image src="/close.png" alt="Logo" width={12} height={12} />
                    </button>
                </div>
            </>
        )}

        {/* DATE */}
        {selectedDate && (
            <>
                <div className='w-screen h-screen bg-black fixed z-11 top-0 left-0 opacity-90'>
                </div>
                <div className='fixed z-12 w-full h-full top-0 left-0 flex justify-center items-start gap-2 pt-[200px]'>
                    <div className='rounded-xl flex flex-col p-10 border-1 border-white bg-black min-w-[500px]'>
                        <p className='font-bold text-[20px]'>Available Report Dates</p>
                        <p className='mb-5'>Menampilkan daftar tanggal yang memiliki data report</p>
                        <div className='w-full flex flex-row justify-center items-start p-3 gap-2'>
                            <div className='flex-1 flex-col'>
                                <button className='w-full p-3 border-1 border-white rounded-md flex flex-row gap-2 justify-center items-center hover:bg-gray-900 mb-5'>
                                    {pickYearTop??''}
                                    <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                                </button>
                                <div className='w-full flex flex-col h-[150px] overflow-auto scrollbar-hide'>
                                    {dataYearAt.map((item,index)=>{
                                        return(
                                            <button onClick={()=>{setPickYearTop(item),setSelectedDate(false)}} key={index} className='w-full flex flex-row justify-center items-center p-3 border-1 border-gray-800 rounded-lg mb-2 hover:bg-gray-900 transition-all duration-200 ease-in-out'>
                                                <p>{item}</p>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className='flex-1 flex-col'>
                                <button className='w-full p-3 border-1 border-white rounded-md flex flex-row gap-2 justify-center items-center hover:bg-gray-900 mb-5'>
                                    {pickMonthTop??''}
                                    <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                                </button>
                                <div className='w-full flex flex-col h-[150px] overflow-auto scrollbar-hide'>
                                    {dataMonthAt.map((item,index)=>{
                                        return(
                                            <button onClick={()=>{setPickMonthTop(item),setSelectedDate(false)}} key={index} className='w-full flex flex-row justify-center items-center p-3 border-1 border-gray-800 rounded-lg mb-2 hover:bg-gray-900 transition-all duration-200 ease-in-out'>
                                                <p>{item}</p>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className='flex-1 flex-col'>
                                <button className='w-full p-3 border-1 border-white rounded-md flex flex-row gap-2 justify-center items-center hover:bg-gray-900 mb-5'>
                                    {pickDateTop??''}
                                    <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                                </button>
                                <div className='w-full flex flex-col h-[150px] overflow-auto scrollbar-hide'>    
                                    {dataDateAt.map((item,index)=>{
                                        return(
                                            <button onClick={()=>{setPickDateTop(item),setSelectedDate(false)}} key={index} className='w-full flex flex-row justify-center items-center p-3 border-1 border-gray-800 rounded-lg mb-2 hover:bg-gray-900 transition-all duration-200 ease-in-out'>
                                                <p>{item}</p>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={()=>{setSelectedDate(false)}} className='rounded-lg flex flex-col p-3 items-center justify-center border-2 border-white bg-black hover:bg-gray-700'>
                        <Image src="/close.png" alt="Logo" width={12} height={12} />
                    </button>
                </div>
            </>
        )}
        
        {/* DATE */}
        {selectedMonth && (
            <>
                <div className='w-screen h-screen bg-black fixed z-11 top-0 left-0 opacity-90'>
                </div>
                <div className='fixed z-12 w-full h-full top-0 left-0 flex justify-center items-start gap-2 pt-[200px]'>
                    <div className='rounded-xl flex flex-col p-10 border-1 border-white bg-black min-w-[500px]'>
                        <p className='font-bold text-[20px]'>Available Report Months</p>
                        <p className='mb-5'>Menampilkan daftar bulan yang memiliki data report</p>
                        <div className='w-full flex flex-row justify-center items-start p-3 gap-2'>
                            <div className='flex-1 flex-col'>
                                <button className='w-full p-3 border-1 border-white rounded-md flex flex-row gap-2 justify-center items-center hover:bg-gray-900 mb-5'>
                                    {pickYearTop??''}
                                    <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                                </button>
                                <div className='w-full flex flex-col h-[150px] overflow-auto scrollbar-hide'>
                                    {dataYearAt.map((item,index)=>{
                                        return(
                                            <button onClick={()=>{setPickYearTop(item),setSelectedMonth(false)}} key={index} className='w-full flex flex-row justify-center items-center p-3 border-1 border-gray-800 rounded-lg mb-2 hover:bg-gray-900 transition-all duration-200 ease-in-out'>
                                                <p>{item}</p>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className='flex-1 flex-col'>
                                <button className='w-full p-3 border-1 border-white rounded-md flex flex-row gap-2 justify-center items-center hover:bg-gray-900 mb-5'>
                                    {pickMonthTop??''}
                                    <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                                </button>
                                <div className='w-full flex flex-col h-[150px] overflow-auto scrollbar-hide'>
                                    {dataMonthAt.map((item,index)=>{
                                        return(
                                            <button onClick={()=>{setPickMonthTop(item),setSelectedMonth(false)}} key={index} className='w-full flex flex-row justify-center items-center p-3 border-1 border-gray-800 rounded-lg mb-2 hover:bg-gray-900 transition-all duration-200 ease-in-out'>
                                                <p>{item}</p>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={()=>{setSelectedMonth(false)}} className='rounded-lg flex flex-col p-3 items-center justify-center border-2 border-white bg-black hover:bg-gray-700'>
                        <Image src="/close.png" alt="Logo" width={12} height={12} />
                    </button>
                </div>
            </>
        )}
    </div>
  )
}

export default CardSummaryGetTopReports