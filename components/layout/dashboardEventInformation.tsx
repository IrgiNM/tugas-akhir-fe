"use client"
import Image from 'next/image'
import { useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const DashboardEventInformation = () => {
    const [selectedMonth,setSelectedMonth] = useState<boolean>(false)
    const dataMalware = [
        { time: "00:00", object_event: 5 },
        { time: "01:00", object_event: 3 },
        { time: "02:00", object_event: 2 },
        { time: "03:00", object_event: 1 },
        { time: "04:00", object_event: 2 },
        { time: "05:00", object_event: 4 },
        { time: "06:00", object_event: 6 },
        { time: "07:00", object_event: 10 },
        { time: "08:00", object_event: 12 },
        { time: "09:00", object_event: 18 },
        { time: "10:00", object_event: 15 },
        { time: "11:00", object_event: 22 },
        { time: "12:00", object_event: 30 },
        { time: "13:00", object_event: 28 },
        { time: "14:00", object_event: 25 },
        { time: "15:00", object_event: 20 },
        { time: "16:00", object_event: 24 },
        { time: "17:00", object_event: 27 },
        { time: "18:00", object_event: 32 },
        { time: "19:00", object_event: 29 },
        { time: "20:00", object_event: 35 },
        { time: "21:00", object_event: 31 },
        { time: "22:00", object_event: 26 },
        { time: "23:00", object_event: 19 },
        { time: "24:00", object_event: 8 },
    ];
    const dataEventDetail = [
        {
            time: "08:20",
            eventId: 10010,
            host: "CLIENT-10",
            ip: "192.168.3.15",
            malware: "Clean",
            status: "SAFE"
        },
        {
            time: "08:19",
            eventId: 10009,
            host: "CLIENT-09",
            ip: "192.168.3.14",
            malware: "Spyware.Keylogger",
            status: "HIGH"
        },
        {
            time: "08:18",
            eventId: 10008,
            host: "CLIENT-08",
            ip: "192.168.3.13",
            malware: "Trojan.Downloader",
            status: "HIGH"
        },
        {
            time: "08:17",
            eventId: 10007,
            host: "CLIENT-07",
            ip: "192.168.3.12",
            malware: "Worm.Agent",
            status: "HIGH"
        },
        {
            time: "08:16",
            eventId: 10006,
            host: "CLIENT-06",
            ip: "192.168.3.11",
            malware: "Adware.Generic",
            status: "WARNING"
        },
        {
            time: "08:15",
            eventId: 10005,
            host: "CLIENT-05",
            ip: "192.168.3.10",
            malware: "-",
            status: "SAFE"
        },
        {
            time: "08:14",
            eventId: 10004,
            host: "DB-SERVER-01",
            ip: "192.168.2.30",
            malware: "Ransomware.LockBit",
            status: "CRITICAL"
        },
        {
            time: "08:13",
            eventId: 10003,
            host: "WIN-LAPTOP-03",
            ip: "192.168.2.10",
            malware: "Spyware.Generic",
            status: "HIGH"
        },
        {
            time: "08:12",
            eventId: 10002,
            host: "WIN-PC-02",
            ip: "192.168.1.20",
            malware: "Suspicious DLL",
            status: "WARNING"
        },
        {
            time: "08:11",
            eventId: 10001,
            host: "WIN-SRV-01",
            ip: "192.168.1.10",
            malware: "Trojan.Generic",
            status: "HIGH"
        }
    ]
  return (
    <>
        <div className='w-full flex flex-col justify-start px-5 py-5 items-center p-3 bg-[#0b0c1c] border-1 border-gray-700 rounded-lg mb-2'>
                <div className='w-full rounded-md p-5'>
                    <p className='font-bold text-[18px]'>Event Information</p>
                    <p className='text-gray-500 mb-7'>monitoring protokol yang paling sering diblokir berdasarkan laporan yang tersedia</p>
                    <div className='w-full h-[200px] mb-7 pr-10'>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={dataMalware}>
                            <XAxis dataKey="time" stroke="#aaa" />
                            <YAxis stroke="#aaa" />
                            <Tooltip />

                            {/* <Legend
                                align="left"
                                wrapperStyle={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                    paddingTop: "20px",
                                    width: "100%",
                                    left: 40,
                                }}
                            /> */}

                            {/* Trojan */}
                            <Line
                                type="monotone"
                                dataKey="object_event"
                                stroke="#3b82f6"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    </div>
                    <div className='flex flex-row gap-3 mb-3 p-0'>
                        {/* TOTAL EVENTS */}
                        <div className='flex flex-1 flex-row justify-center items-center p-5 gap-3 rounded-xl border-[.5px] border-blue-500 bg-[#0b0c1c]'>
                            <div className='flex flex-col justify-center items-center'>
                                <div className='flex flex-row items-center gap-3'>
                                    <p className='font-bold text-[25px]'>12097 <span className='text-[12px] font-light'>All Data</span></p>
                                </div>
                                <p>Total Events</p>
                            </div>
                        </div>
                        {/* CRITICALL */}
                        <div className='flex flex-1 flex-row justify-center items-center p-5 gap-3 rounded-xl border-[.5px] border-blue-900 bg-[#0b0c1c]'>
                            <div className='flex flex-col justify-center items-center'>
                                <div className='flex flex-row items-center gap-3'>
                                    <p className='font-bold text-[25px]'>65 <span className='text-[12px] font-light'>Alert</span></p>
                                </div>
                                <p>Critical</p>
                            </div>
                        </div>
                        {/* SAFE */}
                        <div className='flex flex-1 flex-row justify-center items-center p-5 gap-3 rounded-xl border-[.5px] border-blue-900 bg-[#0b0c1c]'>
                            <div className='flex flex-col justify-center items-center'>
                                <div className='flex flex-row items-center gap-3'>
                                    <p className='font-bold text-[25px]'>92 <span className='text-[12px] font-light'>%</span></p>
                                </div>
                                <p>Safe </p>
                            </div>
                        </div>
                        {/*  */}
                        <div className='flex flex-1 flex-row justify-center items-center p-5 gap-3 rounded-xl border-[.5px] border-blue-900 bg-[#0b0c1c]'>
                            <div className='flex flex-col justify-center items-center'>
                                <div className='flex flex-row items-center gap-3'>
                                    <p className='font-bold text-[25px]'>104 <span className='text-[12px] font-light'>data</span></p>
                                </div>
                                <p>New / hour</p>
                            </div>
                        </div>

                        
                    </div>
                    <div className='flex flex-row gap-3 mb-3 p-0'>
                        <div className='flex-1 flex-col justify-between items-center p-5 gap-3 rounded-xl border-[.5px] border-blue-900'>
                            <div className='w-full border-1 border-gray-600 rounded-md p-5 flex flex-row gap-2 justify-between items-center'>
                                <p className='flex-1 text-center border-r-1 border-gray-700'>Time</p>
                                <p className='flex-1 text-center border-r-1 border-gray-700'>Event ID</p>
                                <p className='flex-2 text-center border-r-1 border-gray-700'>Host</p>
                                <p className='flex-2 text-center border-r-1 border-gray-700'>IP</p>
                                <p className='flex-2 text-center border-r-1 border-gray-700'>Malware</p>
                                <p className='flex-1 text-center'>Status</p>
                            </div>
                            <div className='w-full h-[280px] overflow-auto scrollbar-hide flex flex-col items-center justify-center'>
                                {dataEventDetail.map((item,index)=>{
                                    return(
                                        <div className='w-full rounded-md p-5 flex flex-row gap-2 justify-between items-center'>
                                            <p className='flex-1 text-center'>{item.time}</p>
                                            <p className='flex-1 text-center'>{item.eventId}</p>
                                            <p className='flex-2 text-center'>{item.host}</p>
                                            <p className='flex-2 text-center'>{item.ip}</p>
                                            <p className='flex-2 text-center'>{item.malware}</p>
                                            <p className={`flex-1 text-center ${item.status==='WARNING'&&'border-1 py-2 border-red-600 bg-[#370f16] rounded-md'}`}>{item.status}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-center p-5 gap-3 rounded-xl border-[.5px] border-blue-900'>
                            <div className='flex flex-col justify-center items-start gap-2'>
                                <div className='flex flex-row gap-3 items-start'>
                                    <p className='text-[18px] font-bold mb-2'>Recent Events Feed</p>
                                    <button onClick={()=>{setSelectedMonth(true)}} className='flex flex-row justify-between items-center gap-2 px-3 py-1 border-1 border-gray-500 rounded-lg hover:bg-gray-700'>
                                        <p>Info</p>
                                        <Image src="/info.png" alt="Logo" width={12} height={12} />
                                    </button>
                                    <div className='flex flex-row items-center gap-3 px-3 py-1'>
                                        <div className='w-[10px] h-[10px] bg-red-500 rounded-full'/>
                                        <p className='font-bold text-[15px]'>2</p>
                                    </div>
                                </div>
                                <div className='flex flex-col items-start gap-3 p-5 border border-gray-700 border-dashed rounded-md w-full h-[300px] overflow-auto scrollbar-hide'>
                                    <div className='flex flex-row items-center gap-3'>
                                        <div className='w-[10px] h-[10px] bg-green-500 rounded-full'/>
                                        <p>
                                            <span className='font-bold'>08:20</span>
                                            <span className='ml-5'>CLIENT-10 Clean activity</span>
                                        </p>
                                    </div>
                                    <div className='flex flex-row items-center gap-3'>
                                        <div className='w-[10px] h-[10px] bg-red-500 animate-ping rounded-full'/>
                                        <p>
                                            <span className='font-bold'>08:19</span>
                                            <span className='ml-5'>DB-SERVER-01 Ransomware attempt</span>
                                        </p>
                                    </div>
                                    <div className='flex flex-row items-center gap-3'>
                                        <div className='w-[10px] h-[10px] bg-orange-500 rounded-full'/>
                                        <p>
                                            <span className='font-bold'>08:18</span>
                                            <span className='ml-5'>CLIENT-09 Keylogger detected</span>
                                        </p>
                                    </div>
                                    <div className='flex flex-row items-center gap-3'>
                                        <div className='w-[10px] h-[10px] bg-orange-500 rounded-full'/>
                                        <p>
                                            <span className='font-bold'>08:17</span>
                                            <span className='ml-5'>CLIENT-08 Downloader malware</span>
                                        </p>
                                    </div>
                                    <div className='flex flex-row items-center gap-3'>
                                        <div className='w-[10px] h-[10px] bg-yellow-400 rounded-full'/>
                                        <p>
                                            <span className='font-bold'>08:16</span>
                                            <span className='ml-5'>CLIENT-06 Adware detected</span>
                                        </p>
                                    </div>
                                    <div className='flex flex-row items-center gap-3'>
                                        <div className='w-[10px] h-[10px] bg-orange-500 rounded-full'/>
                                        <p>
                                            <span className='font-bold'>08:15</span>
                                            <span className='ml-5'>CLIENT-07 Worm activity</span>
                                        </p>
                                    </div>
                                    <div className='flex flex-row items-center gap-3'>
                                        <div className='w-[10px] h-[10px] bg-green-500 rounded-full'/>
                                        <p>
                                            <span className='font-bold'>08:14</span>
                                            <span className='ml-5'>CLIENT-05 Normal traffic</span>
                                        </p>
                                    </div>
                                    <div className='flex flex-row items-center gap-3'>
                                        <div className='w-[10px] h-[10px] bg-red-500 animate-ping rounded-full'/>
                                        <p>
                                            <span className='font-bold'>08:13</span>
                                            <span className='ml-5'>WIN-SRV-01 Credential dumping activity</span>
                                        </p>
                                    </div>
                                    <div className='flex flex-row items-center gap-3'>
                                        <div className='w-[10px] h-[10px] bg-yellow-400 rounded-full'/>
                                        <p>
                                            <span className='font-bold'>08:12</span>
                                            <span className='ml-5'>PC-02 Suspicious DLL activity</span>
                                        </p>
                                    </div>
                                    <div className='flex flex-row items-center gap-3'>
                                        <div className='w-[10px] h-[10px] bg-orange-500 rounded-full'/>
                                        <p>
                                            <span className='font-bold'>08:11</span>
                                            <span className='ml-5'>LAPTOP-03 Spyware detected</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        {/* DATE */}
        {selectedMonth && (
            <>
                <div className='w-screen h-screen bg-black fixed z-11 top-0 left-0 opacity-90'>
                </div>
                <div className='fixed z-12 w-full h-full top-0 left-0 flex justify-center items-start gap-2 pt-[200px]'>
                    <div className='rounded-xl flex flex-col p-10 border-1 border-white bg-black'>
                        <p className='font-bold text-[20px]'>Info Status Recent Events</p>
                        <p className='mb-5'>Berikut maksud dari warna status pada setiap data recent events</p>
                        <div className='flex flex-col gap-4 h-[300px] overflow-auto scrollbar-hide pr-2'>
                        {/* SAFE */}
                        <div className='border border-gray-700 rounded-md p-5 flex flex-col gap-2'>
                            <div className='flex flex-row items-center gap-3 mb-2'>
                                <div className='w-[10px] h-[10px] bg-green-500 rounded-full mr-3'/>
                                <p>SAFE</p>
                            </div>

                            <p className='pl-5'>Clean activity</p>
                            <p className='pl-5'>Normal traffic</p>
                            <p className='pl-5'>Authorized access</p>
                            <p className='pl-5'>No threat detected</p>
                            <p className='pl-5'>Routine scan completed</p>
                            <p className='pl-5'>Policy compliance success</p>
                            <p className='pl-5'>Heartbeat received</p>
                        </div>

                        {/* WARNING */}
                        <div className='border border-gray-700 rounded-md p-5 flex flex-col gap-2'>
                            <div className='flex flex-row items-center gap-3 mb-2'>
                                <div className='w-[10px] h-[10px] bg-yellow-400 rounded-full mr-3'/>
                                <p>WARNING</p>
                            </div>

                            <p className='pl-5'>Adware detected</p>
                            <p className='pl-5'>Suspicious DLL</p>
                            <p className='pl-5'>Unknown file activity</p>
                            <p className='pl-5'>Potentially unwanted application</p>
                            <p className='pl-5'>Unusual behavior detected</p>
                            <p className='pl-5'>Browser hijack attempt</p>
                            <p className='pl-5'>Abnormal script execution</p>
                        </div>

                        {/* HIGH */}
                        <div className='border border-gray-700 rounded-md p-5 flex flex-col gap-2'>
                            <div className='flex flex-row items-center gap-3 mb-2'>
                                <div className='w-[10px] h-[10px] bg-orange-500 rounded-full mr-3'/>
                                <p>HIGH</p>
                            </div>

                            <p className='pl-5'>Trojan detected</p>
                            <p className='pl-5'>Spyware detected</p>
                            <p className='pl-5'>Keylogger detected</p>
                            <p className='pl-5'>Worm activity</p>
                            <p className='pl-5'>Downloader malware</p>
                            <p className='pl-5'>Credential theft attempt</p>
                            <p className='pl-5'>Unauthorized execution detected</p>
                            <p className='pl-5'>Persistence mechanism found</p>
                            <p className='pl-5'>Malicious PowerShell activity</p>
                        </div>

                        {/* CRITICAL */}
                        <div className='border border-gray-700 rounded-md p-5 flex flex-col gap-2'>
                            <div className='flex flex-row items-center gap-3 mb-2'>
                                <div className='w-[10px] h-[10px] bg-red-500 rounded-full mr-3'/>
                                <p>CRITICAL</p>
                            </div>

                            <p className='pl-5'>Ransomware attempt</p>
                            <p className='pl-5'>Privilege escalation detected</p>
                            <p className='pl-5'>Mass infection detected</p>
                            <p className='pl-5'>Remote exploit execution</p>
                            <p className='pl-5'>Credential dumping activity</p>
                            <p className='pl-5'>Active data exfiltration</p>
                            <p className='pl-5'>Critical exploit detected</p>
                            <p className='pl-5'>Lateral movement detected</p>
                            <p className='pl-5'>Domain controller compromise</p>
                            <p className='pl-5'>Command and control connection</p>
                        </div>

                    </div>
                    </div>
                    <button onClick={()=>{setSelectedMonth(false)}} className='rounded-lg flex flex-col p-3 items-center justify-center border-2 border-white bg-black hover:bg-gray-700'>
                        <Image src="/close.png" alt="Logo" width={12} height={12} />
                    </button>
                </div>
            </>
        )}
    </>
  )
}

export default DashboardEventInformation