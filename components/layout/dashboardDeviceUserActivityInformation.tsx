import Image from 'next/image'
import { useState } from 'react'

const DashboardDeviceUserActivityInformation = () => {
    const dataTopDevices = [
        {
            host: "DB-SERVER-01",
            users: ["admin", "backup-service", "root"],
            ip: "192.168.2.30",
            risk: 98,
            malware: "Ransomware.LockBit",
            events: 15,
            connection: true,
        },
        {
            host: "CLIENT-09",
            users: ["user1", "guest"],
            ip: "192.168.3.14",
            risk: 87,
            malware: "Spyware.Keylogger",
            events: 8,
            connection: true,
        },
        {
            host: "CLIENT-10",
            users: ["staff"],
            ip: "192.168.3.15",
            risk: 20,
            malware: "-",
            events: 1,
            connection: false,
        },
        {
            host: "WEB-SERVER-02",
            users: ["nginx", "deploy-bot", "developer"],
            ip: "192.168.5.20",
            risk: 91,
            malware: "WebShell.Agent",
            events: 12,
            connection: true,
        },
        {
            host: "FINANCE-PC-01",
            users: ["finance-user"],
            ip: "192.168.10.15",
            risk: 76,
            malware: "Trojan.Banker",
            events: 6,
            connection: true,
        },
        {
            host: "HR-LAPTOP-02",
            users: ["hr.staff", "intern"],
            ip: "192.168.11.22",
            risk: 43,
            malware: "Adware.Generic",
            events: 3,
            connection: false,
        },
        {
            host: "MAIL-SERVER-01",
            users: ["exchange", "admin"],
            ip: "192.168.6.10",
            risk: 95,
            malware: "Exploit.CVE",
            events: 18,
            connection: true,
        },
        {
            host: "DEV-PC-07",
            users: ["developer", "qa-user"],
            ip: "192.168.7.77",
            risk: 64,
            malware: "CryptoMiner.XMR",
            events: 7,
            connection: true,
        },
        {
            host: "CLIENT-21",
            users: ["marketing"],
            ip: "192.168.8.21",
            risk: 35,
            malware: "-",
            events: 2,
            connection: false,
        },
        {
            host: "VPN-GATEWAY",
            users: ["remote-user", "contractor", "admin"],
            ip: "10.0.0.1",
            risk: 89,
            malware: "BruteForce.Login",
            events: 24,
            connection: true,
        },
        {
            host: "NAS-STORAGE-01",
            users: ["backup-agent"],
            ip: "192.168.50.5",
            risk: 72,
            malware: "Suspicious.Access",
            events: 9,
            connection: false,
        },
        {
            host: "POS-TERMINAL-04",
            users: ["cashier"],
            ip: "192.168.15.44",
            risk: 81,
            malware: "POS.Malware",
            events: 11,
            connection: true,
        },
        {
            host: "CEO-LAPTOP",
            users: ["ceo", "assistant"],
            ip: "192.168.99.2",
            risk: 67,
            malware: "Phishing.Payload",
            events: 5,
            connection: true,
        },
        {
            host: "IOT-CAMERA-01",
            users: ["iot-service"],
            ip: "192.168.200.10",
            risk: 58,
            malware: "Botnet.Mirai",
            events: 14,
            connection: true,
        },
        {
            host: "TEST-MACHINE-03",
            users: ["tester", "automation"],
            ip: "192.168.55.30",
            risk: 29,
            malware: "-",
            events: 2,
            connection: false,
        },
    ]
    const [selectedDevice, setSelectedDevice] = useState(false)
    
  return (
    <div className='w-full flex flex-col justify-start px-5 py-5 items-center p-3 bg-[#0b111c] border-1 border-cyan-700 rounded-lg mb-2'>
        <div className='w-full rounded-md p-5'>
            <p className='font-bold text-[18px]'>TOP Attack Devices</p>
            <p className='text-gray-500 mb-7'>Menampilkan device mana yang paling sering/berbahaya.</p>
            <div className='flex flex-row gap-3 mb-3 p-0'>
                <div className='flex-1 flex-col justify-between items-center p-5 gap-3 rounded-xl border-[.5px] border-gray-500'>
                    {/* HEADER */}
                    <div className='w-full border border-gray-700 rounded-md p-3 flex flex-row gap-2 justify-between items-center'>
                        <p className='flex-2 text-center border-r border-gray-700'>Device</p>
                        <p className='flex-2 text-center border-r border-gray-700'>Users</p>
                        <p className='flex-2 text-center border-r border-gray-700'>IP</p>
                        <p className='flex-1 text-center border-r border-gray-700'>Risk</p>
                        <p className='flex-2 text-center border-r border-gray-700'>Malware</p>
                        <p className='flex-1 text-center border-r border-gray-700'>Events</p>
                        <p className='flex-1 text-center'>Connection</p>
                    </div>
                    {/* BODY */}
                    <div className='w-full h-[480px] overflow-auto scrollbar-hide flex flex-col gap-2'>
                        {dataTopDevices.map((item,index)=>{
                            return(
                                <button onClick={()=>{setSelectedDevice(true)}} key={index} className='w-full rounded-md p-4 flex flex-row gap-2 justify-between items-center hover:bg-[#101828] cursor-pointer duration-200'>
                                    <p className='flex-2 text-center text-white'>{item.host}</p>
                                    <div className='flex-2 flex flex-wrap justify-center gap-1'>
                                        {item.users.map((user,userIndex)=>{
                                            return(
                                                <div 
                                                    key={userIndex}
                                                    className='px-2 py-1 rounded-md bg-[#1b2332] border border-gray-700 text-xs text-cyan-300'
                                                >
                                                    {user}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <p className='flex-2 text-center text-gray-300'>{item.ip}</p>
                                    <div className='flex-1 flex justify-center'>
                                        <div className={`
                                            px-3 py-1 rounded-md
                                            ${item.risk >= 90 && 'bg-red-900/40 text-white border border-red-600'}
                                            ${item.risk >= 70 && item.risk < 90 && 'bg-orange-900/40 text-white border border-orange-600'}
                                            ${item.risk < 70 && 'bg-yellow-900/40 text-white border border-yellow-600'}
                                        `}>
                                            {item.risk}%
                                        </div>
                                    </div>
                                    <p className='flex-2 text-center'>{item.malware}</p>
                                    <p className='flex-1 text-center text-white'>{item.events}</p>
                                    <div className='flex-1 flex justify-center'>
                                        <div className={`
                                            px-3 py-1 rounded-md
                                            ${item.connection 
                                                ? 'bg-red-900/30 text-white border border-red-700'
                                                : 'bg-green-900/30 text-white border border-green-700'
                                            }
                                        `}>
                                            {item.connection ? 'EXTERNAL' : 'SAFE'}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>

        {/* DATE */}
        {selectedDevice && (
            <>
                <div className='w-screen h-screen bg-black fixed z-11 top-0 left-0 opacity-90'></div>
                <div className='fixed z-12 w-full h-full top-0 left-0 flex justify-center items-start gap-2 pt-[200px]'>
                    <div className='rounded-xl flex flex-col p-10 border-1 border-white bg-black'>
                        <p className='font-bold text-[20px]'>Info Status Recent Events</p>
                        <p className='mb-5'>Berikut maksud dari warna status pada setiap data recent events</p>
                        {/* DEVICE DETAIL MODAL */}
                        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50'>
                            <div className='w-[90%] h-[90%] bg-[#0B1220] border border-gray-700 rounded-2xl p-6 overflow-auto scrollbar-hide'>
                                {/* HEADER */}
                                <div className='flex justify-between items-start mb-6'>
                                    <div>
                                        <h1 className='text-3xl font-bold text-white'>DB-SERVER-01</h1>
                                        <div className='flex gap-3 mt-3 flex-wrap'>
                                            <div className='px-3 py-1 rounded-md bg-[#172033] border border-gray-700 text-cyan-300 text-sm'>
                                                192.168.2.30
                                            </div>
                                            <div className='px-3 py-1 rounded-md bg-red-900/30 border border-red-700 text-red-400 text-sm'>
                                                Ransomware.LockBit
                                            </div>
                                            <div className='px-3 py-1 rounded-md bg-orange-900/30 border border-orange-700 text-orange-300 text-sm'>
                                                Risk 98%
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={()=>{setSelectedDevice(false)}} className='rounded-lg flex flex-col p-3 items-center justify-center border-2 border-white bg-black hover:bg-gray-700'>
                                        <Image src="/close.png" alt="Logo" width={12} height={12} />
                                    </button>
                                </div>

                                {/* TOP SECTION */}
                                <div className='grid grid-cols-3 gap-4 mb-5'>
                                    {/* DEVICE INFO */}
                                    <div className='bg-[#121A2B] border border-gray-700 rounded-xl p-5'>
                                        <h2 className='text-lg font-semibold text-white mb-4'>
                                            Device Information
                                        </h2>
                                        <div className='flex flex-col gap-3 text-sm'>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-400'>Hostname</span>
                                                <span className='text-white'>DB-SERVER-01</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-400'>IP Address</span>
                                                <span className='text-white'>192.168.2.30</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-400'>OS</span>
                                                <span className='text-white'>Windows Server</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-400'>Domain</span>
                                                <span className='text-white'>CORP.LOCAL</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-400'>Site</span>
                                                <span className='text-white'>Head Office</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* USERS */}
                                    <div className='bg-[#121A2B] border border-gray-700 rounded-xl p-5'>
                                        <h2 className='text-lg font-semibold text-white mb-4'>
                                            Active Users
                                        </h2>
                                        <div className='flex flex-wrap gap-2'>
                                            <div className='px-3 py-2 rounded-md bg-[#1B2332] border border-gray-700 text-cyan-300'>
                                                admin
                                            </div>
                                            <div className='px-3 py-2 rounded-md bg-[#1B2332] border border-gray-700 text-cyan-300'>
                                                backup-service
                                            </div>
                                            <div className='px-3 py-2 rounded-md bg-[#1B2332] border border-gray-700 text-cyan-300'>
                                                root
                                            </div>
                                        </div>
                                    </div>

                                    {/* THREAT SUMMARY */}
                                    <div className='bg-[#121A2B] border border-gray-700 rounded-xl p-5'>
                                        <h2 className='text-lg font-semibold text-white mb-4'>
                                            Threat Summary
                                        </h2>
                                        <div className='flex flex-col gap-3 text-sm'>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-400'>Total Events</span>
                                                <span className='text-white'>15</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-400'>External Connection</span>
                                                <span className='text-red-400'>Detected</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-400'>Data Accessed</span>
                                                <span className='text-orange-300'>YES</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-400'>MITRE Technique</span>
                                                <span className='text-white'>T1059</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-400'>Detection</span>
                                                <span className='text-white'>Heuristic</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ACTIVITY + CONNECTION */}
                                <div className='grid grid-cols-2 gap-4 mb-5'>
                                    {/* RECENT ACTIVITIES */}
                                    <div className='bg-[#121A2B] border border-gray-700 rounded-xl p-5'>
                                        <h2 className='text-lg font-semibold text-white mb-4'>
                                            Recent Activities
                                        </h2>
                                        <div className='flex flex-col gap-3'>
                                            <div className='p-3 rounded-lg bg-[#182132] border border-gray-700'>
                                                <p className='text-red-300 font-medium'>
                                                    Executed trojan.exe
                                                </p>
                                                <p className='text-gray-400 text-sm mt-1'>
                                                    08:12 AM • Ransomware activity detected
                                                </p>
                                            </div>
                                            <div className='p-3 rounded-lg bg-[#182132] border border-gray-700'>
                                                <p className='text-orange-300 font-medium'>
                                                    Accessed sensitive database
                                                </p>
                                                <p className='text-gray-400 text-sm mt-1'>
                                                    08:13 AM • Unauthorized access
                                                </p>
                                            </div>
                                            <div className='p-3 rounded-lg bg-[#182132] border border-gray-700'>
                                                <p className='text-cyan-300 font-medium'>
                                                    Connected to external server
                                                </p>
                                                <p className='text-gray-400 text-sm mt-1'>
                                                    08:14 AM • Outbound connection detected
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* NETWORK DESTINATION */}
                                    <div className='bg-[#121A2B] border border-gray-700 rounded-xl p-5'>
                                        <h2 className='text-lg font-semibold text-white mb-4'>
                                            Network Destination
                                        </h2>
                                        <div className='flex flex-col gap-3'>
                                            <div className='p-3 rounded-lg bg-[#182132] border border-gray-700 flex justify-between items-center'>
                                                <div>
                                                    <p className='text-white'>
                                                        192.168.2.30
                                                    </p>
                                                    <p className='text-gray-400 text-sm'>
                                                        Local Endpoint
                                                    </p>
                                                </div>
                                                <div className='text-red-400 text-xl'>
                                                    →
                                                </div>
                                                <div className='text-right'>
                                                    <p className='text-red-300'>
                                                        45.33.22.10
                                                    </p>
                                                    <p className='text-gray-400 text-sm'>
                                                        Suspicious Remote
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='p-3 rounded-lg bg-[#182132] border border-gray-700 flex justify-between items-center'>
                                                <div>
                                                    <p className='text-white'>
                                                        192.168.2.30
                                                    </p>
                                                    <p className='text-gray-400 text-sm'>
                                                        Local Endpoint
                                                    </p>
                                                </div>

                                                <div className='text-orange-300 text-xl'>
                                                    →
                                                </div>

                                                <div className='text-right'>
                                                    <p className='text-orange-300'>
                                                        8.8.8.8
                                                    </p>
                                                    <p className='text-gray-400 text-sm'>
                                                        DNS Request
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* EVENT TIMELINE */}
                                <div className='bg-[#121A2B] border border-gray-700 rounded-xl p-5'>
                                    <h2 className='text-lg font-semibold text-white mb-4'>
                                        Event Timeline
                                    </h2>
                                    <div className='flex flex-col gap-3'>
                                        <div className='flex items-start gap-3'>
                                            <div className='w-3 h-3 rounded-full bg-red-500 mt-2'></div>
                                            <div>
                                                <p className='text-white'>
                                                    Malware execution detected
                                                </p>
                                                <p className='text-gray-400 text-sm'>
                                                    2026-05-15 08:12:00
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex items-start gap-3'>
                                            <div className='w-3 h-3 rounded-full bg-orange-400 mt-2'></div>
                                            <div>
                                                <p className='text-white'>
                                                    Unauthorized file access
                                                </p>
                                                <p className='text-gray-400 text-sm'>
                                                    2026-05-15 08:13:00
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex items-start gap-3'>
                                            <div className='w-3 h-3 rounded-full bg-cyan-400 mt-2'></div>
                                            <div>
                                                <p className='text-white'>
                                                    External outbound connection
                                                </p>
                                                <p className='text-gray-400 text-sm'>
                                                    2026-05-15 08:14:00
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={()=>{setSelectedDevice(false)}} className='rounded-lg flex flex-col p-3 items-center justify-center border-2 border-white bg-black hover:bg-gray-700'>
                        <Image src="/close.png" alt="Logo" width={12} height={12} />
                    </button>
                </div>
            </>
        )}
    </div>
  )
}

export default DashboardDeviceUserActivityInformation