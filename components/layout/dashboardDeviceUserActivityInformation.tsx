"use client"

import Image from 'next/image'
import { useState } from 'react'

type DeviceType = {
  host: string
  users: string[]
  ip: string
  risk: number
  malware: string
  events: number
  connection: boolean
}

const DashboardDeviceUserActivityInformation = () => {
  const dataTopDevices: DeviceType[] = [
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

  const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(null)

  const getRiskStyle = (risk: number) => {
    if (risk >= 90) {
      return {
        badge: "border-red-500/30 bg-red-500/10 text-red-400",
        bar: "bg-red-500",
        label: "Critical",
      }
    }

    if (risk >= 70) {
      return {
        badge: "border-orange-500/30 bg-orange-500/10 text-orange-400",
        bar: "bg-orange-500",
        label: "High",
      }
    }

    if (risk >= 40) {
      return {
        badge: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
        bar: "bg-yellow-400",
        label: "Warning",
      }
    }

    return {
      badge: "border-green-500/30 bg-green-500/10 text-green-400",
      bar: "bg-green-400",
      label: "Low",
    }
  }

  const totalDevices = dataTopDevices.length
  const criticalDevices = dataTopDevices.filter((item) => item.risk >= 90).length
  const externalConnections = dataTopDevices.filter((item) => item.connection).length
  const totalEvents = dataTopDevices.reduce((total, item) => total + item.events, 0)

  return (
    <>
      <div className="w-full rounded-2xl border border-[#353b6c] bg-[#0b111c] p-5 md:p-6">

        {/* HEADER */}
        <div className="relative overflow-hidden rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] via-[#120b2f] to-[#0c0b20] p-6 mb-5">
          <div className="absolute -top-20 -right-20 w-[220px] h-[220px] rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[220px] h-[220px] rounded-full bg-red-500/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-sm text-cyan-300 font-semibold mb-2">
                Device & User Activity
              </p>

              <h2 className="font-bold text-[26px] md:text-[30px]">
                Top Attack Devices
              </h2>

              <p className="text-gray-400 mt-2 max-w-2xl">
                Menampilkan device yang memiliki aktivitas mencurigakan,
                koneksi eksternal, malware, dan tingkat risiko tertinggi.
              </p>
            </div>

            <div className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10">
              <p className="text-xs text-red-300">Threat Monitor</p>
              <p className="font-bold text-red-400">Active Analysis</p>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div className="rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] to-[#120b2f] p-5">
            <p className="text-gray-400 text-sm">Total Devices</p>
            <p className="text-[30px] font-bold mt-1">{totalDevices}</p>
            <p className="text-xs text-gray-500">monitored endpoint</p>
          </div>

          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <p className="text-red-400 text-sm font-bold">Critical Devices</p>
            <p className="text-[30px] font-bold mt-1">{criticalDevices}</p>
            <p className="text-xs text-gray-500">risk above 90%</p>
          </div>

          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-5">
            <p className="text-orange-400 text-sm font-bold">External Connection</p>
            <p className="text-[30px] font-bold mt-1">{externalConnections}</p>
            <p className="text-xs text-gray-500">detected connection</p>
          </div>

          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
            <p className="text-blue-300 text-sm font-bold">Total Events</p>
            <p className="text-[30px] font-bold mt-1">{totalEvents}</p>
            <p className="text-xs text-gray-500">device events</p>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div>
              <p className="font-bold text-[20px]">Attack Device List</p>
              <p className="text-sm text-gray-500 mt-1">
                Klik device untuk melihat detail aktivitas dan network destination.
              </p>
            </div>

            <div className="px-3 py-2 rounded-lg border border-[#353b6c] bg-[#14122d] text-sm text-gray-400">
              {dataTopDevices.length} records
            </div>
          </div>

          <div className="w-full overflow-auto scrollbar-hide">
            <div className="min-w-[1100px]">

              {/* TABLE HEADER */}
              <div className="grid grid-cols-[1.3fr_1.6fr_1.1fr_1.1fr_1.4fr_90px_120px] gap-3 px-4 py-3 rounded-xl border border-[#353b6c] bg-[#14122d] text-gray-400 text-sm font-bold">
                <p>Device</p>
                <p>Users</p>
                <p>IP Address</p>
                <p>Risk</p>
                <p>Malware</p>
                <p>Events</p>
                <p>Connection</p>
              </div>

              {/* TABLE BODY */}
              <div className="h-[500px] overflow-auto scrollbar-hide mt-3 space-y-2">
                {dataTopDevices.map((item, index) => {
                  const riskStyle = getRiskStyle(item.risk)

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDevice(item)}
                      className="w-full grid grid-cols-[1.3fr_1.6fr_1.1fr_1.1fr_1.4fr_90px_120px] gap-3 items-center px-4 py-4 rounded-xl border border-[#353b6c] bg-[#0c0b20] hover:bg-[#14122d] hover:border-cyan-500/40 transition-all duration-200 text-left"
                    >
                      <div>
                        <p className="font-bold text-white">{item.host}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Endpoint device
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {item.users.map((user, userIndex) => (
                          <div
                            key={userIndex}
                            className="px-2 py-1 rounded-md bg-[#1b2332] border border-[#353b6c] text-xs text-cyan-300"
                          >
                            {user}
                          </div>
                        ))}
                      </div>

                      <p className="text-blue-300">{item.ip}</p>

                      <div>
                        <div className={`inline-flex px-3 py-1 rounded-lg border text-xs font-bold ${riskStyle.badge}`}>
                          {item.risk}% {riskStyle.label}
                        </div>

                        <div className="w-full h-1.5 rounded-full bg-[#1b2332] mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${riskStyle.bar}`}
                            style={{ width: `${item.risk}%` }}
                          />
                        </div>
                      </div>

                      <p className={item.malware === '-' ? 'text-gray-500' : 'text-gray-300'}>
                        {item.malware}
                      </p>

                      <p className="font-bold text-white">{item.events}</p>

                      <div
                        className={`
                          inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold
                          ${
                            item.connection
                              ? 'border-red-500/30 bg-red-500/10 text-red-400'
                              : 'border-green-500/30 bg-green-500/10 text-green-400'
                          }
                        `}
                      >
                        <div
                          className={`
                            w-2 h-2 rounded-full
                            ${item.connection ? 'bg-red-500' : 'bg-green-400'}
                          `}
                        />
                        {item.connection ? 'EXTERNAL' : 'SAFE'}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DEVICE DETAIL MODAL */}
      {selectedDevice && (
        <>
          <div className="fixed inset-0 z-70 bg-[#0c0b20]/90 backdrop-blur-sm" />

          <div className="fixed inset-0 z-80 flex justify-center items-start pt-[90px] px-5">
            <div className="w-full max-w-[1200px] max-h-[88vh] overflow-auto scrollbar-hide rounded-2xl border border-[#353b6c] bg-[#0c0b20] p-6 shadow-2xl">

              {/* MODAL HEADER */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-6">
                <div>
                  <p className="text-sm text-cyan-300 font-semibold mb-2">
                    Device Investigation
                  </p>

                  <h1 className="text-3xl font-bold text-white">
                    {selectedDevice.host}
                  </h1>

                  <div className="flex gap-3 mt-4 flex-wrap">
                    <div className="px-3 py-2 rounded-lg bg-[#14122d] border border-[#353b6c] text-cyan-300 text-sm">
                      {selectedDevice.ip}
                    </div>

                    <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                      {selectedDevice.malware}
                    </div>

                    <div className={`px-3 py-2 rounded-lg border text-sm ${getRiskStyle(selectedDevice.risk).badge}`}>
                      Risk {selectedDevice.risk}%
                    </div>

                    <div
                      className={`
                        px-3 py-2 rounded-lg border text-sm
                        ${
                          selectedDevice.connection
                            ? 'border-red-500/30 bg-red-500/10 text-red-400'
                            : 'border-green-500/30 bg-green-500/10 text-green-400'
                        }
                      `}
                    >
                      {selectedDevice.connection ? 'External Connection' : 'Safe Connection'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDevice(null)}
                  className="rounded-xl p-4 border border-[#353b6c] bg-[#0c0b20] hover:bg-[#353b6c] transition-all duration-200"
                >
                  <Image src="/close.png" alt="Close" width={12} height={12} />
                </button>
              </div>

              {/* TOP SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">

                {/* DEVICE INFO */}
                <div className="rounded-2xl border border-[#353b6c] bg-[#121A2B] p-5">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Device Information
                  </h2>

                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Hostname</span>
                      <span className="text-white text-right">{selectedDevice.host}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">IP Address</span>
                      <span className="text-blue-300 text-right">{selectedDevice.ip}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">OS</span>
                      <span className="text-white text-right">Windows Server</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Domain</span>
                      <span className="text-white text-right">CORP.LOCAL</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Site</span>
                      <span className="text-white text-right">Head Office</span>
                    </div>
                  </div>
                </div>

                {/* USERS */}
                <div className="rounded-2xl border border-[#353b6c] bg-[#121A2B] p-5">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Active Users
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {selectedDevice.users.map((user, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 rounded-lg bg-[#1B2332] border border-[#353b6c] text-cyan-300 text-sm"
                      >
                        {user}
                      </div>
                    ))}
                  </div>
                </div>

                {/* THREAT SUMMARY */}
                <div className="rounded-2xl border border-[#353b6c] bg-[#121A2B] p-5">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Threat Summary
                  </h2>

                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Total Events</span>
                      <span className="text-white">{selectedDevice.events}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">External Connection</span>
                      <span className={selectedDevice.connection ? 'text-red-400' : 'text-green-400'}>
                        {selectedDevice.connection ? 'Detected' : 'Not Detected'}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Data Accessed</span>
                      <span className="text-orange-300">
                        {selectedDevice.risk >= 70 ? 'YES' : 'LOW SIGNAL'}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">MITRE Technique</span>
                      <span className="text-white">T1059</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Detection</span>
                      <span className="text-white">Heuristic</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIVITY + CONNECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">

                {/* RECENT ACTIVITIES */}
                <div className="rounded-2xl border border-[#353b6c] bg-[#121A2B] p-5">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Recent Activities
                  </h2>

                  <div className="flex flex-col gap-3">
                    <div className="p-4 rounded-xl bg-[#182132] border border-red-500/30">
                      <p className="text-red-300 font-medium">
                        Executed suspicious binary
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        08:12 AM • {selectedDevice.malware === '-' ? 'No malware detected' : selectedDevice.malware}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#182132] border border-orange-500/30">
                      <p className="text-orange-300 font-medium">
                        Accessed sensitive resource
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        08:13 AM • User activity requires review
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#182132] border border-cyan-500/30">
                      <p className="text-cyan-300 font-medium">
                        Network activity recorded
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        08:14 AM • {selectedDevice.connection ? 'Outbound connection detected' : 'Internal traffic only'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* NETWORK DESTINATION */}
                <div className="rounded-2xl border border-[#353b6c] bg-[#121A2B] p-5">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Network Destination
                  </h2>

                  <div className="flex flex-col gap-3">
                    <div className="p-4 rounded-xl bg-[#182132] border border-[#353b6c] flex justify-between items-center gap-4">
                      <div>
                        <p className="text-white">{selectedDevice.ip}</p>
                        <p className="text-gray-400 text-sm">Local Endpoint</p>
                      </div>

                      <div className={selectedDevice.connection ? 'text-red-400 text-xl' : 'text-green-400 text-xl'}>
                        →
                      </div>

                      <div className="text-right">
                        <p className={selectedDevice.connection ? 'text-red-300' : 'text-green-300'}>
                          {selectedDevice.connection ? '45.33.22.10' : 'Internal Network'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {selectedDevice.connection ? 'Suspicious Remote' : 'Safe Route'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#182132] border border-[#353b6c] flex justify-between items-center gap-4">
                      <div>
                        <p className="text-white">{selectedDevice.ip}</p>
                        <p className="text-gray-400 text-sm">DNS Query</p>
                      </div>

                      <div className="text-orange-300 text-xl">→</div>

                      <div className="text-right">
                        <p className="text-orange-300">8.8.8.8</p>
                        <p className="text-gray-400 text-sm">DNS Request</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* EVENT TIMELINE */}
              <div className="rounded-2xl border border-[#353b6c] bg-[#121A2B] p-5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Event Timeline
                </h2>

                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 mt-2" />
                    <div>
                      <p className="text-white">Suspicious execution detected</p>
                      <p className="text-gray-400 text-sm">2026-05-15 08:12:00</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-orange-400 mt-2" />
                    <div>
                      <p className="text-white">Unauthorized access reviewed</p>
                      <p className="text-gray-400 text-sm">2026-05-15 08:13:00</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 mt-2" />
                    <div>
                      <p className="text-white">
                        {selectedDevice.connection
                          ? 'External outbound connection'
                          : 'Internal network activity'}
                      </p>
                      <p className="text-gray-400 text-sm">2026-05-15 08:14:00</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </>
  )
}

export default DashboardDeviceUserActivityInformation