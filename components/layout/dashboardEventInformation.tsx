"use client"

import Image from 'next/image'
import { useState } from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts'

const DashboardEventInformation = () => {
  const [selectedMonth, setSelectedMonth] = useState<boolean>(false)

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
  ]

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

  const recentEvents = [
    { time: "08:20", text: "CLIENT-10 Clean activity", status: "SAFE" },
    { time: "08:19", text: "DB-SERVER-01 Ransomware attempt", status: "CRITICAL" },
    { time: "08:18", text: "CLIENT-09 Keylogger detected", status: "HIGH" },
    { time: "08:17", text: "CLIENT-08 Downloader malware", status: "HIGH" },
    { time: "08:16", text: "CLIENT-06 Adware detected", status: "WARNING" },
    { time: "08:15", text: "CLIENT-07 Worm activity", status: "HIGH" },
    { time: "08:14", text: "CLIENT-05 Normal traffic", status: "SAFE" },
    { time: "08:13", text: "WIN-SRV-01 Credential dumping activity", status: "CRITICAL" },
    { time: "08:12", text: "PC-02 Suspicious DLL activity", status: "WARNING" },
    { time: "08:11", text: "LAPTOP-03 Spyware detected", status: "HIGH" },
  ]

  const getStatusStyle = (status: string) => {
    if (status === "SAFE") {
      return {
        badge: "border-green-500/30 bg-green-500/10 text-green-400",
        dot: "bg-green-400",
        row: "hover:border-green-500/30",
      }
    }

    if (status === "WARNING") {
      return {
        badge: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
        dot: "bg-yellow-400",
        row: "hover:border-yellow-500/30",
      }
    }

    if (status === "HIGH") {
      return {
        badge: "border-orange-500/30 bg-orange-500/10 text-orange-400",
        dot: "bg-orange-500",
        row: "hover:border-orange-500/30",
      }
    }

    return {
      badge: "border-red-500/30 bg-red-500/10 text-red-400",
      dot: "bg-red-500",
      row: "hover:border-red-500/30",
    }
  }

  const criticalCount = dataEventDetail.filter((item) => item.status === "CRITICAL").length
  const highCount = dataEventDetail.filter((item) => item.status === "HIGH").length
  const warningCount = dataEventDetail.filter((item) => item.status === "WARNING").length
  const safeCount = dataEventDetail.filter((item) => item.status === "SAFE").length

  return (
    <>
      <div className="w-full rounded-2xl border border-[#353b6c] bg-[#0b0c1c] p-5 md:p-6">

        {/* HEADER */}
        <div className="relative overflow-hidden rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] via-[#120b2f] to-[#0c0b20] p-6 mb-5">
          <div className="absolute -top-20 -right-20 w-[220px] h-[220px] rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[220px] h-[220px] rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-sm text-red-300 font-semibold mb-2">
                Event Security Analytics
              </p>
              <h2 className="font-bold text-[26px] md:text-[30px]">
                Event Information
              </h2>
              <p className="text-gray-400 mt-2 max-w-2xl">
                Monitoring aktivitas event, deteksi malware, dan status ancaman
                berdasarkan log keamanan jaringan.
              </p>
            </div>

            <button
              onClick={() => setSelectedMonth(true)}
              className="flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-[#353b6c] bg-[#0c0b20]/70 hover:bg-[#353b6c] transition-all duration-200"
            >
              <Image src="/info.png" alt="Info" width={15} height={15} />
              <p className="font-bold">Status Info</p>
            </button>
          </div>
        </div>

        {/* CHART + STATUS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">

          {/* CHART */}
          <div className="xl:col-span-2 rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <p className="font-bold text-[20px]">
                  Event Activity Timeline
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Jumlah event yang terdeteksi per jam.
                </p>
              </div>

              <div className="px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-bold">
                Live Monitor
              </div>
            </div>

            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataMalware}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis
                    dataKey="time"
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
                    cursor={{ stroke: "#ef4444", strokeWidth: 1 }}
                    contentStyle={{
                      backgroundColor: "#0c0b20",
                      border: "1px solid #353b6c",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="object_event"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{
                      r: 6,
                      fill: "#ef4444",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RISK SUMMARY */}
          <div className="rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] to-[#120b2f] p-5">
            <div className="mb-5">
              <p className="font-bold text-[20px]">Risk Summary</p>
              <p className="text-gray-500 text-sm mt-1">
                Ringkasan status event terbaru.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-red-400 font-bold">Critical</p>
                  <p className="text-[26px] font-bold">{criticalCount}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">highest threat level</p>
              </div>

              <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-orange-400 font-bold">High</p>
                  <p className="text-[26px] font-bold">{highCount}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">dangerous activity</p>
              </div>

              <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-yellow-300 font-bold">Warning</p>
                  <p className="text-[26px] font-bold">{warningCount}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">needs attention</p>
              </div>

              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-green-400 font-bold">Safe</p>
                  <p className="text-[26px] font-bold">{safeCount}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">normal activity</p>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div className="rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] to-[#120b2f] p-5">
            <p className="text-gray-400 text-sm">Total Events</p>
            <p className="font-bold text-[30px] mt-1">
              12097
            </p>
            <p className="text-xs text-gray-500">All Data</p>
          </div>

          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <p className="text-red-400 text-sm font-bold">Critical</p>
            <p className="font-bold text-[30px] mt-1">
              65
            </p>
            <p className="text-xs text-gray-500">Alert</p>
          </div>

          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
            <p className="text-green-400 text-sm font-bold">Safe Rate</p>
            <p className="font-bold text-[30px] mt-1">
              92<span className="text-[16px] ml-1">%</span>
            </p>
            <p className="text-xs text-gray-500">Safe activity</p>
          </div>

          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
            <p className="text-blue-300 text-sm font-bold">New / Hour</p>
            <p className="font-bold text-[30px] mt-1">
              104
            </p>
            <p className="text-xs text-gray-500">new data</p>
          </div>
        </div>

        {/* TABLE + FEED */}
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-5">

          {/* TABLE */}
          <div className="2xl:col-span-2 rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <p className="font-bold text-[20px]">Event Detail</p>
                <p className="text-sm text-gray-500 mt-1">
                  Detail host, IP, malware, dan status deteksi.
                </p>
              </div>

              <div className="px-3 py-2 rounded-lg border border-[#353b6c] bg-[#14122d] text-sm text-gray-400">
                {dataEventDetail.length} records
              </div>
            </div>

            <div className="w-full overflow-auto scrollbar-hide">
              <div className="min-w-[850px]">
                <div className="grid grid-cols-[90px_110px_1.2fr_1.2fr_1.4fr_120px] gap-3 px-4 py-3 rounded-xl border border-[#353b6c] bg-[#14122d] text-gray-400 text-sm font-bold">
                  <p>Time</p>
                  <p>Event ID</p>
                  <p>Host</p>
                  <p>IP Address</p>
                  <p>Malware</p>
                  <p>Status</p>
                </div>

                <div className="h-[330px] overflow-auto scrollbar-hide mt-3 space-y-2">
                  {dataEventDetail.map((item, index) => {
                    const style = getStatusStyle(item.status)

                    return (
                      <div
                        key={index}
                        className={`
                          grid grid-cols-[90px_110px_1.2fr_1.2fr_1.4fr_120px] gap-3
                          items-center px-4 py-3 rounded-xl
                          border border-[#353b6c]
                          bg-[#0c0b20]
                          transition-all duration-200
                          ${style.row}
                        `}
                      >
                        <p className="text-gray-300">{item.time}</p>
                        <p className="text-gray-400">#{item.eventId}</p>
                        <p className="font-semibold">{item.host}</p>
                        <p className="text-blue-300">{item.ip}</p>
                        <p className="text-gray-300">{item.malware}</p>
                        <div
                          className={`
                            inline-flex items-center justify-center gap-2
                            px-3 py-2 rounded-lg border text-xs font-bold
                            ${style.badge}
                          `}
                        >
                          <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                          {item.status}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RECENT FEED */}
          <div className="rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] to-[#120b2f] p-5">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <p className="text-[20px] font-bold">Recent Events Feed</p>
                <p className="text-gray-500 text-sm mt-1">
                  Aktivitas terbaru dari sistem.
                </p>
              </div>

              <button
                onClick={() => setSelectedMonth(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#353b6c] bg-[#0c0b20] hover:bg-[#353b6c] transition-all duration-200"
              >
                <p className="text-sm font-bold">Info</p>
                <Image src="/info.png" alt="Info" width={12} height={12} />
              </button>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 mb-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping opacity-50" />
                <div className="relative w-3 h-3 bg-red-500 rounded-full" />
              </div>
              <p className="text-sm text-red-400 font-bold">
                2 critical events detected
              </p>
            </div>

            <div className="h-[375px] overflow-auto scrollbar-hide space-y-3 pr-1">
              {recentEvents.map((item, index) => {
                const style = getStatusStyle(item.status)

                return (
                  <div
                    key={index}
                    className="relative flex gap-3 rounded-xl border border-[#353b6c] bg-[#0c0b20]/80 p-4 hover:bg-[#14122d] transition-all duration-200"
                  >
                    <div className="flex flex-col items-center">
                      <div className="relative mt-1">
                        {(item.status === "CRITICAL") && (
                          <div className={`absolute w-3 h-3 rounded-full ${style.dot} animate-ping opacity-50`} />
                        )}
                        <div className={`relative w-3 h-3 rounded-full ${style.dot}`} />
                      </div>

                      {index !== recentEvents.length - 1 && (
                        <div className="w-[1px] flex-1 bg-[#353b6c] mt-2" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm">{item.time}</p>
                        <span className={`px-2 py-1 rounded-md border text-[10px] font-bold ${style.badge}`}>
                          {item.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-400">
                        {item.text}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL INFO STATUS */}
      {selectedMonth && (
        <>
          <div className="fixed inset-0 z-40 bg-[#0c0b20]/90 backdrop-blur-sm" />

          <div className="fixed inset-0 z-50 flex justify-center items-start gap-3 pt-[130px] px-5">
            <div className="w-full max-w-[760px] rounded-2xl border border-[#353b6c] bg-[#0c0b20] p-7 shadow-2xl">
              <div className="mb-6">
                <p className="font-bold text-[24px]">Info Status Recent Events</p>
                <p className="text-gray-500 mt-1">
                  Berikut maksud warna status pada setiap data recent events.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[540px] overflow-auto scrollbar-hide pr-1">

                {/* SAFE */}
                <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                    <p className="font-bold text-green-400">SAFE</p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-300">
                    <p>Clean activity</p>
                    <p>Normal traffic</p>
                    <p>Authorized access</p>
                    <p>No threat detected</p>
                    <p>Routine scan completed</p>
                    <p>Policy compliance success</p>
                    <p>Heartbeat received</p>
                  </div>
                </div>

                {/* WARNING */}
                <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <p className="font-bold text-yellow-300">WARNING</p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-300">
                    <p>Adware detected</p>
                    <p>Suspicious DLL</p>
                    <p>Unknown file activity</p>
                    <p>Potentially unwanted application</p>
                    <p>Unusual behavior detected</p>
                    <p>Browser hijack attempt</p>
                    <p>Abnormal script execution</p>
                  </div>
                </div>

                {/* HIGH */}
                <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                    <p className="font-bold text-orange-400">HIGH</p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-300">
                    <p>Trojan detected</p>
                    <p>Spyware detected</p>
                    <p>Keylogger detected</p>
                    <p>Worm activity</p>
                    <p>Downloader malware</p>
                    <p>Credential theft attempt</p>
                    <p>Unauthorized execution detected</p>
                    <p>Persistence mechanism found</p>
                    <p>Malicious PowerShell activity</p>
                  </div>
                </div>

                {/* CRITICAL */}
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping opacity-50" />
                      <div className="relative w-3 h-3 bg-red-500 rounded-full" />
                    </div>
                    <p className="font-bold text-red-400">CRITICAL</p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-300">
                    <p>Ransomware attempt</p>
                    <p>Privilege escalation detected</p>
                    <p>Mass infection detected</p>
                    <p>Remote exploit execution</p>
                    <p>Credential dumping activity</p>
                    <p>Active data exfiltration</p>
                    <p>Critical exploit detected</p>
                    <p>Lateral movement detected</p>
                    <p>Domain controller compromise</p>
                    <p>Command and control connection</p>
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
    </>
  )
}

export default DashboardEventInformation