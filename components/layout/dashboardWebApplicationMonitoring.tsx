"use client"

import useSyslogLogs from "@/lib/data/dataSyslogLogs"
import Image from "next/image"
import { useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type DashboardWebApplicationMonitoringProps = {
  pickDateTop: string
  pickMonthTop: string
  pickYearTop: string
  refreshSyslogKey: number
}

const DashboardWebApplicationMonitoring = ({
  pickDateTop,
  pickMonthTop,
  pickYearTop,
  refreshSyslogKey,
}: DashboardWebApplicationMonitoringProps) => {
  const [selectedInfo, setSelectedInfo] = useState<boolean>(false)

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

  const webProxyLogs = useMemo(() => {
    return syslogLogs.filter(
      (item) =>
        item.log_type === "http-proxy" ||
        item.log_type === "https-proxy"
    )
  }, [syslogLogs])

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

  const getMethod = (item: any) => {
    return (
      item.extra_data?.method ||
      item.extra_data?.http_method ||
      item.extra_data?.request_method ||
      "-"
    )
  }

  const getTls = (item: any) => {
    return (
      item.extra_data?.tls ||
      item.extra_data?.tls_version ||
      item.extra_data?.ssl_version ||
      (item.log_type === "https-proxy" ? "HTTPS" : "HTTP")
    )
  }

  const webSummary = useMemo(() => {
    const uniqueDomains = new Set(
      webProxyLogs.map((item) => getDomain(item)).filter((item) => item !== "-")
    )

    const detectedApps = new Set(
      webProxyLogs
        .map((item) => item.app_name)
        .filter((item) => item && item !== "-")
    )

    const blockedRequests = webProxyLogs.filter(
      (item) =>
        item.action === "Deny" ||
        item.action === "Block" ||
        item.action === "Drop"
    ).length

    return {
      webRequests: webProxyLogs.length,
      uniqueDomains: uniqueDomains.size,
      detectedApps: detectedApps.size,
      blockedRequests,
    }
  }, [webProxyLogs])

  const liveRequests = useMemo(() => {
    return webProxyLogs.slice(0, 8).map((item) => ({
      time: getTime(item.timestamp),
      type: item.log_type === "https-proxy" ? "HTTPS" : "HTTP",
      action: item.action || "Unknown",
      client: item.src_ip || "-",
      domain: getDomain(item),
      app: item.app_name || "-",
      category: item.cat_name || "-",
    }))
  }, [webProxyLogs])

  const domainInsight = useMemo(() => {
    const grouped: Record<string, { request: number; deny: number; allow: number }> = {}

    webProxyLogs.forEach((item) => {
      const domain = getDomain(item)

      if (domain === "-") return

      if (!grouped[domain]) {
        grouped[domain] = {
          request: 0,
          deny: 0,
          allow: 0,
        }
      }

      grouped[domain].request += 1

      if (item.action === "Allow") {
        grouped[domain].allow += 1
      }

      if (
        item.action === "Deny" ||
        item.action === "Block" ||
        item.action === "Drop"
      ) {
        grouped[domain].deny += 1
      }
    })

    return Object.entries(grouped)
      .map(([domain, value]) => ({
        domain,
        request: value.request,
        status: value.deny > value.allow ? "Deny" : "Allow",
      }))
      .sort((a, b) => b.request - a.request)
      .slice(0, 5)
  }, [webProxyLogs])

  const applicationInsight = useMemo(() => {
    const grouped: Record<string, number> = {}

    webProxyLogs.forEach((item) => {
      const app = item.app_name || "Unknown"
      grouped[app] = (grouped[app] || 0) + 1
    })

    return Object.entries(grouped)
      .map(([app, total]) => ({
        app,
        total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  }, [webProxyLogs])

  const categoryShare = useMemo(() => {
    const grouped: Record<string, number> = {}

    webProxyLogs.forEach((item) => {
      const category = item.cat_name || "Unknown"
      grouped[category] = (grouped[category] || 0) + 1
    })

    return Object.entries(grouped)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [webProxyLogs])

  const blockedWeb = useMemo(() => {
    const blockedLogs = webProxyLogs.filter(
      (item) =>
        item.action === "Deny" ||
        item.action === "Block" ||
        item.action === "Drop"
    )

    const grouped: Record<
      string,
      {
        domain: string
        reason: string
        client: string
        count: number
      }
    > = {}

    blockedLogs.forEach((item) => {
      const domain = getDomain(item)
      const key = `${domain}-${item.src_ip || "-"}`

      if (!grouped[key]) {
        grouped[key] = {
          domain,
          reason: item.message || item.policy || "Denied web request",
          client: item.src_ip || "-",
          count: 0,
        }
      }

      grouped[key].count += 1
    })

    return Object.values(grouped)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [webProxyLogs])

  const appCards = useMemo(() => {
    const mostAccessedDomain = domainInsight[0]
    const mostUsedApp = applicationInsight[0]
    const topCategory = categoryShare[0]

    return [
      {
        title: "Most Accessed Domain",
        value: mostAccessedDomain?.domain || "-",
        desc: `${mostAccessedDomain?.request || 0} requests`,
        color: "purple",
      },
      {
        title: "Most Used App",
        value: mostUsedApp?.app || "-",
        desc: `${mostUsedApp?.total || 0} detected logs`,
        color: "blue",
      },
      {
        title: "Top Category",
        value: topCategory?.name || "-",
        desc: `${topCategory?.value || 0} requests`,
        color: "cyan",
      },
      {
        title: "Blocked Domain",
        value: String(webSummary.blockedRequests),
        desc: "denied web requests",
        color: "red",
      },
    ]
  }, [domainInsight, applicationInsight, categoryShare, webSummary])

  const webLogs = useMemo(() => {
    return webProxyLogs.map((item) => ({
      id: item.id,
      time: getTime(item.timestamp),
      logType: item.log_type || "-",
      action: item.action || "Unknown",
      method: getMethod(item),
      client: item.src_ip || "-",
      destination: item.dst_ip || "-",
      domain: getDomain(item),
      app: item.app_name || "-",
      category: item.cat_name || "-",
      tls: getTls(item),
      policy: item.policy || "-",
    }))
  }, [webProxyLogs])

  const getActionStyle = (action: string) => {
    if (action === "Allow") {
      return {
        badge: "border-green-500/30 bg-green-500/10 text-green-400",
        dot: "bg-green-400",
        row: "hover:border-green-500/30",
      }
    }

    return {
      badge: "border-red-500/30 bg-red-500/10 text-red-400",
      dot: "bg-red-500",
      row: "hover:border-red-500/30",
    }
  }

  const getCardStyle = (color: string) => {
    if (color === "red") {
      return "border-red-500/30 bg-red-500/10 text-red-400"
    }

    if (color === "blue") {
      return "border-blue-500/30 bg-blue-500/10 text-blue-300"
    }

    if (color === "cyan") {
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
    }

    return "border-purple-500/30 bg-purple-500/10 text-purple-300"
  }

  if (isLoadingSyslog) {
    return (
      <div className="w-full rounded-2xl border border-[#353b6c] bg-[#0b0c1c] p-8">
        <p className="text-gray-300 font-bold">Loading web application data...</p>
        <p className="text-gray-500 text-sm mt-1">
          Sedang mengambil data HTTP/HTTPS proxy dari database.
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
        <div className="relative overflow-hidden rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#21113f] via-[#111c45] to-[#0c0b20] p-6 mb-5">
          <div className="absolute -top-20 -right-20 w-[240px] h-[240px] rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[240px] h-[240px] rounded-full bg-pink-500/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-sm text-purple-300 font-semibold mb-2">
                Web Proxy Command Center
              </p>

              <h2 className="font-bold text-[26px] md:text-[30px]">
                Web & Application Monitoring
              </h2>

              <p className="text-gray-400 mt-2 max-w-2xl">
                Memantau aktivitas website, domain, aplikasi, kategori web,
                request HTTP/HTTPS, serta akses web yang diblokir oleh proxy policy.
                <span className="block mt-1 text-purple-300 font-semibold">
                  Data ditampilkan untuk tanggal {selectedFullDate}
                </span>
              </p>
            </div>

            <button
              onClick={() => setSelectedInfo(true)}
              className="flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-[#353b6c] bg-[#0c0b20]/70 hover:bg-[#353b6c] transition-all duration-200"
            >
              <Image src="/info.png" alt="Info" width={15} height={15} />
              <p className="font-bold">Info Web App</p>
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-5">
            <p className="text-purple-300 text-sm font-bold">Web Requests</p>
            <p className="font-bold text-[30px] mt-1">
              {webSummary.webRequests.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">HTTP / HTTPS</p>
          </div>

          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
            <p className="text-blue-300 text-sm font-bold">Unique Domains</p>
            <p className="font-bold text-[30px] mt-1">
              {webSummary.uniqueDomains}
            </p>
            <p className="text-xs text-gray-500">destination domains</p>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
            <p className="text-cyan-300 text-sm font-bold">Detected Apps</p>
            <p className="font-bold text-[30px] mt-1">
              {webSummary.detectedApps}
            </p>
            <p className="text-xs text-gray-500">application names</p>
          </div>

          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <p className="text-red-400 text-sm font-bold">Blocked Web</p>
            <p className="font-bold text-[30px] mt-1">
              {webSummary.blockedRequests}
            </p>
            <p className="text-xs text-gray-500">denied requests</p>
          </div>
        </div>

        {/* COMMAND CENTER LAYOUT */}
        <div className="grid grid-cols-1 2xl:grid-cols-[1.1fr_1.6fr_1.1fr] gap-5 mb-5">

          {/* LIVE STREAM */}
          <div className="rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-bold text-[20px]">Live Request Stream</p>
                <p className="text-gray-500 text-sm mt-1">
                  Request web terbaru.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1">
                <div className="relative flex items-center">
                  <div className="absolute w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                  <div className="relative w-2 h-2 rounded-full bg-purple-500" />
                </div>
                <p className="text-xs text-purple-300 font-bold">LIVE</p>
              </div>
            </div>

            <div className="space-y-3 h-[1200px] overflow-auto scrollbar-hide pr-1">
              {liveRequests.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Tidak ada data HTTP/HTTPS proxy pada tanggal ini.
                </p>
              ) : (
                liveRequests.map((item, index) => {
                  const style = getActionStyle(item.action)

                  return (
                    <div
                      key={index}
                      className="rounded-2xl border border-[#353b6c] bg-[#0c0b20] p-4 hover:border-purple-500/40 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                          <p className="font-bold text-sm">{item.time}</p>
                        </div>

                        <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold ${style.badge}`}>
                          {item.action}
                        </span>
                      </div>

                      <p className="font-bold text-purple-300 truncate">
                        {item.domain}
                      </p>

                      <div className="mt-3 space-y-1 text-xs text-gray-400">
                        <p>Client: {item.client}</p>
                        <p>Type: {item.type}</p>
                        <p>App: {item.app}</p>
                        <p>Category: {item.category}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* CENTER INSIGHT */}
          <div className="space-y-5">

            {/* APP CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appCards.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border p-5 ${getCardStyle(item.color)}`}
                >
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="font-bold text-[22px] mt-2 truncate text-white">
                    {item.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* TOP APPLICATION */}
            <div className="rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
              <div className="mb-5">
                <p className="font-bold text-[20px]">Application Usage</p>
                <p className="text-gray-500 text-sm mt-1">
                  Aplikasi yang paling banyak terdeteksi dari web traffic.
                </p>
              </div>

              <div className="h-[310px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={applicationInsight} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                    <XAxis type="number" stroke="#9ca3af" tickLine={false} axisLine={false} />
                    <YAxis
                      dataKey="app"
                      type="category"
                      stroke="#9ca3af"
                      tickLine={false}
                      axisLine={false}
                      width={110}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0c0b20",
                        border: "1px solid #353b6c",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="total" fill="#a855f7" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TOP DOMAINS */}
            <div className="rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
              <div className="mb-5">
                <p className="font-bold text-[20px]">Domain Insight</p>
                <p className="text-gray-500 text-sm mt-1">
                  Domain yang paling sering diakses.
                </p>
              </div>

              <div className="space-y-3">
                {domainInsight.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Tidak ada data domain pada tanggal ini.
                  </p>
                ) : (
                  domainInsight.map((item, index) => {
                    const style = getActionStyle(item.status)

                    return (
                      <div
                        key={index}
                        className="rounded-xl border border-[#353b6c] bg-[#0c0b20] p-4"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="min-w-0">
                            <p className="font-bold text-purple-300 truncate">
                              {item.domain}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.request.toLocaleString()} requests
                            </p>
                          </div>

                          <span className={`px-3 py-1 rounded-lg border text-xs font-bold shrink-0 ${style.badge}`}>
                            {item.status}
                          </span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-[#14122d] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-purple-500"
                            style={{
                              width: `${domainInsight[0]?.request ? (item.request / domainInsight[0].request) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5">

            {/* CATEGORY PIE */}
            <div className="rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#1a1035] to-[#120b2f] p-5">
              <div className="mb-5">
                <p className="font-bold text-[20px]">Web Category Share</p>
                <p className="text-gray-500 text-sm mt-1">
                  Komposisi kategori website.
                </p>
              </div>

              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryShare}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                    >
                      {categoryShare.map((_, index) => (
                        <Cell
                          key={index}
                          fill={
                            index === 0
                              ? "#a855f7"
                              : index === 1
                                ? "#3b82f6"
                                : index === 2
                                  ? "#06b6d4"
                                  : index === 3
                                    ? "#22c55e"
                                    : "#ef4444"
                          }
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0c0b20",
                        border: "1px solid #353b6c",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {categoryShare.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Tidak ada data kategori pada tanggal ini.
                  </p>
                ) : (
                  categoryShare.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-[#353b6c] bg-[#0c0b20]/80 px-3 py-2"
                    >
                      <p className="text-sm text-gray-300">{item.name}</p>
                      <p className="text-sm font-bold text-purple-300">
                        {item.value}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* BLOCKED WEB */}
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
              <div className="mb-5">
                <p className="font-bold text-[20px] text-red-400">
                  Blocked Web Requests
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Domain/request yang ditolak oleh proxy.
                </p>
              </div>

              <div className="space-y-3">
                {blockedWeb.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Tidak ada request web yang ditolak pada tanggal ini.
                  </p>
                ) : (
                  blockedWeb.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-red-500/20 bg-[#0c0b20]/80 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold text-red-300 truncate">
                            {item.domain}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.reason}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Client: {item.client}
                          </p>
                        </div>

                        <p className="text-red-400 font-bold">
                          {item.count}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

        {/* DETAIL TABLE */}
        <div className="rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div>
              <p className="font-bold text-[20px]">HTTP/HTTPS Proxy Detail</p>
              <p className="text-sm text-gray-500 mt-1">
                Detail request berdasarkan domain, aplikasi, kategori, TLS, dan policy.
              </p>
            </div>

            <div className="px-3 py-2 rounded-lg border border-[#353b6c] bg-[#14122d] text-sm text-gray-400">
              {webLogs.length} records
            </div>
          </div>

          <div className="w-full overflow-auto scrollbar-hide">
            <div className="min-w-[1350px]">
              <div className="grid grid-cols-[90px_130px_100px_100px_1fr_1fr_1.3fr_1.1fr_1fr_100px_1.4fr] gap-3 px-4 py-3 rounded-xl border border-[#353b6c] bg-[#14122d] text-gray-400 text-sm font-bold">
                <p>No</p>
                <p>Type</p>
                <p>Action</p>
                <p>Method</p>
                <p>Client</p>
                <p>Destination</p>
                <p>Domain</p>
                <p>Application</p>
                <p>Category</p>
                <p>TLS</p>
                <p>Policy</p>
              </div>

              <div className="h-[330px] overflow-auto scrollbar-hide mt-3 space-y-2">
                {webLogs.length === 0 ? (
                  <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20] px-4 py-6 text-gray-500 text-sm">
                    Tidak ada data HTTP/HTTPS proxy pada tanggal ini.
                  </div>
                ) : (
                  webLogs.map((item, index) => {
                    const style = getActionStyle(item.action)

                    return (
                      <div
                        key={item.id || index}
                        className={`
                          grid grid-cols-[90px_130px_100px_100px_1fr_1fr_1.3fr_1.1fr_1fr_100px_1.4fr] gap-3
                          items-center px-4 py-3 rounded-xl
                          border border-[#353b6c]
                          bg-[#0c0b20]
                          transition-all duration-200
                          ${style.row}
                        `}
                      >
                        <p className="text-gray-300">{index+1}</p>
                        <p className="font-semibold text-purple-300">{item.logType}</p>

                        <div className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold ${style.badge}`}>
                          <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                          {item.action}
                        </div>

                        <p className="text-gray-400">{item.method}</p>
                        <p className="text-gray-300">{item.client}</p>
                        <p className="text-gray-300">{item.destination}</p>
                        <p className="text-purple-300 truncate">{item.domain}</p>
                        <p className="text-gray-300 truncate">{item.app}</p>
                        <p className="text-gray-400 truncate">{item.category}</p>
                        <p className="text-gray-400">{item.tls}</p>
                        <p className="text-gray-300 truncate">{item.policy}</p>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
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
                Info Web & Application Monitoring
              </p>

              <p className="text-gray-500 mt-1 mb-5">
                Fitur ini berfokus pada aktivitas web dan aplikasi dari log HTTP/HTTPS proxy.
              </p>

              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  <b className="text-purple-300">Live Request Stream</b> menampilkan request web terbaru.
                </p>
                <p>
                  <b className="text-purple-300">Application Usage</b> menampilkan aplikasi yang paling sering terdeteksi.
                </p>
                <p>
                  <b className="text-purple-300">Domain Insight</b> menampilkan domain yang paling sering diakses.
                </p>
                <p>
                  <b className="text-purple-300">Blocked Web Requests</b> menampilkan request/domain yang ditolak oleh proxy policy.
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

export default DashboardWebApplicationMonitoring