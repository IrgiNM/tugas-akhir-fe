"use client"
import dataGeoLocationIP from '@/lib/data/dataGeoLocationIP'
import DataTopReportsFunction from '@/lib/data/dataTopReports'
import { dataTopReportsType } from '@/type/dataTopReportsType'
import { nameDataTopType } from '@/type/nameDataTopType'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import GeoMap from '../sections/geoMapWrapper'
import TableTopReports from './tableTopReports'
import { runAllTopReports } from '@/lib/function/api'


const CardSummaryGetTopReports = () => {
    const [selectedView,setSelectedView] = useState<boolean>(false)
    const [selectedDate,setSelectedDate] = useState<boolean>(false)
    const [selectedMonth,setSelectedMonth] = useState<boolean>(false)
    const [pickJenisTop, setPickJenisTop] = useState<string>('')
    const [pickIP, setPickIP] = useState<string>('')
    const [pickDateTop, setPickDateTop] = useState<string>('')
    const [pickMonthTop, setPickMonthTop] = useState<string>('')
    const [pickYearTop, setPickYearTop] = useState<string>('')

    const {dataTopReports, dataJenisTop, dataSecurityJenisAndCountTop, dataExecutiveJenisAndCountTop, dataNameCountTop, dataDateAt,dataMonthAt,dataYearAt, dataStatistikPerMonth,namesByView} = DataTopReportsFunction( pickDateTop,pickMonthTop,pickYearTop)
    const {dataGeo} = dataGeoLocationIP(pickIP)
    const [totalConnections, setTotalConnections] = useState<number>(0)
    const [totalBytes, setTotalBytes] = useState<number>(0)
    const [totalReports, setTotalReports] = useState<number>(0)
    const [dataTop, setDataTop] = useState<dataTopReportsType[]>([])
    const [topBlocked, setTopBlocked] = useState<nameDataTopType[]>([])

    const [activeCategory, setActiveCategory] = useState<'executive' | 'security' | null>('executive')
    const [isDetailIp, setIsDetailIp] = useState<boolean>(false)

    const [isFetchingTopReports, setIsFetchingTopReports] = useState<boolean>(false)
    const [refreshTopReportsKey, setRefreshTopReportsKey] = useState<number>(0)
    
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

    const formatTopName = (value: string) => {
      return value
        .replace("top_", "")
        .replaceAll("_", " ")
        .replace(/\b\w/g, c => c.toUpperCase())
    }

    const handleFetchTopReports = async () => {
        setIsFetchingTopReports(true)
      
        try {
          const res = await runAllTopReports()
      
          if (res.status === 202) {
            setRefreshTopReportsKey((prev) => prev + 1)
      
            alert(
              `Fetch top reports selesai.`
            )
          }
        } catch (error) {
          console.error("Error fetching TopReports:", error)
          alert(`Error fetching TopReports: ${error}`)
          alert("Gagal fetch TopReports")
        } finally {
          
          setIsFetchingTopReports(false)
        }
      }

    return (
        <div className="w-full mt-[135px] rounded-2xl border border-[#353b6c] bg-[#070616] p-6 md:p-8 text-white shadow-2xl shadow-black/30">
      
          {/* HEADER */}
          <div className="relative overflow-hidden rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] via-[#120b2f] to-[#0c0b20] p-6 mb-6">
            <div className="absolute -top-20 -right-20 w-[220px] h-[220px] rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-[220px] h-[220px] rounded-full bg-purple-500/10 blur-3xl" />
      
            <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
              <div>
                <p className="text-sm text-blue-300 mb-2">Analytics Dashboard</p>
                <h1 className="text-[30px] md:text-[36px] font-bold tracking-tight">
                  Top Report
                </h1>
                <p className="text-gray-400 mt-2 max-w-2xl">
                  Monitoring data report yang paling sering muncul berdasarkan kategori,
                  tanggal, koneksi, traffic, dan detail IP yang tersedia.
                </p>
              </div>
      
              <div className="flex flex-col sm:flex-row gap-3">
                  <button
                  onClick={handleFetchTopReports}
                  disabled={isFetchingTopReports}
                  className={`
                    flex items-center justify-center gap-3 px-4 py-3 rounded-xl 
                    border border-blue-500/30 bg-blue-500/10 
                    text-blue-300 font-bold 
                    hover:bg-blue-500/20 transition-all duration-200
                    ${isFetchingTopReports ? "opacity-60 cursor-not-allowed" : ""}
                  `}
                >
                  {isFetchingTopReports ? "Fetching..." : "Fetch Manual"}
                </button>
                <button
                  onClick={() => setSelectedDate(true)}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-[#353b6c] bg-[#0c0b20]/70 hover:bg-[#353b6c] transition-all duration-200 group"
                >
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Selected Date</p>
                    <p className="font-bold">
                      {pickYearTop}-{pickMonthTop}-{pickDateTop}
                    </p>
                  </div>
                  <Image src="/arrow-icon.png" alt="Arrow" width={8} height={8} />
                </button>
      
                <button
                  onClick={() => setSelectedView(true)}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-blue-500 bg-gradient-to-b from-[#2563eb] to-[#1e40af] hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-blue-500/20 group"
                >
                  <div className="text-left">
                    <p className="text-xs text-blue-200">Selected View</p>
                    <p className="font-bold max-w-[220px] truncate">
                      {pickJenisTop}
                    </p>
                  </div>
                  <Image src="/arrow-icon.png" alt="Arrow" width={8} height={8} />
                </button>
              </div>
            </div>
      
            {/* SUMMARY MINI */}
            <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/70 p-4">
                <p className="text-gray-400 text-sm">Total Data</p>
                <p className="text-[24px] font-bold mt-1">
                  {dataTopReports.length}
                </p>
                <p className="text-xs text-gray-500">data / hari</p>
              </div>
      
              <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/70 p-4">
                <p className="text-gray-400 text-sm">Total Reports</p>
                <p className="text-[24px] font-bold mt-1">
                  {totalReports}
                </p>
                <p className="text-xs text-gray-500">unique report</p>
              </div>
      
              <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/70 p-4">
                <p className="text-gray-400 text-sm">Connections</p>
                <p className="text-[24px] font-bold mt-1">
                  {totalConnections}
                </p>
                <p className="text-xs text-gray-500">total connections</p>
              </div>
      
              <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/70 p-4">
                <p className="text-gray-400 text-sm">Traffic Bytes</p>
                <p className="text-[24px] font-bold mt-1">
                  {(totalBytes / (1024 * 1024)).toFixed(2)} MB
                </p>
                <p className="text-xs text-gray-500">total traffic</p>
              </div>
            </div>
          </div>
      
          {/* BAR CHART + SUMMARY */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
      
            {/* CHART CARD */}
            <div className="rounded-2xl border border-[#353b6c] bg-[#08071a] p-5 min-h-[420px]">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <p className="font-bold text-[20px]">
                    Top {formatTopName(pickJenisTop)}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Grafik data terbanyak berdasarkan kategori yang dipilih.
                  </p>
                </div>
      
                <div className="px-3 py-2 rounded-lg border border-[#353b6c] bg-[#14122d] text-sm text-gray-400">
                  Bar Chart
                </div>
              </div>
      
              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topBlocked}
                    margin={{
                      top: 25,
                      right: 20,
                      left: -10,
                      bottom: 5,
                    }}
                    barSize={42}
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
                        backgroundColor: "#0c0b20",
                        border: "1px solid #353b6c",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
      
                    <Bar dataKey="total" radius={[12, 12, 0, 0]}>
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
              </div>
            </div>
      
            {/* INFORMATION CARD */}
            <div className="rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] to-[#120b2f] p-6 min-h-[420px]">
              <div className="mb-7">
                <p className="font-bold text-[22px]">
                  Report Summary
                </p>
                <p className="text-gray-400 mt-2">
                  Ringkasan monitoring {formatTopName(pickJenisTop)} berdasarkan
                  laporan yang tersedia pada tanggal yang dipilih.
                </p>
              </div>
      
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/70 p-5">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#3a2604] border-2 border-[#fdff71] flex items-center justify-center mb-4">
                    <Image src="/status.png" alt="Status" width={22} height={22} />
                  </div>
                  <p className="text-gray-400 text-sm">Total Reports</p>
                  <p className="text-[28px] font-bold mt-1">{totalReports}</p>
                </div>
      
                <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/70 p-5">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#071049] border-2 border-blue-500 flex items-center justify-center mb-4">
                    <Image src="/http.png" alt="HTTP" width={18} height={18} />
                  </div>
                  <p className="text-gray-400 text-sm">Total Connections</p>
                  <p className="text-[28px] font-bold mt-1">{totalConnections}</p>
                </div>
      
                <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/70 p-5 sm:col-span-2">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#071049] border-2 border-blue-500 flex items-center justify-center mb-4">
                    <Image src="/wifi.png" alt="Wifi" width={22} height={22} />
                  </div>
                  <p className="text-gray-400 text-sm">Total Traffic Bytes</p>
                  <p className="text-[28px] font-bold mt-1">
                    {(totalBytes / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          </div>
      
          {/* TABLE */}
          <div className="w-full rounded-2xl border border-[#353b6c] bg-[#08071a] p-5 mb-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <p className="font-bold text-[20px]">Report Detail</p>
                <p className="text-sm text-gray-500">
                  Klik salah satu data untuk melihat detail geolocation IP.
                </p>
              </div>
      
              <div className="px-4 py-2 rounded-lg border border-[#353b6c] bg-[#14122d] text-gray-400 text-sm">
                {dataTop.length} records
              </div>
            </div>
      
            <div className="w-full h-[420px]">
              <TableTopReports
                click1={(name) => {
                  console.log("clicked item:", name)
                  setPickIP(name)
                  setIsDetailIp(true)
                }}
                data={dataTop}
                pick={pickJenisTop}
              />
            </div>
          </div>
      
          {/* LINE CHART */}
          <div className="w-full rounded-2xl border border-[#353b6c] bg-[#08071a] p-5 mb-5">
            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 mb-8">
              <div>
                <p className="font-bold text-[20px]">
                  Monthly Trend - {formatTopName(pickJenisTop)}
                </p>
                <p className="text-gray-500 mt-1">
                  Perkembangan data berdasarkan bulan dan kategori report.
                </p>
              </div>
      
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setSelectedMonth(true)}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-[#353b6c] bg-[#0c0b20] hover:bg-[#353b6c] transition-all duration-200"
                >
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Month</p>
                    <p className="font-bold">
                      {pickYearTop}-{pickMonthTop}
                    </p>
                  </div>
                  <Image src="/arrow-icon.png" alt="Arrow" width={8} height={8} />
                </button>
      
                <button
                  onClick={() => setSelectedView(true)}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-blue-500 bg-gradient-to-b from-[#2563eb] to-[#1e40af] hover:scale-[1.02] transition-all duration-200"
                >
                  <div className="text-left">
                    <p className="text-xs text-blue-200">View</p>
                    <p className="font-bold max-w-[200px] truncate">
                      {pickJenisTop}
                    </p>
                  </div>
                  <Image src="/arrow-icon.png" alt="Arrow" width={8} height={8} />
                </button>
              </div>
            </div>
      
            <div className="w-full h-[330px] rounded-xl border border-[#353b6c] bg-[#0c0b20] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dataStatistikPerMonth.filter((item) => item.view_name === pickJenisTop)}
                >
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0c0b20",
                      border: "1px solid #353b6c",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Legend
                    align="left"
                    wrapperStyle={{
                      display: "flex",
                      justifyContent: "flex-start",
                      flexWrap: "wrap",
                      gap: "10px",
                      paddingTop: "30px",
                      width: "100%",
                      left: 20,
                    }}
                  />
      
                  {(namesByView[pickJenisTop] || []).map((item, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={item}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
      
          {/* MODAL VIEW */}
          {selectedView && (
            <>
                <div className="fixed inset-0 z-70 bg-[#0c0b20]/90 backdrop-blur-sm" />

                <div className="fixed inset-0 z-80 flex justify-center items-start gap-3 pt-[160px] px-5">
                <div className="w-full max-w-[650px] rounded-2xl border border-[#353b6c] bg-[#0c0b20] p-7 shadow-2xl">

                    <div className="mb-6">
                    <p className="font-bold text-[24px]">Report Categories</p>
                    <p className="text-gray-500 mt-1">
                        Pilih kategori report yang ingin ditampilkan.
                    </p>
                    </div>

                    {/* EXECUTIVE */}
                    <div className="mb-6 rounded-xl border border-[#353b6c] bg-[#08071a] p-4">
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div>
                        <p className="font-bold text-[18px]">Executive Categories</p>
                        <p className="text-gray-500 text-sm">
                            {dataExecutiveJenisAndCountTop.length} kategori tersedia.
                        </p>
                        </div>

                        <button
                        type="button"
                        className="px-4 py-2 rounded-lg border border-[#353b6c] hover:bg-[#353b6c] transition-all duration-200"
                        onClick={() => {
                            setActiveCategory(activeCategory === 'executive' ? null : 'executive')
                        }}
                        >
                        {activeCategory === 'executive' ? 'Close' : 'More'}
                        </button>
                    </div>

                    {activeCategory === 'executive' && (
                        <div className="max-h-[220px] overflow-auto scrollbar-hide space-y-2">
                        {dataExecutiveJenisAndCountTop.length === 0 ? (
                            <div className="w-full p-4 rounded-lg border border-[#353b6c] bg-[#0c0b20] text-gray-500 text-center">
                            Data executive belum tersedia.
                            </div>
                        ) : (
                            dataExecutiveJenisAndCountTop.map((item, index) => (
                            <button
                                type="button"
                                onClick={() => {
                                setPickJenisTop(item.view_name)
                                setSelectedView(false)
                                }}
                                key={index}
                                className="w-full flex justify-between items-center p-3 rounded-lg border border-[#353b6c] bg-[#0c0b20] hover:bg-[#353b6c] transition-all duration-200"
                            >
                                <p>{item.view_name}</p>
                                <p className="text-gray-400">{item.count} data</p>
                            </button>
                            ))
                        )}
                        </div>
                    )}
                    </div>

                    {/* SECURITY */}
                    <div className="rounded-xl border border-[#353b6c] bg-[#08071a] p-4">
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div>
                        <p className="font-bold text-[18px]">Security Categories</p>
                        <p className="text-gray-500 text-sm">
                            {dataSecurityJenisAndCountTop.length} kategori tersedia.
                        </p>
                        </div>

                        <button
                        type="button"
                        className="px-4 py-2 rounded-lg border border-[#353b6c] hover:bg-[#353b6c] transition-all duration-200"
                        onClick={() => {
                            setActiveCategory(activeCategory === 'security' ? null : 'security')
                        }}
                        >
                        {activeCategory === 'security' ? 'Close' : 'More'}
                        </button>
                    </div>

                    {activeCategory === 'security' && (
                        <div className="max-h-[220px] overflow-auto scrollbar-hide space-y-2">
                        {dataSecurityJenisAndCountTop.length === 0 ? (
                            <div className="w-full p-4 rounded-lg border border-[#353b6c] bg-[#0c0b20] text-gray-500 text-center">
                            Data security belum tersedia.
                            </div>
                        ) : (
                            dataSecurityJenisAndCountTop.map((item, index) => (
                            <button
                                type="button"
                                onClick={() => {
                                setPickJenisTop(item.view_name)
                                setSelectedView(false)
                                }}
                                key={index}
                                className="w-full flex justify-between items-center p-3 rounded-lg border border-[#353b6c] bg-[#0c0b20] hover:bg-[#353b6c] transition-all duration-200"
                            >
                                <p>{item.view_name}</p>
                                <p className="text-gray-400">{item.count} data</p>
                            </button>
                            ))
                        )}
                        </div>
                    )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setSelectedView(false)}
                    className="rounded-xl p-4 border border-[#353b6c] bg-[#0c0b20] hover:bg-[#353b6c] transition-all duration-200"
                >
                    <Image src="/close.png" alt="Close" width={12} height={12} />
                </button>
                </div>
            </>
            )}
      
          {/* MODAL GEO LOCATION */}
          {isDetailIp && (
            <>
              <div className="fixed inset-0 z-70 bg-[#0c0b20]/85 backdrop-blur-sm" />
      
              <div className="fixed inset-0 z-80 flex justify-center items-start pt-[110px] px-5 gap-3">
                <div className="w-full max-w-[980px] rounded-2xl border border-[#353b6c] bg-[#0c0b20] p-6 shadow-2xl">
                  <div className="mb-5">
                    <p className="font-bold text-[24px]">IP Geolocation Detail</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Informasi lokasi dan security dari IP yang dipilih.
                    </p>
                  </div>
      
                  <div className="rounded-xl border border-[#353b6c] bg-[#08071a] p-4 mb-4">
                    <p className="text-gray-400 mb-3">Location Map</p>
                    <GeoMap
                      lat={dataGeo?.latitude ?? 0}
                      lon={dataGeo?.longitude ?? 0}
                    />
                  </div>
      
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="rounded-xl border border-[#353b6c] bg-[#14122d] p-4">
                      <p className="text-gray-400 mb-2">Location</p>
                      <p>{dataGeo?.city_name}, {dataGeo?.region_name}</p>
                      <p>{dataGeo?.country_name} ({dataGeo?.country_code})</p>
                    </div>
      
                    <div className="rounded-xl border border-[#353b6c] bg-[#14122d] p-4">
                      <p className="text-gray-400 mb-2">Coordinates</p>
                      <p>Lat: {dataGeo?.latitude}</p>
                      <p>Lon: {dataGeo?.longitude}</p>
                    </div>
      
                    <div className="rounded-xl border border-[#353b6c] bg-[#14122d] p-4">
                      <p className="text-gray-400 mb-2">Network</p>
                      <p>ISP: {dataGeo?.isp}</p>
                      <p>ASN: {dataGeo?.asn}</p>
                    </div>
      
                    <div className="rounded-xl border border-[#353b6c] bg-[#14122d] p-4">
                      <p className="text-gray-400 mb-2">Security</p>
                      <p>Fraud Score: {dataGeo?.fraud_score}</p>
                      <p>
                        Proxy:{' '}
                        <span className={dataGeo?.is_proxy ? 'text-red-400' : 'text-green-400'}>
                          {dataGeo?.is_proxy ? 'Yes' : 'No'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
      
                <button
                  onClick={() => setIsDetailIp(false)}
                  className="rounded-xl p-4 border border-[#353b6c] bg-[#0c0b20] hover:bg-[#353b6c] transition-all duration-200"
                >
                  <Image src="/close.png" alt="Close" width={14} height={14} />
                </button>
              </div>
            </>
          )}
      
          {/* MODAL DATE */}
          {selectedDate && (
            <>
              <div className="fixed inset-0 z-70 bg-[#0c0b20]/90 backdrop-blur-sm" />
      
              <div className="fixed inset-0 z-80 flex justify-center items-start gap-3 pt-[170px] px-5">
                <div className="w-full max-w-[620px] rounded-2xl border border-[#353b6c] bg-[#0c0b20] p-7 shadow-2xl">
                  <p className="font-bold text-[24px]">Available Report Dates</p>
                  <p className="text-gray-500 mt-1 mb-6">
                    Pilih tanggal yang memiliki data report.
                  </p>
      
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <button className="w-full p-3 rounded-xl border border-blue-500 bg-gradient-to-b from-[#2563eb] to-[#1e40af] font-bold mb-3">
                        {pickYearTop ?? ''}
                      </button>
      
                      <div className="h-[180px] overflow-auto scrollbar-hide space-y-2">
                        {dataYearAt.map((item, index) => (
                          <button
                            onClick={() => {
                              setPickYearTop(item)
                              setSelectedDate(false)
                            }}
                            key={index}
                            className="w-full p-3 rounded-lg border border-[#353b6c] bg-[#14122d] hover:bg-[#353b6c] transition-all duration-200"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
      
                    <div>
                      <button className="w-full p-3 rounded-xl border border-blue-500 bg-gradient-to-b from-[#2563eb] to-[#1e40af] font-bold mb-3">
                        {pickMonthTop ?? ''}
                      </button>
      
                      <div className="h-[180px] overflow-auto scrollbar-hide space-y-2">
                        {dataMonthAt.map((item, index) => (
                          <button
                            onClick={() => {
                              setPickMonthTop(item)
                              setSelectedDate(false)
                            }}
                            key={index}
                            className="w-full p-3 rounded-lg border border-[#353b6c] bg-[#14122d] hover:bg-[#353b6c] transition-all duration-200"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
      
                    <div>
                      <button className="w-full p-3 rounded-xl border border-blue-500 bg-gradient-to-b from-[#2563eb] to-[#1e40af] font-bold mb-3">
                        {pickDateTop ?? ''}
                      </button>
      
                      <div className="h-[180px] overflow-auto scrollbar-hide space-y-2">
                        {dataDateAt.map((item, index) => (
                          <button
                            onClick={() => {
                              setPickDateTop(item)
                              setSelectedDate(false)
                            }}
                            key={index}
                            className="w-full p-3 rounded-lg border border-[#353b6c] bg-[#14122d] hover:bg-[#353b6c] transition-all duration-200"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
      
                <button
                  onClick={() => setSelectedDate(false)}
                  className="rounded-xl p-4 border border-[#353b6c] bg-[#0c0b20] hover:bg-[#353b6c] transition-all duration-200"
                >
                  <Image src="/close.png" alt="Close" width={12} height={12} />
                </button>
              </div>
            </>
          )}
      
          {/* MODAL MONTH */}
          {selectedMonth && (
            <>
              <div className="fixed inset-0 z-70 bg-[#0c0b20]/90 backdrop-blur-sm" />
      
              <div className="fixed inset-0 z-80 flex justify-center items-start gap-3 pt-[170px] px-5">
                <div className="w-full max-w-[520px] rounded-2xl border border-[#353b6c] bg-[#0c0b20] p-7 shadow-2xl">
                  <p className="font-bold text-[24px]">Available Report Months</p>
                  <p className="text-gray-500 mt-1 mb-6">
                    Pilih bulan yang memiliki data report.
                  </p>
      
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <button className="w-full p-3 rounded-xl border border-blue-500 bg-gradient-to-b from-[#2563eb] to-[#1e40af] font-bold mb-3">
                        {pickYearTop ?? ''}
                      </button>
      
                      <div className="h-[180px] overflow-auto scrollbar-hide space-y-2">
                        {dataYearAt.map((item, index) => (
                          <button
                            onClick={() => {
                              setPickYearTop(item)
                              setSelectedMonth(false)
                            }}
                            key={index}
                            className="w-full p-3 rounded-lg border border-[#353b6c] bg-[#14122d] hover:bg-[#353b6c] transition-all duration-200"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
      
                    <div>
                      <button className="w-full p-3 rounded-xl border border-blue-500 bg-gradient-to-b from-[#2563eb] to-[#1e40af] font-bold mb-3">
                        {pickMonthTop ?? ''}
                      </button>
      
                      <div className="h-[180px] overflow-auto scrollbar-hide space-y-2">
                        {dataMonthAt.map((item, index) => (
                          <button
                            onClick={() => {
                              setPickMonthTop(item)
                              setSelectedMonth(false)
                            }}
                            key={index}
                            className="w-full p-3 rounded-lg border border-[#353b6c] bg-[#14122d] hover:bg-[#353b6c] transition-all duration-200"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
      
                <button
                  onClick={() => setSelectedMonth(false)}
                  className="rounded-xl p-4 border border-[#353b6c] bg-[#0c0b20] hover:bg-[#353b6c] transition-all duration-200"
                >
                  <Image src="/close.png" alt="Close" width={12} height={12} />
                </button>
              </div>
            </>
          )}
      
        </div>
      )
}

export default CardSummaryGetTopReports