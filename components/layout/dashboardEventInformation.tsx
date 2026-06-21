"use client"

import useSyslogLogs from "@/lib/data/dataSyslogLogs"
import { fetchSyslogLogs } from "@/lib/function/api"
import Image from "next/image"
import { useState } from "react"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

type DashboardEventInformationProps = {
  pickDateTop: string
  pickMonthTop: string
  pickYearTop: string
  refreshSyslogKey: number
}

const DashboardEventInformation = ({
  pickDateTop,
  pickMonthTop,
  pickYearTop,
  refreshSyslogKey,
}: DashboardEventInformationProps) => {
  const [selectedMonth, setSelectedMonth] = useState<boolean>(false)
  const [selectedAction, setSelectedAction] = useState<string>("All")

  const getTodayDate = () => {
    const today = new Date()
  
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const date = String(today.getDate()).padStart(2, "0")
  
    return `${year}-${month}-${date}`
  }

  const selectedFullDate = `${pickYearTop}-${pickMonthTop}-${pickDateTop}`

  const {
    isLoadingSyslog,
    errorSyslog,
    totalLogs,
    totalAllow,
    totalDeny,
    totalAlarm,
    allowRate,
    latestUpdate,
    mostActiveLogType,
    logTypeSummary,
    latestLogs,
    recentActivity,
  } = useSyslogLogs(
    {
      date: selectedFullDate,
      action: selectedAction === "All" ? undefined : selectedAction,
    },
    refreshSyslogKey
  )
  
  const {
    overviewTimeline,
  } = useSyslogLogs(
    {
      year: pickYearTop,
      month: pickMonthTop,
    },
    refreshSyslogKey
  )
  

  const getActionStyle = (status: string) => {
    if (status === "Allow") {
      return {
        badge: "border-green-500/30 bg-green-500/10 text-green-400",
        dot: "bg-green-400",
        row: "hover:border-green-500/30",
      }
    }

    if (status === "Deny") {
      return {
        badge: "border-red-500/30 bg-red-500/10 text-red-400",
        dot: "bg-red-500",
        row: "hover:border-red-500/30",
      }
    }

    if (status === "Drop" || status === "Block") {
      return {
        badge: "border-orange-500/30 bg-orange-500/10 text-orange-400",
        dot: "bg-orange-500",
        row: "hover:border-orange-500/30",
      }
    }

    return {
      badge: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
      dot: "bg-yellow-400",
      row: "hover:border-yellow-500/30",
    }
  }

  if (isLoadingSyslog) {
    return (
      <div className="w-full rounded-2xl border border-[#353b6c] bg-[#0b0c1c] p-8">
        <p className="text-gray-300 font-bold">Loading syslog data...</p>
        <p className="text-gray-500 text-sm mt-1">
          Sedang mengambil data log dari server.
        </p>
      </div>
    );
  }
  
  if (errorSyslog) {
    return (
      <div className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 p-8">
        <p className="text-red-400 font-bold">Gagal mengambil data</p>
        <p className="text-gray-300 text-sm mt-1">{errorSyslog}</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full rounded-2xl border border-[#353b6c] bg-[#0b0c1c] p-5 md:p-6">

        {/* HEADER */}
        <div className="relative overflow-hidden rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] via-[#120b2f] to-[#0c0b20] p-6 mb-5">
          <div className="absolute -top-20 -right-20 w-[220px] h-[220px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[220px] h-[220px] rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-sm text-blue-300 font-semibold mb-2">
                Syslog Monitoring Overview
              </p>
              <h2 className="font-bold text-[26px] md:text-[30px]">
                Dashboard Overview
              </h2>
              <p className="text-gray-500 mt-2 max-w-2xl">
                Ringkasan aktivitas log jaringan berdasarkan data firewall,
                proxy, traffic, dan alarm sistem WatchGuard.
                {selectedFullDate && (
                  <span className="block mt-1 text-blue-300 font-semibold">
                    Data ditampilkan untuk tanggal {selectedFullDate}
                  </span>
                )}
              </p>
            </div>

            <button
              onClick={() => setSelectedMonth(true)}
              className="flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-[#353b6c] bg-[#0c0b20]/70 hover:bg-[#353b6c] transition-all duration-200"
            >
              <Image src="/info.png" alt="Info" width={15} height={15} />
              <p className="font-bold">Info Dashboard</p>
            </button>
          </div>
        </div>

        {/* MAIN STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div className="rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] to-[#120b2f] p-5">
            <p className="text-gray-400 text-sm">Total Logs</p>
            <p className="font-bold text-[30px] mt-1">{totalLogs}</p>
            <p className="text-xs text-gray-500">All syslog data</p>
          </div>

          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
            <p className="text-green-400 text-sm font-bold">Allow Logs</p>
            <p className="font-bold text-[30px] mt-1">{totalAllow}</p>
            <p className="text-xs text-gray-500">Allowed traffic</p>
          </div>

          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <p className="text-red-400 text-sm font-bold">Deny Logs</p>
            <p className="font-bold text-[30px] mt-1">{totalDeny}</p>
            <p className="text-xs text-gray-500">Denied traffic</p>
          </div>

          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
            <p className="text-yellow-300 text-sm font-bold">Alarm Logs</p>
            <p className="font-bold text-[30px] mt-1">{totalAlarm}</p>
            <p className="text-xs text-gray-500">Link monitor & system</p>
          </div>
        </div>

        {/* CHART + LOG TYPE SUMMARY */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">

          {/* CHART */}
          <div className="xl:col-span-2 rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
              <p className="font-bold text-[20px]">
                Allow & Deny Daily Trend
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Grafik jumlah Allow dan Deny per hari selama bulan {pickMonthTop}-{pickYearTop}.
              </p>
              </div>

              <div className="px-3 py-2 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-bold">
                Monthly
              </div>
            </div>

            <div className="w-full h-[580px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overviewTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />

                <XAxis
                  dataKey="date"
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
                  contentStyle={{
                    backgroundColor: "#0c0b20",
                    border: "1px solid #353b6c",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  labelFormatter={(label) => `Tanggal ${label}`}
                />

                <Line
                  type="monotone"
                  dataKey="allow"
                  name="Allow"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="deny"
                  name="Deny"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            </div>
          </div>

          {/* LOG TYPE SUMMARY */}
          <div className="rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] to-[#120b2f] p-5">
            <div className="mb-5">
              <p className="font-bold text-[20px]">Log Type Summary</p>
              <p className="text-gray-500 text-sm mt-1">
                Jumlah data berdasarkan jenis log.
              </p>
            </div>

            <div className="space-y-3">
              {logTypeSummary.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/80 p-4"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="font-bold text-sm">{item.label}</p>
                    <p className="font-bold text-blue-300">{item.total}</p>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#14122d] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${(item.total / totalLogs) * 100}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    {item.type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ALLOW / DENY RATE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
            <p className="text-gray-400 text-sm">Allow Rate</p>
            <p className="font-bold text-[30px] mt-1">
              {allowRate}<span className="text-[16px] ml-1">%</span>
            </p>
            <p className="text-xs text-gray-500">comparison from total logs</p>
          </div>

          <div className="rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
            <p className="text-gray-400 text-sm">Most Active Log Type</p>
            <p className="font-bold text-[30px] mt-1">{mostActiveLogType}</p>
            <p className="text-xs text-gray-500">highest generated logs</p>
          </div>

          <div className="rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
            <p className="text-gray-400 text-sm">Latest Update</p>
            <p className="font-bold text-[30px] mt-1">{latestUpdate}</p>
            <p className="text-xs text-gray-500">last syslog received</p>
          </div>
        </div>

        {/* TABLE + FEED */}
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-5">

          {/* TABLE */}
          <div className="2xl:col-span-2 rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 mb-5">
              <div>
                <p className="font-bold text-[20px]">Latest Syslog Records</p>
                <p className="text-sm text-gray-500 mt-1">
                  Data log terbaru dari firewall, proxy, traffic, dan alarm.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-[#353b6c] bg-[#14122d] p-1">
                  {["All", "Allow", "Deny"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedAction(item)}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200
                        ${
                          selectedAction === item
                            ? item === "Allow"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : item === "Deny"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "text-gray-400 hover:bg-[#0c0b20]"
                        }
                      `}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="px-3 py-2 rounded-lg border border-[#353b6c] bg-[#14122d] text-sm text-gray-400 flex items-center justify-center">
                  {latestLogs.length} records
                </div>
              </div>
            </div>

            <div className="w-full overflow-auto scrollbar-hide">
              <div className="min-w-[1100px]">
                <div className="grid grid-cols-[80px_150px_100px_1.1fr_1.1fr_90px_90px_120px_1.4fr] gap-3 px-4 py-3 rounded-xl border border-[#353b6c] bg-[#14122d] text-gray-400 text-sm font-bold">
                  <p>No</p>
                  <p>Type</p>
                  <p>Action</p>
                  <p>Source IP</p>
                  <p>Destination IP</p>
                  <p>Proto</p>
                  <p>Port</p>
                  <p>Geo</p>
                  <p>Message</p>
                </div>

                <div className="h-[330px] overflow-auto scrollbar-hide mt-3 space-y-2">
                  {latestLogs.map((item, index) => {
                    const style = getActionStyle(item.action)

                    return (
                      <div
                        key={index}
                        className={`
                          grid grid-cols-[80px_150px_100px_1.1fr_1.1fr_90px_90px_120px_1.4fr] gap-3
                          items-center px-4 py-3 rounded-xl
                          border border-[#353b6c]
                          bg-[#0c0b20]
                          transition-all duration-200
                          ${style.row}
                        `}
                      >
                        <p className="text-gray-300">{index+1}</p>
                        <p className="font-semibold text-blue-300">{item.logType}</p>

                        <div
                          className={`
                            inline-flex items-center justify-center gap-2
                            px-3 py-2 rounded-lg border text-xs font-bold
                            ${style.badge}
                          `}
                        >
                          <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                          {item.action}
                        </div>

                        <p className="text-gray-300">{item.srcIp}</p>
                        <p className="text-gray-300">{item.dstIp}</p>
                        <p className="text-gray-400">{item.protocol}</p>
                        <p className="text-gray-400">{item.dstPort}</p>
                        <p className="text-gray-400">{item.geo}</p>
                        <p className="text-gray-300 truncate">{item.message}</p>
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
                <p className="text-[20px] font-bold">Recent Activity</p>
                <p className="text-gray-500 text-sm mt-1">
                  Aktivitas terbaru dari syslog.
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

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-500/10 mb-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-50" />
                <div className="relative w-3 h-3 bg-blue-500 rounded-full" />
              </div>
              <p className="text-sm text-blue-300 font-bold">
                {latestLogs.length} logs displayed
                {selectedAction !== "All" ? ` with ${selectedAction} action` : ""}
              </p>
            </div>

            <div className="h-[375px] overflow-auto scrollbar-hide space-y-3 pr-1">
              {recentActivity.map((item, index) => {
                const style = getActionStyle(item.status)

                return (
                  <div
                    key={index}
                    className="relative flex gap-3 rounded-xl border border-[#353b6c] bg-[#0c0b20]/80 p-4 hover:bg-[#14122d] transition-all duration-200"
                  >
                    <div className="flex flex-col items-center">
                      <div className="relative mt-1">
                        {item.status === "Deny" && (
                          <div className={`absolute w-3 h-3 rounded-full ${style.dot} animate-ping opacity-50`} />
                        )}
                        <div className={`relative w-3 h-3 rounded-full ${style.dot}`} />
                      </div>

                      {index !== recentActivity.length - 1 && (
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

                      <p className="text-sm font-semibold">
                        {item.title}
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL INFO */}
      {selectedMonth && (
        <>
          <div className="fixed inset-0 z-70 bg-[#0c0b20]/90 backdrop-blur-sm" />

          <div className="fixed inset-0 z-80 flex justify-center items-start gap-3 pt-[130px] px-5">
            <div className="w-full max-w-[760px] rounded-2xl border border-[#353b6c] bg-[#0c0b20] p-7 shadow-2xl">
              <div className="mb-6">
                <p className="font-bold text-[24px]">Info Dashboard Overview</p>
                <p className="text-gray-500 mt-1">
                  Dashboard ini menampilkan ringkasan data syslog berdasarkan jenis log,
                  action, traffic, dan aktivitas terbaru.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[540px] overflow-auto scrollbar-hide pr-1">
                <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
                  <p className="font-bold text-blue-300 mb-3">Total Logs</p>
                  <p className="text-sm text-gray-300">
                    Jumlah semua data log yang berhasil masuk ke database dari API syslog.
                  </p>
                </div>

                <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
                  <p className="font-bold text-green-400 mb-3">Allow</p>
                  <p className="text-sm text-gray-300">
                    Traffic atau request yang diizinkan oleh firewall/proxy policy.
                  </p>
                </div>

                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                  <p className="font-bold text-red-400 mb-3">Deny</p>
                  <p className="text-sm text-gray-300">
                    Traffic atau request yang ditolak oleh firewall/proxy policy.
                  </p>
                </div>

                <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
                  <p className="font-bold text-yellow-300 mb-3">Alarm</p>
                  <p className="text-sm text-gray-300">
                    Event monitoring seperti link monitor, loggerd, atau aktivitas sistem.
                  </p>
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