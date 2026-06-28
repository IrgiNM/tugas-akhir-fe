"use client"

import DataTopReportsFunction from '@/lib/data/dataTopReports'
import Image from 'next/image'
import { useState } from 'react'
import DashboardDeviceUserActivityInformation from './dashboardDeviceUserActivityInformation'
import DashboardEventInformation from './dashboardEventInformation'
import NavbarSecurityEvent from './navbarSecurityEvent'
import DashboardTrafficMonitoring from './dashboardTrafficMonitoring'
import DashboardWebApplicationMonitoring from './dashboardWebApplicationMonitoring'
import DashboardClientMonitoring from './dashboardClientMonitoring'
import DashboardDestinationMonitoring from './dashboardDestinationMonitoring'
import DashboardNetworkSystemAlarm from './dashboardNetworkSystemAlarm'
import { fetchSyslogLogs } from '@/lib/function/api'
import useSyslogLogs from '@/lib/data/dataSyslogLogs'

const CardSummarySecurityEvents = () => {
  const [selectedDate, setSelectedDate] = useState<boolean>(false)

  const [refreshSyslogKey, setRefreshSyslogKey] = useState<number>(0)
  const [isFetchingSyslog, setIsFetchingSyslog] = useState<boolean>(false)

  const handleFetchSyslog = async () => {
    setIsFetchingSyslog(true)
  
    try {
      const res = await fetchSyslogLogs()
  
      if (res.status === 200) {
        setRefreshSyslogKey((prev) => prev + 1)
  
        alert(
          `Fetch syslog selesai. Created: ${res.data.result.created}, Skipped: ${res.data.result.skipped}`
        )
      }
    } catch (error) {
      console.error("Error fetching syslog:", error)
      alert("Gagal fetch syslog")
    } finally {
      setIsFetchingSyslog(false)
    }
  }

  const today = new Date()

  const [pickDateTop, setPickDateTop] = useState<string>(
    String(today.getDate()).padStart(2, "0")
  )

  const [pickMonthTop, setPickMonthTop] = useState<string>(
    String(today.getMonth() + 1).padStart(2, "0")
  )

  const [pickYearTop, setPickYearTop] = useState<string>(
    String(today.getFullYear())
  )

  const selectedFullDate = `${pickYearTop}-${pickMonthTop}-${pickDateTop}`

  const {
    syslogLogs,
  } = useSyslogLogs(
    {
      date: selectedFullDate,
    },
    refreshSyslogKey
  )
  
  const {
    dataDateAt,
    dataMonthAt,
    dataYearAt,
  } = useSyslogLogs(
    {
      year: pickYearTop,
      month: pickMonthTop,
    },
    refreshSyslogKey
  )

  

  const [pickNavbar, setPickNavbar] = useState<string>('Dashboard Overview')

  return (
    <div className="w-full mt-[135px] rounded-2xl border border-[#353b6c] bg-[#0c0b20] p-6 md:p-8 text-white shadow-2xl shadow-black/30">

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] via-[#120b2f] to-[#0c0b20] p-6 mb-6">
        <div className="absolute -top-20 -right-20 w-[220px] h-[220px] rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[220px] h-[220px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <p className="text-sm text-red-300 font-semibold mb-2">
              Security Monitoring
            </p>

            <h1 className="font-bold text-[28px] md:text-[34px]">
              Security Events Report
            </h1>

            <p className="text-gray-400 mt-2 max-w-2xl">
              Monitoring aktivitas keamanan jaringan, event mencurigakan,
              dan aktivitas perangkat user berdasarkan data log server.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleFetchSyslog}
              disabled={isFetchingSyslog}
              className={`
                flex items-center justify-center gap-3 px-4 py-3 rounded-xl 
                border border-blue-500/30 bg-blue-500/10 
                text-blue-300 font-bold 
                hover:bg-blue-500/20 transition-all duration-200
                ${isFetchingSyslog ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              {isFetchingSyslog ? "Fetching..." : "Fetch Manual"}
            </button>

            <button
              onClick={() => setSelectedDate(true)}
              className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-[#353b6c] bg-[#0c0b20]/80 hover:bg-[#353b6c] transition-all duration-200"
            >
              <div className="text-left">
                <p className="text-xs text-gray-500">Selected Date</p>
                <p className="font-bold">
                  {pickYearTop}-{pickMonthTop}-{pickDateTop}
                </p>
              </div>

              <Image src="/arrow-icon.png" alt="Arrow" width={8} height={8} />
            </button>

            <div className="flex items-center gap-4 px-4 py-3 rounded-xl border border-[#353b6c] bg-[#0c0b20]/80">
              <div>
                <p className="text-xs text-gray-500">Total Data</p>
                <p className="font-bold">
                  {syslogLogs.length} data/hari
                </p>
              </div>

              <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Navbar Security */}
      <div className="mb-6">
        <NavbarSecurityEvent
          pick={pickNavbar}
          click={(value) => setPickNavbar(value)}
        />
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-[#353b6c] bg-[#08071a] p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div>
            <p className="font-bold text-[22px]">
              {pickNavbar}
            </p>

            <p className="text-gray-500 text-sm mt-1">
              {pickNavbar === 'Event Information'
                ? 'Ringkasan informasi event keamanan yang terdeteksi.'
                : 'Ringkasan aktivitas perangkat dan user pada jaringan.'}
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl border border-[#353b6c] bg-[#14122d] text-sm text-gray-400">
            Security Events
          </div>
        </div>

        {pickNavbar === 'Dashboard Overview' && (
          <DashboardEventInformation
            pickDateTop={pickDateTop}
            pickMonthTop={pickMonthTop}
            pickYearTop={pickYearTop}
            refreshSyslogKey={refreshSyslogKey}
          />
        )}
        
        {pickNavbar === 'Traffic Monitoring' && (
          <DashboardTrafficMonitoring
            pickDateTop={pickDateTop}
            pickMonthTop={pickMonthTop}
            pickYearTop={pickYearTop}
            refreshSyslogKey={refreshSyslogKey}
          />
        )}
        
        {pickNavbar === 'Web & Application Monitoring' && (
          <DashboardWebApplicationMonitoring
            pickDateTop={pickDateTop}
            pickMonthTop={pickMonthTop}
            pickYearTop={pickYearTop}
            refreshSyslogKey={refreshSyslogKey}
          />
        )}
        
        {pickNavbar === 'Client Monitoring' && (
          <DashboardClientMonitoring
            pickDateTop={pickDateTop}
            pickMonthTop={pickMonthTop}
            pickYearTop={pickYearTop}
            refreshSyslogKey={refreshSyslogKey}
          />
        )}
        
        {pickNavbar === 'Destination Monitoring' && (
          <DashboardDestinationMonitoring
            pickDateTop={pickDateTop}
            pickMonthTop={pickMonthTop}
            pickYearTop={pickYearTop}
            refreshSyslogKey={refreshSyslogKey}
          />
        )}
        
        {pickNavbar === 'Network & System Alarm' && (
          <DashboardNetworkSystemAlarm
            pickDateTop={pickDateTop}
            pickMonthTop={pickMonthTop}
            pickYearTop={pickYearTop}
            refreshSyslogKey={refreshSyslogKey}
          />
        )}

        {pickNavbar === 'Device User Activity Information' && (
          <DashboardDeviceUserActivityInformation />
        )}
      </div>

      {/* Modal Date */}
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
                    {pickYearTop || 'Year'}
                  </button>

                  <div className="h-[180px] overflow-auto scrollbar-hide space-y-2">
                    {dataYearAt.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setPickYearTop(item)
                        }}
                        className="w-full p-3 rounded-lg border border-[#353b6c] bg-[#14122d] hover:bg-[#353b6c] transition-all duration-200"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <button className="w-full p-3 rounded-xl border border-blue-500 bg-gradient-to-b from-[#2563eb] to-[#1e40af] font-bold mb-3">
                    {pickMonthTop || 'Month'}
                  </button>

                  <div className="h-[180px] overflow-auto scrollbar-hide space-y-2">
                    {dataMonthAt.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setPickMonthTop(item)
                        }}
                        className="w-full p-3 rounded-lg border border-[#353b6c] bg-[#14122d] hover:bg-[#353b6c] transition-all duration-200"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <button className="w-full p-3 rounded-xl border border-blue-500 bg-gradient-to-b from-[#2563eb] to-[#1e40af] font-bold mb-3">
                    {pickDateTop || 'Date'}
                  </button>

                  <div className="h-[180px] overflow-auto scrollbar-hide space-y-2">
                    {dataDateAt.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setPickDateTop(item)
                          setSelectedDate(false)
                        }}
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
    </div>
  )
}

export default CardSummarySecurityEvents