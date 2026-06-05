"use client"
import dataGeoLocationIP from '@/lib/data/dataGeoLocationIP'
import DataTopReportsFunction from '@/lib/data/dataTopReports'
import { backupDatabase } from '@/lib/function/api'
import { dataTopReportsType } from '@/type/dataTopReportsType'
import { nameDataTopType } from '@/type/nameDataTopType'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import GeoMap from '../sections/geoMap'
import TableTopReports from './tableTopReports'


const CardSummaryGetTopReports = () => {
    const [selectedView,setSelectedView] = useState<boolean>(false)
    const [selectedDate,setSelectedDate] = useState<boolean>(false)
    const [selectedMonth,setSelectedMonth] = useState<boolean>(false)
    const [pickJenisTop, setPickJenisTop] = useState<string>('')
    const [pickIP, setPickIP] = useState<string>('')
    const [pickDateTop, setPickDateTop] = useState<string>('')
    const [pickMonthTop, setPickMonthTop] = useState<string>('')
    const [pickYearTop, setPickYearTop] = useState<string>('')
    
    const [pickBackupAwalYear, setPickBackupAwalYear] = useState<string>('0000')
    const [pickBackupAwalMonth, setPickBackupAwalMonth] = useState<string>('00')
    const [pickBackupAwalDate, setPickBackupAwalDate] = useState<string>('00')
    const [pickBackupAkhirYear, setPickBackupAkhirYear] = useState<string>('0000')
    const [pickBackupAkhirMonth, setPickBackupAkhirMonth] = useState<string>('00')
    const [pickBackupAkhirDate, setPickBackupAkhirDate] = useState<string>('00')

    const {dataTopReports, dataJenisTop, dataSecurityJenisAndCountTop, dataExecutiveJenisAndCountTop, dataNameCountTop, dataDateAt,dataMonthAt,dataYearAt, dataStatistikPerMonth,namesByView} = DataTopReportsFunction( pickDateTop,pickMonthTop,pickYearTop)
    const {dataGeo} = dataGeoLocationIP(pickIP)
    const [totalConnections, setTotalConnections] = useState<number>(0)
    const [totalBytes, setTotalBytes] = useState<number>(0)
    const [totalReports, setTotalReports] = useState<number>(0)
    const [dataTop, setDataTop] = useState<dataTopReportsType[]>([])
    const [topBlocked, setTopBlocked] = useState<nameDataTopType[]>([])

    const [isJenisSecurity, setIsJenisSecurity] = useState<boolean>(false)
    const [isJenisExecutive, setIsJenisExecutive] = useState<boolean>(true)
    const [isDetailIp, setIsDetailIp] = useState<boolean>(false)
    
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

    const handleBackup = async () => {
      try {
        const response = await backupDatabase();
    
        const url = window.URL.createObjectURL(
          new Blob([response.data])
        );
    
        const link = document.createElement("a");
        link.href = url;
    
        const filename = `backup_${new Date()
          .toISOString()
          .replace(/[:.]/g, "-")}.dump`;
    
        link.setAttribute("download", filename);
    
        document.body.appendChild(link);
        link.click();
    
        link.remove();
    
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className='w-full bg-[#0c0b20] border-[.5px] border-[#353b6c] flex flex-col p-8 rounded-md flex-wrap mt-[135px]'>
        <div className='flex flex-row gap-2 items-center relative mb-3'>
            <p className='font-bold text-[20px] mr-3'>Top Report</p>
            <button onClick={()=>{setSelectedDate(true)}} className='flex flex-row justify-between items-center px-3 py-2 border-1 border-gray-700 rounded-md hover:bg-[#353b6c] transition-all duration-200 ease-in-out group'>
                <p className='font-bold mr-2'>Date</p>
                <p className='mr-2 text-gray-500 group-hover:text-white transition-all duration-200 ease-in-out'>{pickYearTop+'-'+pickMonthTop+'-'+pickDateTop}</p>
                <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
            </button>
            <div className='flex flex-row justify-between items-center px-3 py-2 border-1 border-gray-700 rounded-md'>
                <p className='font-bold mr-2'>Total Data : </p>
                <p className='mr-2 text-gray-500'>{dataTopReports.length} data/hari</p>
            </div>
            <button onClick={()=>{setSelectedView(true)}} className='absolute right-0 flex flex-row justify-between items-center px-3 py-2 border-1 border-white rounded-md hover:bg-[#353b6c] transition-all duration-200 ease-in-out group'>
                <p className='font-bold mr-2'>View</p>
                <p className='mr-2 text-gray-500 group-hover:text-white transition-all duration-200 ease-in-out'>{pickJenisTop}</p>
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
            <div className='w-[600px] flex flex-col p-3'>
                <div className=' rounded-md p-5'>
                    <p className='font-bold text-[18px]'>Top {pickJenisTop.replace("top_", "").replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase())}</p>
                    <p className='text-gray-500 mb-7'>monitoring {pickJenisTop.replace("top_", "").replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase())} yang paling sering diblokir berdasarkan laporan yang tersedia</p>
                    <div className='flex flex-row gap-3 mb-3 p-0'>
                        {/* TOTAL REPORTS */}
                        <div className='flex flex-1 flex-row items-center bg-gradient-to-t from-[#111c45] to-[#120b2f] p-5 gap-3 rounded-xl border-[.5px] border-[#353b6c]'>
                            <div className='flex justify-center items-center w-[50px] h-[50px] rounded-full bg-[#3a2604] border-2 border-[#fdff71]'>
                                <Image src="/status.png" alt="Logo" width={22} height={22} />
                            </div>

                            <div className='flex flex-col justify-center items-start'>
                                <div className='flex flex-row items-center gap-3'>
                                    <p className='font-bold text-[20px]'>{totalReports}</p>

                                    {/* <button onClick={()=>{setSelectedView('views')}} className='flex flex-row justify-between items-center gap-4 px-2 py-1 border-1 border-gray-500 rounded-lg hover:bg-gray-700'>
                                        <p>More</p>
                                        <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                                    </button> */}
                                </div>
                                <p>total reports</p>
                            </div>
                        </div>

                        {/* TOTAL CONNECTIONS */}
                        <div className='flex flex-1 flex-row items-center p-5 gap-3 bg-gradient-to-t from-[#111c45] to-[#120b2f] rounded-xl border-[.5px] border-[#353b6c]'>
                            <div className='flex justify-center items-center w-[50px] h-[50px] rounded-full bg-[#071049] border-2 border-blue-500'>
                                <Image src="/http.png" alt="Logo" width={18} height={18} />
                            </div>

                            <div className='flex flex-col justify-center items-start'>
                                <p className='font-bold text-[20px]'>{totalConnections}</p>
                                <p>total connections</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row gap-3 p-0'>
                        {/* TOTAL BYTES */}
                        <div className='flex flex-1 flex-row items-center bg-gradient-to-t from-[#111c45] to-[#120b2f] p-5 gap-3 rounded-xl border-[.5px] border-[#353b6c]'>
                            <div className='flex justify-center items-center w-[50px] h-[50px] rounded-full bg-[#071049] border-2 border-blue-500'>
                                <Image src="/wifi.png" alt="Logo" width={22} height={22} />
                            </div>

                            <div className='flex flex-col justify-center items-start'>
                                <p className='font-bold text-[20px]'>{(totalBytes / (1024 * 1024)).toFixed(2)} MB</p>
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
            <TableTopReports
                click1={(name) => {
                    console.log("clicked item:", name);
                    setPickIP(name);
                    setIsDetailIp(true);
                }}
                data={dataTop}
                pick={pickJenisTop}
            />
        </div>

        <div className='w-full flex flex-col justify-center pr-10 py-10 p-3 border-1 border-gray-700 rounded-lg mb-2'>
            <div className='w-full flex flex-row justify-between items-end'>
                <p className='font-bold text-[18px] ml-10 mr-3'>Top {pickJenisTop.replace("top_", "").replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase())}</p>
                <div className='flex flex-row justify-end items-center gap-2'>
                    <button onClick={()=>{setSelectedMonth(true)}} className='flex flex-row justify-between items-center px-3 py-2 border-1 border-[#353b6c] rounded-md hover:bg-[#353b6c] transition-all duration-200 ease-in-out group'>
                        <p className='font-bold mr-2'>Month</p>
                        <p className='mr-2 text-gray-500 group-hover:text-white transition-all duration-200 ease-in-out'>{pickYearTop+'-'+pickMonthTop}</p>
                        <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                    </button>
                    <button onClick={()=>{setSelectedView(true)}} className='flex flex-row justify-between items-center px-3 py-2 border-1 border-white rounded-md hover:bg-[#353b6c] transition-all duration-200 ease-in-out group'>
                        <p className='font-bold mr-2'>View</p>
                        <p className='mr-2 text-gray-500 group-hover:text-white transition-all duration-200 ease-in-out'>{pickJenisTop}</p>
                        <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                    </button>
                </div>
            </div>
            <p className='text-gray-500 mb-10 ml-10'>monitoring {pickJenisTop.replace("top_", "").replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase())} yang paling sering diblokir berdasarkan laporan yang tersedia</p>
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
                    {(namesByView[pickJenisTop] || []).map((item,index)=>{
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

        <div className="w-full flex flex-col px-10 py-10 border border-[#353b6c] bg-gradient-to-t from-[#111c45] to-[#120b2f] rounded-lg mb-2">
            <div className="flex items-center gap-3 mb-2">
                <p className="font-bold text-[22px]">
                    Backup Top Blocked Data
                </p>
            </div>
            <p className="text-gray-400 mb-8">
                Export top blocked log data based on the selected time period.
            </p>

            <div className="w-full flex flex-col p-6 border border-[#353b6c] rounded-lg bg-[#0c0b20]">
                <div>
                    <p className="font-semibold text-white mb-3 ml-1">Backup Period</p>
                    <div className="flex items-center gap-5 mb-5">
                        {/* Date Awal */}
                        <button
                            onClick={() => setSelectedDate(true)}
                            className="flex items-center px-4 py-3 border border-white rounded-md hover:bg-[#353b6c] transition-all duration-200 group"
                        >
                            <p className="font-bold mr-2">
                                Start :
                            </p>

                            <p className="text-gray-400 group-hover:text-white mr-4">
                                {pickBackupAwalYear}-{pickBackupAwalMonth}-{pickBackupAwalDate}
                            </p>
                            <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                        </button>

                        <Image
                            src="/arrow-right.png"
                            alt="Arrow"
                            width={18}
                            height={18}
                        />

                        {/* Date Akhir */}
                        <button
                            onClick={() => setSelectedDate(true)}
                            className="flex items-center px-4 py-3 border border-white rounded-md hover:bg-[#353b6c] transition-all duration-200 group"
                        >
                            <p className="font-bold mr-2">
                                End :
                            </p>

                            <p className="text-gray-400 group-hover:text-white mr-4">
                                {pickBackupAkhirYear}-{pickBackupAkhirMonth}-{pickBackupAkhirDate}
                            </p>
                            <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                        </button>

                    </div>
                </div>

                {/* Dummy Statistics */}
                <div className="grid grid-cols-3 gap-4 mb-3">

                    <div className="p-4 rounded-md border border-[#353b6c] bg-[#14122d]">
                        <p className="text-gray-400">
                            Records Found
                        </p>

                        <p className="text-[20px] font-bold text-white">
                            12,456
                        </p>
                    </div>

                    <div className="p-4 rounded-md border border-[#353b6c] bg-[#14122d]">
                        <p className="text-gray-400">
                            Estimated Size
                        </p>

                        <p className="text-[20px] font-bold text-white">
                            24 MB
                        </p>
                    </div>

                    <div className="p-4 rounded-md border border-[#353b6c] bg-[#14122d]">
                        <p className="text-gray-400">
                            Format
                        </p>

                        <p className="text-[20px] font-bold text-white">
                            CSV
                        </p>
                    </div>

                </div>

                {/* Warning */}
                <div className="p-3 rounded-md border border-yellow-500/30 bg-yellow-500/10">
                    <p className="text-yellow-300">
                        Only data within the selected date range will be included in the backup file.
                    </p>
                </div>

                {/* Action */}
                <div className="flex justify-end mt-5">

                    <button
                        onClick={() => handleBackup()}
                        className="
                            flex items-center gap-4
                            px-8 py-3
                            rounded-md
                            bg-gradient-to-b
                            from-[#2563eb]
                            to-[#1e40af]
                            shadow-lg shadow-blue-500/20
                            hover:scale-[1.02]
                            transition-all duration-200
                        "
                    >
                        <p className="font-bold">
                            Backup Now
                        </p>

                        <Image
                            src="/download.png"
                            alt="Download"
                            width={18}
                            height={18}
                        />
                    </button>

                </div>

            </div>

        </div>

        {/* TOP */}
        {selectedView && (
            <>
                <div className='w-screen h-screen bg-[#0c0b20] fixed z-11 top-0 left-0 opacity-90'>
                </div>
                <div className='fixed z-12 w-full h-full top-0 left-0 flex justify-center items-start gap-2 pt-[200px]'>
                    <div className='rounded-xl flex flex-col p-10 border-1 border-white bg-[#0c0b20] min-w-[500px]'>
                        <div className='mb-5'>
                            <div className='w-full flex flex-row items-center justify-between'>
                                <p className='font-bold text-[20px]'>Report Executive Categories</p>
                                <button className='flex flex-row justify-between items-center gap-2 px-2 py-1 border-1 border-gray-500 rounded-lg hover:bg-gray-700' onClick={()=>{setIsJenisExecutive(!isJenisExecutive), setIsJenisSecurity(false)}}>
                                    {isJenisExecutive ? (
                                        <p>Close</p>
                                    ):(
                                        <p>More</p>
                                    )}
                                    <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                                </button>
                            </div>
                            <p className='mb-5'>daftar kategori report yang tersedia</p>
                            {isJenisExecutive && (
                                <div className='w-full h-[200px] flex flex-col overflow-auto scrollbar-hide'>
                                    {dataExecutiveJenisAndCountTop.map((item,index)=>{
                                        return(
                                            <button onClick={()=>{setPickJenisTop(item.view_name),setSelectedView(false)}} key={index} className='w-full flex flex-row justify-between items-center p-3 border-1 border-gray-700 rounded-lg mb-2 hover:bg-gray-900 transition-all duration-200 ease-in-out'>
                                                <p>{item.view_name}</p>
                                                <p>{item.count} data</p>
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                        <div className=''>
                            <div className='w-full flex flex-row items-center justify-between'>
                                <p className='font-bold text-[20px]'>Report Security Categories</p>
                                <button className='flex flex-row justify-between items-center gap-2 px-2 py-1 border-1 border-gray-500 rounded-lg hover:bg-gray-700' onClick={()=>{setIsJenisSecurity(!isJenisSecurity), setIsJenisExecutive(false)}}>
                                    {isJenisSecurity ? (
                                        <p>Close</p>
                                    ):(
                                        <p>More</p>
                                    )}
                                    <Image src="/arrow-icon.png" alt="Logo" width={8} height={8} />
                                </button>
                            </div>
                            <p className='mb-5'>daftar kategori report yang tersedia</p>
                            {isJenisSecurity && (
                                <div className='w-full h-[200px] flex flex-col overflow-auto scrollbar-hide'>
                                    {dataSecurityJenisAndCountTop.map((item,index)=>{
                                        return(
                                            <button onClick={()=>{setPickJenisTop(item.view_name),setSelectedView(false)}} key={index} className='w-full flex flex-row justify-between items-center p-3 border-1 border-gray-700 rounded-lg mb-2 hover:bg-gray-900 transition-all duration-200 ease-in-out'>
                                                <p>{item.view_name}</p>
                                                <p>{item.count} data</p>
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                    <button onClick={()=>{setSelectedView(false)}} className='rounded-lg flex flex-col p-3 items-center justify-center border-2 border-white bg-[#0c0b20] hover:bg-gray-700'>
                        <Image src="/close.png" alt="Logo" width={12} height={12} />
                    </button>
                </div>
            </>
        )}
        
        {/* GEO LOCATION */}
        {isDetailIp && (
            <>
            {/* Overlay */}
            <div className="w-screen h-screen bg-[#0c0b20] fixed z-10 top-0 left-0 opacity-80" />
          
            {/* Modal Container */}
            <div className="fixed z-20 w-full h-full top-0 left-0 flex justify-center items-start pt-[120px] px-4">
          
              {/* Modal Box */}
              <div className="rounded-xl flex flex-col p-6 border border-gray-600 bg-[#0c0b20] min-w-[920px] text-white shadow-lg">
                {/* Header */}
                <p className="font-bold text-xl">IP Geolocation Detail</p>
                <p className="mb-6 text-gray-400 text-sm">
                  Informasi lokasi & security dari IP yang dipilih
                </p>
                <div className="border border-gray-700 rounded-lg p-3 col-span-2 mb-3">
                    <p className="text-gray-400 mb-2">Location Map</p>
                    <GeoMap
                        lat={dataGeo?.latitude??0}
                        lon={dataGeo?.longitude??0}
                    />
                </div>
                {/* GRID CONTENT */}
                <div className="grid grid-cols-2 gap-4 text-sm">
          
                  {/* Location Card */}
                  <div className="border border-gray-700 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">Location</p>
                    <p>{dataGeo?.city_name}, {dataGeo?.region_name}</p>
                    <p>{dataGeo?.country_name} ({dataGeo?.country_code})</p>
                  </div>
          
                  {/* Coordinates */}
                  <div className="border border-gray-700 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">Coordinates</p>
                    <p>Lat: {dataGeo?.latitude}</p>
                    <p>Lon: {dataGeo?.longitude}</p>
                  </div>
          
                  {/* Network */}
                  <div className="border border-gray-700 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">Network</p>
                    <p>ISP: {dataGeo?.isp}</p>
                    <p>ASN: {dataGeo?.asn}</p>
                  </div>
          
                  {/* Security */}
                  <div className="border border-gray-700 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">Security</p>
                    <p>Fraud Score: {dataGeo?.fraud_score}</p>
                    <p>
                      Proxy:{" "}
                      <span className={dataGeo?.is_proxy ? "text-red-400" : "text-green-400"}>
                        {dataGeo?.is_proxy ? "Yes" : "No"}
                      </span>
                    </p>
                  </div>
          
                </div>
          
              </div>
          
              {/* Close Button */}
              <button
                onClick={() => setIsDetailIp(false)}
                className="ml-3 rounded-lg p-3 border border-gray-600 bg-[#0c0b20] hover:bg-gray-800"
              >
                <Image src="/close.png" alt="close" width={14} height={14} />
              </button>
          
            </div>
          </>
        )}

        {/* DATE */}
        {selectedDate && (
            <>
                <div className='w-screen h-screen bg-[#0c0b20] fixed z-11 top-0 left-0 opacity-90'>
                </div>
                <div className='fixed z-12 w-full h-full top-0 left-0 flex justify-center items-start gap-2 pt-[200px]'>
                    <div className='rounded-xl flex flex-col p-10 border-1 border-white bg-[#0c0b20] min-w-[500px]'>
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
                    <button onClick={()=>{setSelectedDate(false)}} className='rounded-lg flex flex-col p-3 items-center justify-center border-2 border-white bg-[#0c0b20] hover:bg-gray-700'>
                        <Image src="/close.png" alt="Logo" width={12} height={12} />
                    </button>
                </div>
            </>
        )}
        
        {/* DATE */}
        {selectedMonth && (
            <>
                <div className='w-screen h-screen bg-[#0c0b20] fixed z-11 top-0 left-0 opacity-90'>
                </div>
                <div className='fixed z-12 w-full h-full top-0 left-0 flex justify-center items-start gap-2 pt-[200px]'>
                    <div className='rounded-xl flex flex-col p-10 border-1 border-white bg-[#0c0b20] min-w-[500px]'>
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
                    <button onClick={()=>{setSelectedMonth(false)}} className='rounded-lg flex flex-col p-3 items-center justify-center border-2 border-white bg-[#0c0b20] hover:bg-gray-700'>
                        <Image src="/close.png" alt="Logo" width={12} height={12} />
                    </button>
                </div>
            </>
        )}
    </div>
  )
}

export default CardSummaryGetTopReports