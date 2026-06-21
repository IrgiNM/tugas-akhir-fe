"use client"

import useSyslogLogs from "@/lib/data/dataSyslogLogs"
import Image from "next/image"
import { useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
} from "recharts"

type DashboardTrafficMonitoringProps = {
  pickDateTop: string
  pickMonthTop: string
  pickYearTop: string
  refreshSyslogKey: number
}

const DashboardTrafficMonitoring = ({
  pickDateTop,
  pickMonthTop,
  pickYearTop,
  refreshSyslogKey,
}: DashboardTrafficMonitoringProps) => {
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

  const trafficLogs = useMemo(() => {
    return syslogLogs.filter((item) => {
      return (
        item.src_ip ||
        item.dst_ip ||
        item.src_port ||
        item.dst_port ||
        item.protocol
      )
    })
  }, [syslogLogs])

  const getTime = (timestamp: string | null) => {
    if (!timestamp) return "-"

    return new Date(timestamp).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const isPrivateIp = (ip?: string | null) => {
    if (!ip) return false

    return (
      ip.startsWith("10.") ||
      ip.startsWith("192.168.") ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)
    )
  }

  const getDirection = (srcIp?: string | null, dstIp?: string | null) => {
    const srcPrivate = isPrivateIp(srcIp)
    const dstPrivate = isPrivateIp(dstIp)

    if (srcPrivate && !dstPrivate) return "Internal → External"
    if (!srcPrivate && dstPrivate) return "External → Internal"
    if (srcPrivate && dstPrivate) return "Internal → Internal"
    if (!srcPrivate && !dstPrivate) return "External → External"

    return "Unknown"
  }

  const getBytes = (item: any) => {
    const byteValue =
      item.extra_data?.bytes ||
      item.extra_data?.sent_bytes ||
      item.extra_data?.rcvd_bytes ||
      item.extra_data?.total_bytes ||
      item.extra_data?.packet_len ||
      0

    const numberByte = Number(byteValue)

    if (!numberByte || Number.isNaN(numberByte)) return "0 B"

    if (numberByte >= 1024 * 1024 * 1024) {
      return `${(numberByte / (1024 * 1024 * 1024)).toFixed(2)} GB`
    }

    if (numberByte >= 1024 * 1024) {
      return `${(numberByte / (1024 * 1024)).toFixed(2)} MB`
    }

    if (numberByte >= 1024) {
      return `${(numberByte / 1024).toFixed(1)} KB`
    }

    return `${numberByte} B`
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

  const getServiceName = (port: number | string | null) => {
    const portString = String(port || "-")

    if (portString === "443") return "HTTPS"
    if (portString === "80") return "HTTP"
    if (portString === "53") return "DNS"
    if (portString === "22") return "SSH"
    if (portString === "25") return "SMTP"
    if (portString === "110") return "POP3"
    if (portString === "143") return "IMAP"
    if (portString === "3389") return "RDP"

    return "Unknown"
  }

  const trafficSummary = useMemo(() => {
    const totalConnections = trafficLogs.length

    const allowedConnections = trafficLogs.filter(
      (item) => item.action === "Allow"
    ).length

    const deniedConnections = trafficLogs.filter(
      (item) =>
        item.action === "Deny" ||
        item.action === "Block" ||
        item.action === "Drop"
    ).length

    const totalBytes = trafficLogs.reduce((total, item) => {
      return total + getByteNumber(item)
    }, 0)

    return {
      totalConnections,
      allowedConnections,
      deniedConnections,
      totalBandwidth: formatBandwidth(totalBytes),
    }
  }, [trafficLogs])

  const trafficDirection = useMemo(() => {
    const grouped: Record<string, number> = {}

    trafficLogs.forEach((item) => {
      const direction = getDirection(item.src_ip, item.dst_ip)
      grouped[direction] = (grouped[direction] || 0) + 1
    })

    const descriptionMap: Record<string, string> = {
      "Internal → External": "Client internal mengakses internet",
      "External → Internal": "Traffic dari luar menuju jaringan",
      "Internal → Internal": "Traffic antar segmen internal",
      "External → External": "Traffic antar alamat eksternal",
      Unknown: "Arah traffic tidak dapat diidentifikasi",
    }

    return Object.entries(grouped)
      .map(([direction, total]) => ({
        direction,
        total,
        description: descriptionMap[direction] || "Arah traffic jaringan",
      }))
      .sort((a, b) => b.total - a.total)
  }, [trafficLogs])

  const protocolUsage = useMemo(() => {
    const grouped: Record<string, number> = {}

    trafficLogs.forEach((item) => {
      const protocol = (item.protocol || "Unknown").toUpperCase()
      grouped[protocol] = (grouped[protocol] || 0) + 1
    })

    return Object.entries(grouped)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [trafficLogs])

  const topPorts = useMemo(() => {
    const grouped: Record<
      string,
      {
        total: number
        allow: number
        deny: number
      }
    > = {}

    trafficLogs.forEach((item) => {
      const port = String(item.dst_port || "-")

      if (port === "-") return

      if (!grouped[port]) {
        grouped[port] = {
          total: 0,
          allow: 0,
          deny: 0,
        }
      }

      grouped[port].total += 1

      if (item.action === "Allow") {
        grouped[port].allow += 1
      }

      if (
        item.action === "Deny" ||
        item.action === "Block" ||
        item.action === "Drop"
      ) {
        grouped[port].deny += 1
      }
    })

    return Object.entries(grouped)
      .map(([port, value]) => ({
        port,
        service: getServiceName(port),
        total: value.total,
        action: value.deny > value.allow ? "Deny" : "Allow",
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  }, [trafficLogs])

  const topPolicies = useMemo(() => {
    const grouped: Record<
      string,
      {
        total: number
        allow: number
        deny: number
      }
    > = {}

    trafficLogs.forEach((item) => {
      const policy = item.policy || "Unknown Policy"

      if (!grouped[policy]) {
        grouped[policy] = {
          total: 0,
          allow: 0,
          deny: 0,
        }
      }

      grouped[policy].total += 1

      if (item.action === "Allow") {
        grouped[policy].allow += 1
      }

      if (
        item.action === "Deny" ||
        item.action === "Block" ||
        item.action === "Drop"
      ) {
        grouped[policy].deny += 1
      }
    })

    return Object.entries(grouped)
      .map(([policy, value]) => ({
        policy,
        total: value.total,
        action: value.deny > value.allow ? "Deny" : "Allow",
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  }, [trafficLogs])

  const connectionLogs = useMemo(() => {
    return trafficLogs.map((item) => ({
      id: item.id,
      time: getTime(item.timestamp),
      direction: getDirection(item.src_ip, item.dst_ip),
      action: item.action || "Unknown",
      protocol: item.protocol || "-",
      srcIp: item.src_ip || "-",
      srcPort: item.src_port || "-",
      dstIp: item.dst_ip || "-",
      dstPort: item.dst_port || "-",
      bytes: getBytes(item),
      policy: item.policy || "-",
    }))
  }, [trafficLogs])

  const getActionStyle = (action: string) => {
    if (action === "Allow") {
      return {
        badge: "border-green-500/30 bg-green-500/10 text-green-400",
        dot: "bg-green-400",
      }
    }

    return {
      badge: "border-red-500/30 bg-red-500/10 text-red-400",
      dot: "bg-red-500",
    }
  }

  if (isLoadingSyslog) {
    return (
      <div className="w-full rounded-2xl border border-[#353b6c] bg-[#0b0c1c] p-8">
        <p className="text-gray-300 font-bold">Loading traffic data...</p>
        <p className="text-gray-500 text-sm mt-1">
          Sedang mengambil data traffic dari database.
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

        <div className="relative overflow-hidden rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#071b2f] via-[#0b1f32] to-[#0c0b20] p-6 mb-5">
          <div className="absolute -top-20 -right-20 w-[230px] h-[230px] rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[230px] h-[230px] rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-sm text-cyan-300 font-semibold mb-2">
                Network Flow Analytics
              </p>
              <h2 className="font-bold text-[26px] md:text-[30px]">
                Traffic Monitoring
              </h2>
              <p className="text-gray-400 mt-2 max-w-2xl">
                Memantau koneksi jaringan berdasarkan arah traffic, protocol,
                destination port, policy firewall/proxy, dan penggunaan bandwidth.
                <span className="block mt-1 text-cyan-300 font-semibold">
                  Data ditampilkan untuk tanggal {selectedFullDate}
                </span>
              </p>
            </div>

            <button
              onClick={() => setSelectedInfo(true)}
              className="flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-[#353b6c] bg-[#0c0b20]/70 hover:bg-[#353b6c] transition-all duration-200"
            >
              <Image src="/info.png" alt="Info" width={15} height={15} />
              <p className="font-bold">Info Traffic</p>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
            <p className="text-cyan-300 text-sm font-bold">Total Connections</p>
            <p className="font-bold text-[30px] mt-1">
              {trafficSummary.totalConnections.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">all traffic records</p>
          </div>

          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
            <p className="text-green-400 text-sm font-bold">Allowed</p>
            <p className="font-bold text-[30px] mt-1">
              {trafficSummary.allowedConnections.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">accepted connections</p>
          </div>

          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <p className="text-red-400 text-sm font-bold">Denied</p>
            <p className="font-bold text-[30px] mt-1">
              {trafficSummary.deniedConnections.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">blocked connections</p>
          </div>

          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
            <p className="text-blue-300 text-sm font-bold">Bandwidth</p>
            <p className="font-bold text-[30px] mt-1">
              {trafficSummary.totalBandwidth}
            </p>
            <p className="text-xs text-gray-500">sent + received</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
          <div className="xl:col-span-2 rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
            <div className="mb-5">
              <p className="font-bold text-[20px]">Traffic Direction</p>
              <p className="text-gray-500 text-sm mt-1">
                Arah koneksi jaringan yang paling sering muncul.
              </p>
            </div>

            {trafficDirection.length === 0 ? (
              <p className="text-sm text-gray-500">
                Tidak ada data traffic pada tanggal ini.
              </p>
            ) : (
              <div className="flex flex-col md:grid-cols-2 gap-4">
                {trafficDirection.map((item, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-2xl border border-[#353b6c] bg-[#0c0b20] p-5"
                  >
                    <div className="absolute -right-10 -top-10 w-[120px] h-[120px] rounded-full bg-cyan-500/10 blur-2xl" />

                    <div className="relative">
                      <p className="text-gray-400 text-sm">{item.description}</p>
                      <p className="font-bold text-[22px] mt-2">
                        {item.direction}
                      </p>
                      <p className="text-cyan-300 font-bold text-[30px] mt-3">
                        {item.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">connections</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] to-[#120b2f] p-5">
            <div className="mb-5">
              <p className="font-bold text-[20px]">Protocol Usage</p>
              <p className="text-gray-500 text-sm mt-1">
                Distribusi protocol jaringan.
              </p>
            </div>

            <div className="w-full h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={protocolUsage}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                  >
                    {protocolUsage.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? "#06b6d4"
                            : index === 1
                            ? "#3b82f6"
                            : "#a855f7"
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

            <div className="space-y-3">
              {protocolUsage.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Tidak ada data protocol pada tanggal ini.
                </p>
              ) : (
                protocolUsage.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-[#353b6c] bg-[#0c0b20]/80 px-4 py-3"
                  >
                    <p className="font-bold">{item.name}</p>
                    <p className="text-cyan-300 font-bold">
                      {item.value.toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
          <div className="rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
            <div className="mb-5">
              <p className="font-bold text-[20px]">Top Destination Ports</p>
              <p className="text-gray-500 text-sm mt-1">
                Port tujuan yang paling sering digunakan pada traffic.
              </p>
            </div>

            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPorts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="port" stroke="#9ca3af" tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0c0b20",
                      border: "1px solid #353b6c",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="total" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
            <div className="mb-5">
              <p className="font-bold text-[20px]">Top Traffic Policies</p>
              <p className="text-gray-500 text-sm mt-1">
                Policy firewall/proxy yang paling sering terkena traffic.
              </p>
            </div>

            <div className="space-y-3">
              {topPolicies.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Tidak ada data policy pada tanggal ini.
                </p>
              ) : (
                topPolicies.map((item, index) => {
                  const style = getActionStyle(item.action)

                  return (
                    <div
                      key={index}
                      className="rounded-xl border border-[#353b6c] bg-[#0c0b20] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold truncate">{item.policy}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.total.toLocaleString()} connections
                          </p>
                        </div>

                        <span className={`px-3 py-1 rounded-lg border text-xs font-bold shrink-0 ${style.badge}`}>
                          {item.action}
                        </span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-[#14122d] overflow-hidden mt-3">
                        <div
                          className="h-full rounded-full bg-cyan-500"
                          style={{
                            width: `${topPolicies[0]?.total ? (item.total / topPolicies[0].total) * 100 : 0}%`,
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

        <div className="rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div>
              <p className="font-bold text-[20px]">Connection Logs</p>
              <p className="text-sm text-gray-500 mt-1">
                Detail koneksi berdasarkan arah traffic, IP, port, protocol, bytes, dan policy.
              </p>
            </div>

            <div className="px-3 py-2 rounded-lg border border-[#353b6c] bg-[#14122d] text-sm text-gray-400">
              {connectionLogs.length} records
            </div>
          </div>

          <div className="w-full overflow-auto scrollbar-hide">
            <div className="min-w-[1280px]">
              <div className="grid grid-cols-[90px_170px_100px_90px_1fr_90px_1fr_90px_100px_1.5fr] gap-3 px-4 py-3 rounded-xl border border-[#353b6c] bg-[#14122d] text-gray-400 text-sm font-bold">
                <p>Time</p>
                <p>Direction</p>
                <p>Action</p>
                <p>Proto</p>
                <p>Source IP</p>
                <p>Src Port</p>
                <p>Destination IP</p>
                <p>Dst Port</p>
                <p>Bytes</p>
                <p>Policy</p>
              </div>

              <div className="h-[330px] overflow-auto scrollbar-hide mt-3 space-y-2">
                {connectionLogs.length === 0 ? (
                  <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20] px-4 py-6 text-gray-500 text-sm">
                    Tidak ada data koneksi pada tanggal ini.
                  </div>
                ) : (
                  connectionLogs.map((item, index) => {
                    const style = getActionStyle(item.action)

                    return (
                      <div
                        key={item.id || index}
                        className="grid grid-cols-[90px_170px_100px_90px_1fr_90px_1fr_90px_100px_1.5fr] gap-3 items-center px-4 py-3 rounded-xl border border-[#353b6c] bg-[#0c0b20] hover:border-cyan-500/30 transition-all duration-200"
                      >
                        <p className="text-gray-300">{item.time}</p>
                        <p className="text-cyan-300 font-semibold">{item.direction}</p>

                        <div className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold ${style.badge}`}>
                          <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                          {item.action}
                        </div>

                        <p className="text-gray-400">{item.protocol}</p>
                        <p className="text-gray-300">{item.srcIp}</p>
                        <p className="text-gray-400">{item.srcPort}</p>
                        <p className="text-gray-300">{item.dstIp}</p>
                        <p className="text-gray-400">{item.dstPort}</p>
                        <p className="text-gray-400">{item.bytes}</p>
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

      {selectedInfo && (
        <>
          <div className="fixed inset-0 z-70 bg-[#0c0b20]/90 backdrop-blur-sm" />

          <div className="fixed inset-0 z-80 flex justify-center items-start gap-3 pt-[130px] px-5">
            <div className="w-full max-w-[720px] rounded-2xl border border-[#353b6c] bg-[#0c0b20] p-7 shadow-2xl">
              <p className="font-bold text-[24px]">Info Traffic Monitoring</p>
              <p className="text-gray-500 mt-1 mb-5">
                Fitur ini berfokus pada pemantauan koneksi jaringan, bukan ringkasan semua log.
              </p>

              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  <b className="text-cyan-300">Traffic Direction</b> menunjukkan arah koneksi seperti internal ke external atau external ke internal.
                </p>
                <p>
                  <b className="text-cyan-300">Protocol Usage</b> menunjukkan penggunaan TCP, UDP, ICMP, dan protocol lain yang terdeteksi.
                </p>
                <p>
                  <b className="text-cyan-300">Top Ports</b> menunjukkan destination port yang paling sering diakses.
                </p>
                <p>
                  <b className="text-cyan-300">Connection Logs</b> menampilkan detail koneksi berdasarkan source IP, destination IP, port, action, dan policy.
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

export default DashboardTrafficMonitoring