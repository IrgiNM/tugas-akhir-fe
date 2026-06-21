"use client"

import useSyslogLogs from "@/lib/data/dataSyslogLogs"
import Image from "next/image"
import { useMemo, useState } from "react"

type ClientType = {
  id: number
  ip: string
  hostname: string
  zone: string
  status: "Active" | "Warning" | "Blocked"
  totalLogs: number
  allow: number
  deny: number
  lastSeen: string
  topDestination: string
  topApplication: string
  totalTraffic: string
}

type ClientActivityType = {
  id: number
  time: string
  action: string
  logType: string
  destination: string
  protocol: string
  application: string
  policy: string
}

type DashboardClientMonitoringProps = {
  pickDateTop: string
  pickMonthTop: string
  pickYearTop: string
  refreshSyslogKey: number
}

const DashboardClientMonitoring = ({
  pickDateTop,
  pickMonthTop,
  pickYearTop,
  refreshSyslogKey,
}: DashboardClientMonitoringProps) => {
  const [selectedInfo, setSelectedInfo] = useState<boolean>(false)
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null)

  const selectedFullDate = `${pickYearTop}-${pickMonthTop}-${pickDateTop}`

  const {
    syslogLogs,
    isLoadingSyslog,
    errorSyslog,
  } = useSyslogLogs(
    {
      date: selectedFullDate,
    },
    refreshSyslogKey
  )

  const getTime = (timestamp: string | null) => {
    if (!timestamp) return "-"

    return new Date(timestamp).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getDomain = (item: any) => {
    return (
      item.dstname ||
      item.extra_data?.host ||
      item.extra_data?.domain ||
      item.extra_data?.hostname ||
      item.extra_data?.dstname ||
      item.dst_ip ||
      "-"
    )
  }

  const getHostname = (ip: string) => {
    if (ip.startsWith("10.0.140.")) return `CLIENT-MHS-${ip.split(".").pop()}`
    if (ip.startsWith("10.0.170.")) return `CLIENT-MHS-${ip.split(".").pop()}`
    if (ip.startsWith("10.0.143.")) return `STAFF-DEVICE-${ip.split(".").pop()}`
    if (ip.startsWith("10.0.40.")) return `SERVERFARM-${ip.split(".").pop()}`
    if (ip.startsWith("10.")) return `CLIENT-${ip.split(".").pop()}`

    return "EXTERNAL-CLIENT"
  }

  const getZone = (item: any) => {
    if (item.from_zone) return item.from_zone

    const ip = item.src_ip || ""

    if (ip.startsWith("10.0.140.")) return "VWMahasiswa"
    if (ip.startsWith("10.0.170.")) return "VWMahasiswa"
    if (ip.startsWith("10.0.143.")) return "VWStaff"
    if (ip.startsWith("10.0.40.")) return "ServerFarm-New"
    if (ip.startsWith("10.")) return "Internal"

    return "External"
  }

  const getByteNumber = (item: any) => {
    const byteValue =
      item.extra_data?.bytes ||
      item.extra_data?.sent_bytes ||
      item.extra_data?.rcvd_bytes ||
      item.extra_data?.total_bytes ||
      item.extra_data?.packet_len ||
      0

    const numberByte = Number(byteValue)

    if (!numberByte || Number.isNaN(numberByte)) return 0

    return numberByte
  }

  const formatBandwidth = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
    }

    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    }

    if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }

    return `${bytes} B`
  }

  const getClientStatus = (allow: number, deny: number): "Active" | "Warning" | "Blocked" => {
    const total = allow + deny

    if (total === 0) return "Active"

    const denyRate = deny / total

    if (denyRate >= 0.4) return "Blocked"
    if (denyRate >= 0.2) return "Warning"

    return "Active"
  }

  const clients = useMemo<ClientType[]>(() => {
    const grouped: Record<
      string,
      {
        ip: string
        zone: string
        totalLogs: number
        allow: number
        deny: number
        lastSeen: string
        lastTimestamp: number
        totalBytes: number
        destinations: Record<string, number>
        applications: Record<string, number>
      }
    > = {}

    syslogLogs.forEach((item) => {
      if (!item.src_ip) return

      const ip = item.src_ip

      if (!grouped[ip]) {
        grouped[ip] = {
          ip,
          zone: getZone(item),
          totalLogs: 0,
          allow: 0,
          deny: 0,
          lastSeen: "-",
          lastTimestamp: 0,
          totalBytes: 0,
          destinations: {},
          applications: {},
        }
      }

      grouped[ip].totalLogs += 1

      if (item.action === "Allow") {
        grouped[ip].allow += 1
      }

      if (
        item.action === "Deny" ||
        item.action === "Block" ||
        item.action === "Drop"
      ) {
        grouped[ip].deny += 1
      }

      const currentTimestamp = item.timestamp
        ? new Date(item.timestamp).getTime()
        : 0

      if (currentTimestamp > grouped[ip].lastTimestamp) {
        grouped[ip].lastTimestamp = currentTimestamp
        grouped[ip].lastSeen = getTime(item.timestamp)
      }

      grouped[ip].totalBytes += getByteNumber(item)

      const destination = getDomain(item)
      grouped[ip].destinations[destination] =
        (grouped[ip].destinations[destination] || 0) + 1

      const application = item.app_name || "Unknown"
      grouped[ip].applications[application] =
        (grouped[ip].applications[application] || 0) + 1
    })

    return Object.values(grouped)
      .map((item, index) => {
        const topDestination =
          Object.entries(item.destinations).sort((a, b) => b[1] - a[1])[0]?.[0] ||
          "-"

        const topApplication =
          Object.entries(item.applications).sort((a, b) => b[1] - a[1])[0]?.[0] ||
          "-"

        return {
          id: index + 1,
          ip: item.ip,
          hostname: getHostname(item.ip),
          zone: item.zone,
          status: getClientStatus(item.allow, item.deny),
          totalLogs: item.totalLogs,
          allow: item.allow,
          deny: item.deny,
          lastSeen: item.lastSeen,
          topDestination,
          topApplication,
          totalTraffic: formatBandwidth(item.totalBytes),
        }
      })
      .sort((a, b) => b.totalLogs - a.totalLogs)
  }, [syslogLogs])

  const clientActivities = useMemo<ClientActivityType[]>(() => {
    if (!selectedClient) return []

    return syslogLogs
      .filter((item) => item.src_ip === selectedClient.ip)
      .slice(0, 30)
      .map((item) => ({
        id: item.id,
        time: getTime(item.timestamp),
        action: item.action || "Unknown",
        logType: item.log_type || "-",
        destination: getDomain(item),
        protocol: `${item.protocol || "-"}${item.dst_port ? `/${item.dst_port}` : ""}`,
        application: item.app_name || "Unknown",
        policy: item.policy || "-",
      }))
  }, [selectedClient, syslogLogs])

  const totalClients = clients.length
  const activeClients = clients.filter((item) => item.status === "Active").length
  const warningClients = clients.filter((item) => item.status === "Warning").length
  const blockedClients = clients.filter((item) => item.status === "Blocked").length

  const getStatusStyle = (status: string) => {
    if (status === "Active") {
      return {
        badge: "border-green-500/30 bg-green-500/10 text-green-400",
        dot: "bg-green-400",
        card: "hover:border-green-500/40",
      }
    }

    if (status === "Warning") {
      return {
        badge: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
        dot: "bg-yellow-400",
        card: "hover:border-yellow-500/40",
      }
    }

    return {
      badge: "border-red-500/30 bg-red-500/10 text-red-400",
      dot: "bg-red-500",
      card: "hover:border-red-500/40",
    }
  }

  const getActionStyle = (action: string) => {
    if (action === "Allow") {
      return "border-green-500/30 bg-green-500/10 text-green-400"
    }

    return "border-red-500/30 bg-red-500/10 text-red-400"
  }

  if (isLoadingSyslog) {
    return (
      <div className="w-full rounded-2xl border border-[#353b6c] bg-[#0b0c1c] p-8">
        <p className="text-gray-300 font-bold">Loading client data...</p>
        <p className="text-gray-500 text-sm mt-1">
          Sedang mengambil data client dari database.
        </p>
      </div>
    )
  }

  if (errorSyslog) {
    return (
      <div className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 p-8">
        <p className="text-red-400 font-bold">Gagal mengambil data</p>
        <p className="text-gray-300 text-sm mt-1">{errorSyslog}</p>
      </div>
    )
  }

  return (
    <>
      <div className="w-full rounded-2xl border border-[#353b6c] bg-[#0b0c1c] p-5 md:p-6">

        {/* HEADER */}
        <div className="relative overflow-hidden rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#0d2b1f] via-[#111c45] to-[#0c0b20] p-6 mb-5">
          <div className="absolute -top-20 -right-20 w-[230px] h-[230px] rounded-full bg-green-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[230px] h-[230px] rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-sm text-green-300 font-semibold mb-2">
                Client Inventory & Activity
              </p>

              <h2 className="font-bold text-[26px] md:text-[30px]">
                Client Monitoring
              </h2>

              <p className="text-gray-400 mt-2 max-w-2xl">
                Menampilkan daftar client atau source IP yang tercatat pada syslog.
                Klik salah satu client untuk melihat detail aktivitasnya.
                <span className="block mt-1 text-green-300 font-semibold">
                  Data ditampilkan untuk tanggal {selectedFullDate}
                </span>
              </p>
            </div>

            <button
              onClick={() => setSelectedInfo(true)}
              className="flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-[#353b6c] bg-[#0c0b20]/70 hover:bg-[#353b6c] transition-all duration-200"
            >
              <Image src="/info.png" alt="Info" width={15} height={15} />
              <p className="font-bold">Info Client</p>
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
            <p className="text-green-400 text-sm font-bold">Total Clients</p>
            <p className="font-bold text-[30px] mt-1">{totalClients}</p>
            <p className="text-xs text-gray-500">unique source IP</p>
          </div>

          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
            <p className="text-blue-300 text-sm font-bold">Active Clients</p>
            <p className="font-bold text-[30px] mt-1">{activeClients}</p>
            <p className="text-xs text-gray-500">normal activity</p>
          </div>

          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
            <p className="text-yellow-300 text-sm font-bold">Warning Clients</p>
            <p className="font-bold text-[30px] mt-1">{warningClients}</p>
            <p className="text-xs text-gray-500">needs attention</p>
          </div>

          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <p className="text-red-400 text-sm font-bold">Blocked Clients</p>
            <p className="font-bold text-[30px] mt-1">{blockedClients}</p>
            <p className="text-xs text-gray-500">many denied logs</p>
          </div>
        </div>

        {/* MAIN CLIENT LIST + DETAIL */}
        <div className="grid grid-cols-1 2xl:grid-cols-[1.2fr_1fr] gap-5">

          {/* CLIENT LIST */}
          <div className="rounded-2xl h-[900px] border border-[#353b6c] bg-[#08071a] p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <p className="font-bold text-[20px]">Client List</p>
                <p className="text-sm text-gray-500 mt-1">
                  Daftar source IP yang muncul pada log jaringan.
                </p>
              </div>

              <div className="px-3 py-2 rounded-lg border border-[#353b6c] bg-[#14122d] text-sm text-gray-400">
                {clients.length} clients
              </div>
            </div>

            <div className="space-y-3 h-[90%] overflow-auto pr-1">
              {clients.length === 0 ? (
                <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20] px-4 py-6 text-gray-500 text-sm">
                  Tidak ada client pada tanggal ini.
                </div>
              ) : (
                clients.map((item) => {
                  const style = getStatusStyle(item.status)
                  const active = selectedClient?.ip === item.ip

                  return (
                    <button
                      key={item.ip}
                      onClick={() => setSelectedClient(item)}
                      className={`
                        w-full text-left rounded-2xl border p-4
                        bg-[#0c0b20]
                        transition-all duration-200
                        ${
                          active
                            ? "border-green-500/60 shadow-lg shadow-green-500/10"
                            : `border-[#353b6c] ${style.card}`
                        }
                      `}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        <div className="flex items-start gap-4 min-w-0">
                          <div className="w-[46px] h-[46px] rounded-xl border border-green-500/30 bg-green-500/10 flex items-center justify-center shrink-0">
                            <div className={`w-3 h-3 rounded-full ${style.dot}`} />
                          </div>

                          <div className="min-w-0">
                            <p className="font-bold text-green-300 text-[16px]">
                              {item.ip}
                            </p>

                            <p className="text-sm text-gray-400 mt-1 truncate">
                              {item.hostname}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              <span className="px-3 py-1 rounded-lg border border-[#353b6c] bg-[#14122d] text-xs text-gray-400">
                                {item.zone}
                              </span>

                              <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${style.badge}`}>
                                {item.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:w-[300px]">
                          <div className="rounded-xl border border-[#353b6c] bg-[#14122d] p-3">
                            <p className="text-xs text-gray-500">Logs</p>
                            <p className="font-bold">{item.totalLogs}</p>
                          </div>

                          <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3">
                            <p className="text-xs text-green-400">Allow</p>
                            <p className="font-bold">{item.allow}</p>
                          </div>

                          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                            <p className="text-xs text-red-400">Deny</p>
                            <p className="font-bold">{item.deny}</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* CLIENT DETAIL */}
          <div className="rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] to-[#0c0b20] p-5">
            {!selectedClient ? (
              <div className="h-full min-h-[520px] flex flex-col items-center justify-center text-center">
                <div className="w-[72px] h-[72px] rounded-2xl border border-green-500/30 bg-green-500/10 flex items-center justify-center mb-5">
                  <div className="w-4 h-4 rounded-full bg-green-400 shadow-lg shadow-green-400/40" />
                </div>

                <p className="font-bold text-[22px]">
                  Pilih salah satu client
                </p>

                <p className="text-gray-500 mt-2 max-w-sm">
                  Klik client pada daftar sebelah kiri untuk menampilkan detail aktivitas,
                  destination, aplikasi, dan policy yang digunakan.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-sm text-green-300 font-semibold">
                      Client Detail
                    </p>

                    <p className="font-bold text-[26px] mt-1">
                      {selectedClient.ip}
                    </p>

                    <p className="text-gray-500 mt-1">
                      {selectedClient.hostname}
                    </p>
                  </div>

                  <span className={`px-3 py-2 rounded-lg border text-xs font-bold ${getStatusStyle(selectedClient.status).badge}`}>
                    {selectedClient.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/80 p-4">
                    <p className="text-xs text-gray-500">Zone</p>
                    <p className="font-bold mt-1">{selectedClient.zone}</p>
                  </div>

                  <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/80 p-4">
                    <p className="text-xs text-gray-500">Last Seen</p>
                    <p className="font-bold mt-1">{selectedClient.lastSeen}</p>
                  </div>

                  <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/80 p-4">
                    <p className="text-xs text-gray-500">Top Destination</p>
                    <p className="font-bold mt-1 truncate">{selectedClient.topDestination}</p>
                  </div>

                  <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/80 p-4">
                    <p className="text-xs text-gray-500">Top Application</p>
                    <p className="font-bold mt-1 truncate">{selectedClient.topApplication}</p>
                  </div>

                  <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                    <p className="text-xs text-green-400">Allowed</p>
                    <p className="font-bold text-[24px] mt-1">{selectedClient.allow}</p>
                  </div>

                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                    <p className="text-xs text-red-400">Denied</p>
                    <p className="font-bold text-[24px] mt-1">{selectedClient.deny}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 mb-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-blue-300">Total Traffic Usage</p>
                      <p className="font-bold text-[24px] mt-1">
                        {selectedClient.totalTraffic}
                      </p>
                    </div>

                    <div className="w-3 h-3 rounded-full bg-blue-400 shadow-lg shadow-blue-400/40" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-[18px]">
                        Recent Client Activity
                      </p>
                      <p className="text-gray-500 text-sm">
                        Aktivitas terbaru dari client terpilih.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-auto scrollbar-hide pr-1">
                    {clientActivities.length === 0 ? (
                      <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/90 p-4 text-sm text-gray-500">
                        Tidak ada aktivitas untuk client ini.
                      </div>
                    ) : (
                      clientActivities.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/90 p-4"
                        >
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <div>
                              <p className="font-bold text-sm">{item.time}</p>
                              <p className="text-xs text-gray-500">
                                {item.logType}
                              </p>
                            </div>

                            <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${getActionStyle(item.action)}`}>
                              {item.action}
                            </span>
                          </div>

                          <p className="text-green-300 font-semibold truncate">
                            {item.destination}
                          </p>

                          <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-400">
                            <p>Protocol: {item.protocol}</p>
                            <p>App: {item.application}</p>
                            <p className="col-span-2 truncate">Policy: {item.policy}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* INFO MODAL */}
      {selectedInfo && (
        <>
          <div className="fixed inset-0 z-70 bg-[#0c0b20]/90 backdrop-blur-sm" />

          <div className="fixed inset-0 z-80 flex justify-center items-start gap-3 pt-[130px] px-5">
            <div className="w-full max-w-[720px] rounded-2xl border border-[#353b6c] bg-[#0c0b20] p-7 shadow-2xl">
              <p className="font-bold text-[24px]">
                Info Client Monitoring
              </p>

              <p className="text-gray-500 mt-1 mb-5">
                Fitur ini menampilkan daftar client berdasarkan source IP yang muncul di log.
              </p>

              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  <b className="text-green-300">Client List</b> menampilkan daftar IP client, hostname, zone, status, allow, dan deny.
                </p>
                <p>
                  <b className="text-green-300">Client Detail</b> tampil setelah client diklik.
                </p>
                <p>
                  <b className="text-green-300">Recent Client Activity</b> menampilkan aktivitas terakhir dari client yang dipilih.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedInfo(false)}
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

export default DashboardClientMonitoring