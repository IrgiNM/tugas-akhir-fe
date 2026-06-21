"use client"

import useSyslogLogs from "@/lib/data/dataSyslogLogs"
import Image from "next/image"
import { useMemo, useState } from "react"

type AlarmStatus = "Normal" | "Warning" | "Critical" | "Info"

type AlarmLogType = {
  id: number
  time: string
  logType: "link-mon" | "loggerd" | string
  status: AlarmStatus
  title: string
  message: string
  source: string
  target: string
  detail: string
}

type DashboardNetworkSystemAlarmProps = {
  pickDateTop: string
  pickMonthTop: string
  pickYearTop: string
  refreshSyslogKey: number
}

const DashboardNetworkSystemAlarm = ({
  pickDateTop,
  pickMonthTop,
  pickYearTop,
  refreshSyslogKey,
}: DashboardNetworkSystemAlarmProps) => {
  const [selectedInfo, setSelectedInfo] = useState<boolean>(false)
  const [selectedAlarm, setSelectedAlarm] = useState<AlarmLogType | null>(null)

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

  const alarmSourceLogs = useMemo(() => {
    return syslogLogs.filter((item) => {
      return item.log_type === "link-mon" || item.log_type === "loggerd"
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

  const getShortTime = (timestamp: string | null) => {
    if (!timestamp) return "-"

    return new Date(timestamp).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getAlarmStatus = (item: any): AlarmStatus => {
    const text = `${item.message || ""} ${item.raw_log || ""}`.toLowerCase()

    if (
      text.includes("no response") ||
      text.includes("failed") ||
      text.includes("down") ||
      text.includes("unreachable") ||
      text.includes("critical")
    ) {
      return "Critical"
    }

    if (
      text.includes("delay") ||
      text.includes("latency") ||
      text.includes("timeout") ||
      text.includes("unstable") ||
      text.includes("warning")
    ) {
      return "Warning"
    }

    if (
      text.includes("archive") ||
      text.includes("archived") ||
      text.includes("max size") ||
      item.log_type === "loggerd"
    ) {
      return "Info"
    }

    if (
      text.includes("response received") ||
      text.includes("recovered") ||
      text.includes("normal") ||
      text.includes("up")
    ) {
      return "Normal"
    }

    return "Info"
  }

  const getAlarmTitle = (item: any) => {
    const message = item.message || item.raw_log || "-"

    const text = message.toLowerCase()

    if (text.includes("no response")) return "No response received"
    if (text.includes("response received")) return "Ping target recovered"
    if (text.includes("archive") || text.includes("archived")) return "Archived log file"
    if (text.includes("latency") || text.includes("delay")) return "High latency detected"
    if (text.includes("timeout")) return "Ping target timeout"
    if (text.includes("unstable")) return "Ping target unstable"
    if (item.log_type === "loggerd") return "Logger system event"
    if (item.log_type === "link-mon") return "Link monitor event"

    return "System alarm event"
  }

  const getAlarmSource = (item: any) => {
    return (
      item.from_zone ||
      item.device_name ||
      item.extra_data?.interface ||
      item.extra_data?.source ||
      item.extra_data?.src ||
      item.log_type ||
      "-"
    )
  }

  const getAlarmTarget = (item: any) => {
    return (
      item.dst_ip ||
      item.dstname ||
      item.extra_data?.target ||
      item.extra_data?.ping_target ||
      item.extra_data?.file ||
      item.extra_data?.path ||
      "-"
    )
  }

  const getAlarmDetail = (item: any) => {
    const status = getAlarmStatus(item)

    if (status === "Critical") {
      return "Alarm berada pada kondisi critical. Perlu dilakukan pengecekan pada target, koneksi interface, gateway, atau service yang terkait."
    }

    if (status === "Warning") {
      return "Alarm menunjukkan kondisi tidak stabil atau membutuhkan perhatian. Periksa latency, timeout, dan kestabilan koneksi."
    }

    if (status === "Info") {
      return "Log ini bersifat informasi sistem, seperti aktivitas logger, archive file log, atau event sistem lainnya."
    }

    return "Kondisi sudah normal berdasarkan pesan log yang diterima."
  }

  const alarmLogs = useMemo<AlarmLogType[]>(() => {
    return alarmSourceLogs.map((item) => ({
      id: item.id,
      time: getTime(item.timestamp),
      logType: item.log_type,
      status: getAlarmStatus(item),
      title: getAlarmTitle(item),
      message: item.message || item.raw_log || "-",
      source: getAlarmSource(item),
      target: getAlarmTarget(item),
      detail: getAlarmDetail(item),
    }))
  }, [alarmSourceLogs])

  const alarmSummary = useMemo(() => {
    const totalAlarm = alarmLogs.length
    const normal = alarmLogs.filter((item) => item.status === "Normal").length
    const warning = alarmLogs.filter((item) => item.status === "Warning").length
    const critical = alarmLogs.filter((item) => item.status === "Critical").length

    return {
      totalAlarm,
      normal,
      warning,
      critical,
    }
  }, [alarmLogs])

  const alarmBoards = useMemo(() => {
    const linkMonitorLogs = alarmLogs.filter((item) => item.logType === "link-mon")
    const loggerLogs = alarmLogs.filter((item) => item.logType === "loggerd")
    const noResponseLogs = alarmLogs.filter((item) =>
      item.message.toLowerCase().includes("no response")
    )
    const archivedLogs = alarmLogs.filter((item) => {
      const message = item.message.toLowerCase()
      return message.includes("archive") || message.includes("archived")
    })

    return [
      {
        title: "Link Monitor",
        value: linkMonitorLogs.length,
        status: getBoardStatus(linkMonitorLogs),
        description: "Ping target dan interface monitoring",
      },
      {
        title: "Logger System",
        value: loggerLogs.length,
        status: loggerLogs.length > 0 ? "Info" : "Normal",
        description: "Aktivitas file log dan archive",
      },
      {
        title: "No Response Target",
        value: noResponseLogs.length,
        status: noResponseLogs.length > 0 ? "Critical" : "Normal",
        description: "Target ping tidak memberikan respon",
      },
      {
        title: "Archived Log File",
        value: archivedLogs.length,
        status: archivedLogs.length > 0 ? "Info" : "Normal",
        description: "Log file mencapai ukuran maksimum",
      },
    ]
  }, [alarmLogs])

  function getBoardStatus(logs: AlarmLogType[]): AlarmStatus {
    if (logs.some((item) => item.status === "Critical")) return "Critical"
    if (logs.some((item) => item.status === "Warning")) return "Warning"
    if (logs.some((item) => item.status === "Info")) return "Info"
    return "Normal"
  }

  const alarmTimeline = useMemo(() => {
    return alarmSourceLogs.slice(0, 10).map((item) => ({
      time: getShortTime(item.timestamp),
      title: getAlarmTitle(item),
      status: getAlarmStatus(item),
      description: item.message || item.raw_log || "-",
    }))
  }, [alarmSourceLogs])

  const systemHealth = useMemo(() => {
    const grouped: Record<
      string,
      {
        name: string
        type: string
        status: AlarmStatus
        value: string
      }
    > = {}

    alarmLogs.forEach((item) => {
      const name = item.target !== "-" ? item.target : item.source
      const type = item.logType === "link-mon" ? "Ping Target" : "System Log"

      if (!grouped[name]) {
        grouped[name] = {
          name,
          type,
          status: item.status,
          value: item.status === "Normal" ? "normal" : item.status.toLowerCase(),
        }
      }

      if (item.status === "Critical") {
        grouped[name].status = "Critical"
        grouped[name].value = "no response / critical"
      } else if (item.status === "Warning" && grouped[name].status !== "Critical") {
        grouped[name].status = "Warning"
        grouped[name].value = "unstable / warning"
      } else if (
        item.status === "Info" &&
        grouped[name].status !== "Critical" &&
        grouped[name].status !== "Warning"
      ) {
        grouped[name].status = "Info"
        grouped[name].value = "system event"
      }
    })

    return Object.values(grouped).slice(0, 6)
  }, [alarmLogs])

  const currentAttention = useMemo(() => {
    const criticalAlarm = alarmLogs.find((item) => item.status === "Critical")
    const warningAlarm = alarmLogs.find((item) => item.status === "Warning")

    if (criticalAlarm) {
      return `${criticalAlarm.target} dari source ${criticalAlarm.source} sedang membutuhkan pengecekan.`
    }

    if (warningAlarm) {
      return `${warningAlarm.target} dari source ${warningAlarm.source} perlu diperhatikan.`
    }

    return "Tidak ada alarm critical atau warning pada tanggal ini."
  }, [alarmLogs])

  const getStatusStyle = (status: AlarmStatus) => {
    if (status === "Normal") {
      return {
        badge: "border-green-500/30 bg-green-500/10 text-green-400",
        dot: "bg-green-400",
        card: "hover:border-green-500/40",
        glow: "bg-green-500/10",
        text: "text-green-400",
      }
    }

    if (status === "Warning") {
      return {
        badge: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
        dot: "bg-yellow-400",
        card: "hover:border-yellow-500/40",
        glow: "bg-yellow-500/10",
        text: "text-yellow-300",
      }
    }

    if (status === "Critical") {
      return {
        badge: "border-red-500/30 bg-red-500/10 text-red-400",
        dot: "bg-red-500",
        card: "hover:border-red-500/40",
        glow: "bg-red-500/10",
        text: "text-red-400",
      }
    }

    return {
      badge: "border-blue-500/30 bg-blue-500/10 text-blue-300",
      dot: "bg-blue-400",
      card: "hover:border-blue-500/40",
      glow: "bg-blue-500/10",
      text: "text-blue-300",
    }
  }

  if (isLoadingSyslog) {
    return (
      <div className="w-full rounded-2xl border border-[#353b6c] bg-[#0b0c1c] p-8">
        <p className="text-gray-300 font-bold">Loading network alarm data...</p>
        <p className="text-gray-500 text-sm mt-1">
          Sedang mengambil data alarm jaringan dan sistem dari database.
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
        <div className="relative overflow-hidden rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#2d270b] via-[#111c45] to-[#0c0b20] p-6 mb-5">
          <div className="absolute -top-20 -right-20 w-[240px] h-[240px] rounded-full bg-yellow-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[240px] h-[240px] rounded-full bg-red-500/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-sm text-yellow-300 font-semibold mb-2">
                Network Alarm Center
              </p>

              <h2 className="font-bold text-[26px] md:text-[30px]">
                Network & System Alarm
              </h2>

              <p className="text-gray-400 mt-2 max-w-2xl">
                Memantau alarm jaringan dan sistem dari log link monitor dan loggerd,
                seperti ping target no response, interface bermasalah, dan archive log file.
                <span className="block mt-1 text-yellow-300 font-semibold">
                  Data ditampilkan untuk tanggal {selectedFullDate}
                </span>
              </p>
            </div>

            <button
              onClick={() => setSelectedInfo(true)}
              className="flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-[#353b6c] bg-[#0c0b20]/70 hover:bg-[#353b6c] transition-all duration-200"
            >
              <Image src="/info.png" alt="Info" width={15} height={15} />
              <p className="font-bold">Info Alarm</p>
            </button>
          </div>
        </div>

        {/* TOP STATUS STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
            <p className="text-yellow-300 text-sm font-bold">Total Alarm</p>
            <p className="font-bold text-[30px] mt-1">{alarmSummary.totalAlarm}</p>
            <p className="text-xs text-gray-500">network & system events</p>
          </div>

          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
            <p className="text-green-400 text-sm font-bold">Normal</p>
            <p className="font-bold text-[30px] mt-1">{alarmSummary.normal}</p>
            <p className="text-xs text-gray-500">healthy condition</p>
          </div>

          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
            <p className="text-yellow-300 text-sm font-bold">Warning</p>
            <p className="font-bold text-[30px] mt-1">{alarmSummary.warning}</p>
            <p className="text-xs text-gray-500">needs attention</p>
          </div>

          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <p className="text-red-400 text-sm font-bold">Critical</p>
            <p className="font-bold text-[30px] mt-1">{alarmSummary.critical}</p>
            <p className="text-xs text-gray-500">service affected</p>
          </div>
        </div>

        {/* MAIN ALARM BOARD */}
        <div className="grid grid-cols-1 2xl:grid-cols-[1fr_1.1fr_1fr] gap-5 mb-5">

          {/* ALARM BOARD */}
          <div className="rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
            <div className="mb-5">
              <p className="font-bold text-[20px]">Alarm Status Board</p>
              <p className="text-gray-500 text-sm mt-1">
                Ringkasan jenis alarm yang terdeteksi.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {alarmBoards.map((item, index) => {
                const style = getStatusStyle(item.status as AlarmStatus)

                return (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-2xl border border-[#353b6c] bg-[#0c0b20] p-5 ${style.card} transition-all duration-200`}
                  >
                    <div className={`absolute -right-10 -top-10 w-[120px] h-[120px] rounded-full ${style.glow} blur-2xl`} />

                    <div className="relative flex items-start justify-between gap-4">
                      <div>
                        <p className={`text-sm font-bold ${style.text}`}>
                          {item.title}
                        </p>

                        <p className="font-bold text-[30px] mt-1">
                          {item.value}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {item.description}
                        </p>
                      </div>

                      <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${style.badge}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* INCIDENT TIMELINE */}
          <div className="rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] to-[#0c0b20] p-5">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="font-bold text-[20px]">Incident Timeline</p>
                <p className="text-gray-500 text-sm mt-1">
                  Urutan kejadian alarm terbaru.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1">
                <div className="relative flex items-center">
                  <div className="absolute w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <div className="relative w-2 h-2 rounded-full bg-red-500" />
                </div>
                <p className="text-xs text-red-400 font-bold">MONITOR</p>
              </div>
            </div>

            <div className="relative h-[520px] overflow-auto scrollbar-hide pr-1">
              <div className="absolute left-[17px] top-2 bottom-2 w-[1px] bg-[#353b6c]" />

              <div className="space-y-4">
                {alarmTimeline.length === 0 ? (
                  <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20] p-4 text-sm text-gray-500">
                    Tidak ada timeline alarm pada tanggal ini.
                  </div>
                ) : (
                  alarmTimeline.map((item, index) => {
                    const style = getStatusStyle(item.status)

                    return (
                      <div key={index} className="relative flex gap-4">
                        <div className="relative z-10 mt-1">
                          {item.status === "Critical" && (
                            <div className={`absolute w-9 h-9 rounded-full ${style.dot} animate-ping opacity-20`} />
                          )}

                          <div className={`relative w-9 h-9 rounded-xl border ${style.badge} flex items-center justify-center`}>
                            <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                          </div>
                        </div>

                        <div className="flex-1 rounded-2xl border border-[#353b6c] bg-[#0c0b20]/90 p-4 hover:bg-[#14122d] transition-all duration-200">
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <p className="font-bold text-sm">{item.title}</p>

                            <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${style.badge}`}>
                              {item.status}
                            </span>
                          </div>

                          <p className="text-xs text-gray-500 mb-2">
                            {item.time}
                          </p>

                          <p className="text-sm text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* SYSTEM HEALTH */}
          <div className="rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
            <div className="mb-5">
              <p className="font-bold text-[20px]">System Health Panel</p>
              <p className="text-gray-500 text-sm mt-1">
                Status objek yang dimonitor.
              </p>
            </div>

            <div className="space-y-4">
              {systemHealth.length === 0 ? (
                <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20] p-4 text-sm text-gray-500">
                  Tidak ada objek alarm pada tanggal ini.
                </div>
              ) : (
                systemHealth.map((item, index) => {
                  const style = getStatusStyle(item.status)

                  return (
                    <button
                      key={index}
                      className={`w-full text-left rounded-2xl border border-[#353b6c] bg-[#0c0b20] p-4 ${style.card} transition-all duration-200`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                            <p className="font-bold truncate">{item.name}</p>
                          </div>

                          <p className="text-xs text-gray-500 mt-2">
                            {item.type}
                          </p>

                          <p className={`text-sm font-bold mt-1 ${style.text}`}>
                            {item.value}
                          </p>
                        </div>

                        <span className={`px-3 py-1 rounded-lg border text-xs font-bold shrink-0 ${style.badge}`}>
                          {item.status}
                        </span>
                      </div>
                    </button>
                  )
                })
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
              <p className="text-yellow-300 font-bold mb-2">
                Current Attention
              </p>

              <p className="text-sm text-gray-300">
                {currentAttention}
              </p>
            </div>
          </div>
        </div>

        {/* ALARM DETAIL */}
        <div className="grid grid-cols-1 2xl:grid-cols-[1.3fr_1fr] gap-5">

          {/* ALARM LOG LIST */}
          <div className="rounded-2xl border border-[#353b6c] bg-[#08071a] p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <p className="font-bold text-[20px]">Alarm Logs</p>
                <p className="text-sm text-gray-500 mt-1">
                  Klik salah satu alarm untuk melihat detailnya.
                </p>
              </div>

              <div className="px-3 py-2 rounded-lg border border-[#353b6c] bg-[#14122d] text-sm text-gray-400">
                {alarmLogs.length} records
              </div>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-auto scrollbar-hide pr-1">
              {alarmLogs.length === 0 ? (
                <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20] px-4 py-6 text-gray-500 text-sm">
                  Tidak ada alarm pada tanggal ini.
                </div>
              ) : (
                alarmLogs.map((item) => {
                  const style = getStatusStyle(item.status)
                  const active = selectedAlarm?.id === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedAlarm(item)}
                      className={`
                        w-full text-left rounded-2xl border p-4
                        bg-[#0c0b20]
                        transition-all duration-200
                        ${
                          active
                            ? "border-yellow-500/60 shadow-lg shadow-yellow-500/10"
                            : `border-[#353b6c] ${style.card}`
                        }
                      `}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0">
                          <div className={`w-[46px] h-[46px] rounded-xl border ${style.badge} flex items-center justify-center shrink-0`}>
                            <div className={`w-3 h-3 rounded-full ${style.dot}`} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-[16px]">
                                {item.title}
                              </p>

                              <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${style.badge}`}>
                                {item.status}
                              </span>
                            </div>

                            <p className="text-sm text-gray-400 mt-1 truncate">
                              {item.message}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="px-3 py-1 rounded-lg border border-[#353b6c] bg-[#14122d] text-xs text-gray-400">
                                {item.time}
                              </span>

                              <span className="px-3 py-1 rounded-lg border border-[#353b6c] bg-[#14122d] text-xs text-gray-400">
                                {item.logType}
                              </span>

                              <span className="px-3 py-1 rounded-lg border border-[#353b6c] bg-[#14122d] text-xs text-gray-400">
                                {item.source}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* SELECTED ALARM DETAIL */}
          <div className="rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] to-[#0c0b20] p-5">
            {!selectedAlarm ? (
              <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center">
                <div className="w-[72px] h-[72px] rounded-2xl border border-yellow-500/30 bg-yellow-500/10 flex items-center justify-center mb-5">
                  <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/40" />
                </div>

                <p className="font-bold text-[22px]">
                  Pilih salah satu alarm
                </p>

                <p className="text-gray-500 mt-2 max-w-sm">
                  Detail alarm akan tampil di sini, termasuk source, target,
                  status, pesan log, dan deskripsi masalah.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="min-w-0">
                    <p className="text-sm text-yellow-300 font-semibold">
                      Selected Alarm
                    </p>

                    <p className="font-bold text-[26px] mt-1">
                      {selectedAlarm.title}
                    </p>

                    <p className="text-gray-500 mt-1">
                      {selectedAlarm.time} • {selectedAlarm.logType}
                    </p>
                  </div>

                  <span className={`px-3 py-2 rounded-lg border text-xs font-bold ${getStatusStyle(selectedAlarm.status).badge}`}>
                    {selectedAlarm.status}
                  </span>
                </div>

                <div className="rounded-2xl border border-[#353b6c] bg-[#0c0b20]/80 p-5 mb-4">
                  <p className="text-xs text-gray-500 mb-2">Message</p>
                  <p className="text-gray-300">
                    {selectedAlarm.message}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/80 p-4">
                    <p className="text-xs text-gray-500">Source</p>
                    <p className="font-bold mt-1 truncate">
                      {selectedAlarm.source}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#353b6c] bg-[#0c0b20]/80 p-4">
                    <p className="text-xs text-gray-500">Target</p>
                    <p className="font-bold mt-1 truncate">
                      {selectedAlarm.target}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
                  <p className="text-yellow-300 font-bold mb-2">
                    Detail Analysis
                  </p>

                  <p className="text-sm text-gray-300">
                    {selectedAlarm.detail}
                  </p>
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
                Info Network & System Alarm
              </p>

              <p className="text-gray-500 mt-1 mb-5">
                Fitur ini menampilkan alarm jaringan dan sistem dari log link monitor dan loggerd.
              </p>

              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  <b className="text-yellow-300">Link Monitor</b> digunakan untuk memantau ping target, interface, atau koneksi yang tidak merespon.
                </p>

                <p>
                  <b className="text-yellow-300">Loggerd</b> digunakan untuk melihat aktivitas sistem log seperti archive file log.
                </p>

                <p>
                  <b className="text-yellow-300">Incident Timeline</b> menampilkan urutan kejadian alarm terbaru.
                </p>

                <p>
                  <b className="text-yellow-300">Alarm Detail</b> muncul ketika salah satu alarm diklik.
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

export default DashboardNetworkSystemAlarm