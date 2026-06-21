"use client"

import useSyslogLogs from "@/lib/data/dataSyslogLogs"
import Image from "next/image"
import { useMemo, useState } from "react"

type DestinationType = {
  id: number
  destinationIp: string
  domain: string
  country: string
  port: number | string
  protocol: string
  status: "Allowed" | "Warning" | "Blocked"
  totalLogs: number
  allow: number
  deny: number
  lastAccess: string
  topClient: string
  application: string
  category: string
  policy: string
}

type DestinationActivityType = {
  id: number
  time: string
  action: string
  client: string
  logType: string
  protocol: string
  message: string
  policy: string
}

type DashboardDestinationMonitoringProps = {
  pickDateTop: string
  pickMonthTop: string
  pickYearTop: string
  refreshSyslogKey: number
}

const DashboardDestinationMonitoring = ({
  pickDateTop,
  pickMonthTop,
  pickYearTop,
  refreshSyslogKey,
}: DashboardDestinationMonitoringProps) => {
  const [selectedInfo, setSelectedInfo] = useState<boolean>(false)
  const [selectedDestination, setSelectedDestination] = useState<DestinationType | null>(null)

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
      "-"
    )
  }

  const getCountry = (item: any) => {
    return (
      item.geo_dst ||
      item.extra_data?.geo_dst ||
      item.extra_data?.dst_country ||
      item.extra_data?.country ||
      "-"
    )
  }

  const getDestinationStatus = (
    allow: number,
    deny: number
  ): "Allowed" | "Warning" | "Blocked" => {
    const total = allow + deny

    if (total === 0) return "Allowed"

    const denyRate = deny / total

    if (denyRate >= 0.5) return "Blocked"
    if (denyRate >= 0.2) return "Warning"

    return "Allowed"
  }

  const destinations = useMemo<DestinationType[]>(() => {
    const grouped: Record<
      string,
      {
        destinationIp: string
        domain: string
        country: string
        port: number | string
        protocol: string
        totalLogs: number
        allow: number
        deny: number
        lastAccess: string
        lastTimestamp: number
        clients: Record<string, number>
        applications: Record<string, number>
        categories: Record<string, number>
        policies: Record<string, number>
      }
    > = {}

    syslogLogs.forEach((item) => {
      if (!item.dst_ip) return

      const destinationIp = item.dst_ip

      if (!grouped[destinationIp]) {
        grouped[destinationIp] = {
          destinationIp,
          domain: getDomain(item),
          country: getCountry(item),
          port: item.dst_port || "-",
          protocol: item.protocol || "-",
          totalLogs: 0,
          allow: 0,
          deny: 0,
          lastAccess: "-",
          lastTimestamp: 0,
          clients: {},
          applications: {},
          categories: {},
          policies: {},
        }
      }

      grouped[destinationIp].totalLogs += 1

      if (item.action === "Allow") {
        grouped[destinationIp].allow += 1
      }

      if (
        item.action === "Deny" ||
        item.action === "Block" ||
        item.action === "Drop"
      ) {
        grouped[destinationIp].deny += 1
      }

      const currentTimestamp = item.timestamp
        ? new Date(item.timestamp).getTime()
        : 0

      if (currentTimestamp > grouped[destinationIp].lastTimestamp) {
        grouped[destinationIp].lastTimestamp = currentTimestamp
        grouped[destinationIp].lastAccess = getTime(item.timestamp)
        grouped[destinationIp].domain = getDomain(item)
        grouped[destinationIp].country = getCountry(item)
        grouped[destinationIp].port = item.dst_port || "-"
        grouped[destinationIp].protocol = item.protocol || "-"
      }

      const client = item.src_ip || "-"
      grouped[destinationIp].clients[client] =
        (grouped[destinationIp].clients[client] || 0) + 1

      const app = item.app_name || "Unknown"
      grouped[destinationIp].applications[app] =
        (grouped[destinationIp].applications[app] || 0) + 1

      const category = item.cat_name || "Unknown"
      grouped[destinationIp].categories[category] =
        (grouped[destinationIp].categories[category] || 0) + 1

      const policy = item.policy || "Unknown Policy"
      grouped[destinationIp].policies[policy] =
        (grouped[destinationIp].policies[policy] || 0) + 1
    })

    return Object.values(grouped)
      .map((item, index) => {
        const topClient =
          Object.entries(item.clients).sort((a, b) => b[1] - a[1])[0]?.[0] ||
          "-"

        const application =
          Object.entries(item.applications).sort((a, b) => b[1] - a[1])[0]?.[0] ||
          "-"

        const category =
          Object.entries(item.categories).sort((a, b) => b[1] - a[1])[0]?.[0] ||
          "-"

        const policy =
          Object.entries(item.policies).sort((a, b) => b[1] - a[1])[0]?.[0] ||
          "-"

        return {
          id: index + 1,
          destinationIp: item.destinationIp,
          domain: item.domain,
          country: item.country,
          port: item.port,
          protocol: item.protocol,
          status: getDestinationStatus(item.allow, item.deny),
          totalLogs: item.totalLogs,
          allow: item.allow,
          deny: item.deny,
          lastAccess: item.lastAccess,
          topClient,
          application,
          category,
          policy,
        }
      })
      .sort((a, b) => b.totalLogs - a.totalLogs)
  }, [syslogLogs])

  const destinationActivities = useMemo<DestinationActivityType[]>(() => {
    if (!selectedDestination) return []

    return syslogLogs
      .filter((item) => item.dst_ip === selectedDestination.destinationIp)
      .slice(0, 30)
      .map((item) => ({
        id: item.id,
        time: getTime(item.timestamp),
        action: item.action || "Unknown",
        client: item.src_ip || "-",
        logType: item.log_type || "-",
        protocol: `${item.protocol || "-"}${item.dst_port ? `/${item.dst_port}` : ""}`,
        message: item.message || "-",
        policy: item.policy || "-",
      }))
  }, [selectedDestination, syslogLogs])

  const totalDestinations = destinations.length
  const allowedDestinations = destinations.filter((item) => item.status === "Allowed").length
  const warningDestinations = destinations.filter((item) => item.status === "Warning").length
  const blockedDestinations = destinations.filter((item) => item.status === "Blocked").length

  const getStatusStyle = (status: string) => {
    if (status === "Allowed") {
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
        <p className="text-gray-300 font-bold">Loading destination data...</p>
        <p className="text-gray-500 text-sm mt-1">
          Sedang mengambil data destination dari database.
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
        <div className="relative overflow-hidden rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#2d1a0b] via-[#111c45] to-[#0c0b20] p-6 mb-5">
          <div className="absolute -top-20 -right-20 w-[230px] h-[230px] rounded-full bg-orange-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[230px] h-[230px] rounded-full bg-yellow-500/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-sm text-orange-300 font-semibold mb-2">
                Destination Inventory & Access
              </p>

              <h2 className="font-bold text-[26px] md:text-[30px]">
                Destination Monitoring
              </h2>

              <p className="text-gray-400 mt-2 max-w-2xl">
                Menampilkan daftar destination IP, domain, negara tujuan, port,
                aplikasi, dan policy. Klik salah satu destination untuk melihat detail aksesnya.
                <span className="block mt-1 text-orange-300 font-semibold">
                  Data ditampilkan untuk tanggal {selectedFullDate}
                </span>
              </p>
            </div>

            <button
              onClick={() => setSelectedInfo(true)}
              className="flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-[#353b6c] bg-[#0c0b20]/70 hover:bg-[#353b6c] transition-all duration-200"
            >
              <Image src="/info.png" alt="Info" width={15} height={15} />
              <p className="font-bold">Info Destination</p>
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-5">
            <p className="text-orange-300 text-sm font-bold">Total Destination</p>
            <p className="font-bold text-[30px] mt-1">{totalDestinations}</p>
            <p className="text-xs text-gray-500">unique destination</p>
          </div>

          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
            <p className="text-green-400 text-sm font-bold">Allowed</p>
            <p className="font-bold text-[30px] mt-1">{allowedDestinations}</p>
            <p className="text-xs text-gray-500">normal destination</p>
          </div>

          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
            <p className="text-yellow-300 text-sm font-bold">Warning</p>
            <p className="font-bold text-[30px] mt-1">{warningDestinations}</p>
            <p className="text-xs text-gray-500">needs review</p>
          </div>

          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <p className="text-red-400 text-sm font-bold">Blocked</p>
            <p className="font-bold text-[30px] mt-1">{blockedDestinations}</p>
            <p className="text-xs text-gray-500">denied destination</p>
          </div>
        </div>

        {/* MAIN DESTINATION LIST + DETAIL */}
        <div className="grid grid-cols-1 2xl:grid-cols-[1.2fr_1fr] gap-5">

          {/* DESTINATION LIST */}
          <div className="rounded-2xl border h-[900px] border-[#353b6c] bg-[#08071a] p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <p className="font-bold text-[20px]">Destination List</p>
                <p className="text-sm text-gray-500 mt-1">
                  Daftar IP tujuan, domain, negara, port, dan aplikasi.
                </p>
              </div>

              <div className="px-3 py-2 rounded-lg border border-[#353b6c] bg-[#14122d] text-sm text-gray-400">
                {destinations.length} destinations
              </div>
            </div>

            <div className="space-y-3 h-[90%] overflow-auto scrollbar-hide pr-1">
              {destinations.length === 0 ? (
                <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20] px-4 py-6 text-gray-500 text-sm">
                  Tidak ada destination pada tanggal ini.
                </div>
              ) : (
                destinations.map((item) => {
                  const style = getStatusStyle(item.status)
                  const active = selectedDestination?.destinationIp === item.destinationIp

                  return (
                    <button
                      key={item.destinationIp}
                      onClick={() => setSelectedDestination(item)}
                      className={`
                        w-full text-left rounded-2xl border p-4
                        bg-[#0c0b20]
                        transition-all duration-200
                        ${
                          active
                            ? "border-orange-500/60 shadow-lg shadow-orange-500/10"
                            : `border-[#353b6c] ${style.card}`
                        }
                      `}
                    >
                      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0">
                          <div className="w-[46px] h-[46px] rounded-xl border border-orange-500/30 bg-orange-500/10 flex items-center justify-center shrink-0">
                            <div className={`w-3 h-3 rounded-full ${style.dot}`} />
                          </div>

                          <div className="min-w-0">
                            <p className="font-bold text-orange-300 text-[16px]">
                              {item.destinationIp}
                            </p>

                            <p className="text-sm text-gray-400 mt-1 truncate">
                              {item.domain}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              <span className="px-3 py-1 rounded-lg border border-[#353b6c] bg-[#14122d] text-xs text-gray-400">
                                {item.country}
                              </span>

                              <span className="px-3 py-1 rounded-lg border border-[#353b6c] bg-[#14122d] text-xs text-gray-400">
                                {item.protocol}/{item.port}
                              </span>

                              <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${style.badge}`}>
                                {item.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 xl:w-[300px]">
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

          {/* DESTINATION DETAIL */}
          <div className="rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] to-[#0c0b20] p-5">
            {!selectedDestination ? (
              <div className="h-full min-h-[540px] flex flex-col items-center justify-center text-center">
                <div className="w-[72px] h-[72px] rounded-2xl border border-orange-500/30 bg-orange-500/10 flex items-center justify-center mb-5">
                  <div className="w-4 h-4 rounded-full bg-orange-400 shadow-lg shadow-orange-400/40" />
                </div>

                <p className="font-bold text-[22px]">
                  Pilih salah satu destination
                </p>

                <p className="text-gray-500 mt-2 max-w-sm">
                  Klik destination pada daftar sebelah kiri untuk melihat detail IP tujuan,
                  domain, port, client yang paling sering mengakses, dan policy.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="min-w-0">
                    <p className="text-sm text-orange-300 font-semibold">
                      Destination Detail
                    </p>

                    <p className="font-bold text-[26px] mt-1">
                      {selectedDestination.destinationIp}
                    </p>

                    <p className="text-gray-500 mt-1 truncate">
                      {selectedDestination.domain}
                    </p>
                  </div>

                  <span className={`px-3 py-2 rounded-lg border text-xs font-bold ${getStatusStyle(selectedDestination.status).badge}`}>
                    {selectedDestination.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/80 p-4">
                    <p className="text-xs text-gray-500">Country</p>
                    <p className="font-bold mt-1">{selectedDestination.country}</p>
                  </div>

                  <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/80 p-4">
                    <p className="text-xs text-gray-500">Last Access</p>
                    <p className="font-bold mt-1">{selectedDestination.lastAccess}</p>
                  </div>

                  <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/80 p-4">
                    <p className="text-xs text-gray-500">Protocol / Port</p>
                    <p className="font-bold mt-1">
                      {selectedDestination.protocol}/{selectedDestination.port}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/80 p-4">
                    <p className="text-xs text-gray-500">Top Client</p>
                    <p className="font-bold mt-1 truncate">
                      {selectedDestination.topClient}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                    <p className="text-xs text-blue-300">Application</p>
                    <p className="font-bold mt-1 truncate">
                      {selectedDestination.application}
                    </p>
                  </div>

                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-4">
                    <p className="text-xs text-purple-300">Category</p>
                    <p className="font-bold mt-1 truncate">
                      {selectedDestination.category}
                    </p>
                  </div>

                  <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                    <p className="text-xs text-green-400">Allowed</p>
                    <p className="font-bold text-[24px] mt-1">
                      {selectedDestination.allow}
                    </p>
                  </div>

                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                    <p className="text-xs text-red-400">Denied</p>
                    <p className="font-bold text-[24px] mt-1">
                      {selectedDestination.deny}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-4 mb-5">
                  <p className="text-xs text-orange-300">Main Policy</p>
                  <p className="font-bold mt-1 truncate">
                    {selectedDestination.policy}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-[18px]">
                        Recent Destination Activity
                      </p>

                      <p className="text-gray-500 text-sm">
                        Aktivitas terbaru menuju destination terpilih.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-auto scrollbar-hide pr-1">
                    {destinationActivities.length === 0 ? (
                      <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/90 p-4 text-sm text-gray-500">
                        Tidak ada aktivitas menuju destination ini.
                      </div>
                    ) : (
                      destinationActivities.map((item) => (
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

                          <p className="text-orange-300 font-semibold truncate">
                            Client: {item.client}
                          </p>

                          <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-400">
                            <p>Protocol: {item.protocol}</p>
                            <p>Message: {item.message}</p>
                            <p className="col-span-2 truncate">
                              Policy: {item.policy}
                            </p>
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
                Info Destination Monitoring
              </p>

              <p className="text-gray-500 mt-1 mb-5">
                Fitur ini menampilkan daftar destination berdasarkan IP tujuan,
                domain, negara, port, aplikasi, dan policy.
              </p>

              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  <b className="text-orange-300">Destination List</b> menampilkan daftar IP/domain tujuan dari traffic jaringan.
                </p>

                <p>
                  <b className="text-orange-300">Destination Detail</b> muncul setelah salah satu destination diklik.
                </p>

                <p>
                  <b className="text-orange-300">Top Client</b> menunjukkan client yang paling sering mengakses destination tersebut.
                </p>

                <p>
                  <b className="text-orange-300">Recent Destination Activity</b> menampilkan aktivitas terakhir menuju destination yang dipilih.
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

export default DashboardDestinationMonitoring