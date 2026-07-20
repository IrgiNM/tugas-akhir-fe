import { useEffect, useMemo, useState } from "react";
import { getSyslogLogs } from "../function/api";
import {
  SyslogLogFilterType,
  SyslogLogType,
} from "@/type/syslogLogType";

const useSyslogLogs = (
    filter?: SyslogLogFilterType,
    refreshKey?: number
  ) => {
  const [syslogLogs, setSyslogLogs] = useState<SyslogLogType[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [isLoadingSyslog, setIsLoadingSyslog] = useState<boolean>(false);
  const [errorSyslog, setErrorSyslog] = useState<string>("");

  useEffect(() => {
    const fetchDataSyslogLogs = async () => {
      setIsLoadingSyslog(true)
      setErrorSyslog("")
  
      try {
        const res = await getSyslogLogs(filter)
  
        if (res.status === 200) {
          // alert("Berhasil mengambil data syslog logs")
          setSyslogLogs(res.data.data || [])
          setTotalData(res.data.count || 0)
        }
      } catch (error) {
        console.error("Error fetching syslog logs:", error)
        setErrorSyslog("Gagal mengambil data syslog logs")
      } finally {
        setIsLoadingSyslog(false)
      }
    }
  
    fetchDataSyslogLogs()
  }, [
    filter?.log_type,
    filter?.action,
    filter?.src_ip,
    filter?.dst_ip,
    filter?.msg_id,
    filter?.date,
    filter?.month,
    filter?.year,
    refreshKey,
  ])

  const totalLogs = totalData;

  const totalAllow = useMemo(() => {
    return syslogLogs.filter((item) => item.action === "Allow").length;
  }, [syslogLogs]);

  const totalDeny = useMemo(() => {
    return syslogLogs.filter((item) => item.action === "Deny").length;
  }, [syslogLogs]);

  const totalBlockDrop = useMemo(() => {
    return syslogLogs.filter(
      (item) => item.action === "Block" || item.action === "Drop"
    ).length;
  }, [syslogLogs]);

  const totalAlarm = useMemo(() => {
    return syslogLogs.filter(
      (item) =>
        item.log_type === "link-mon" ||
        item.log_type === "loggerd" ||
        item.action === "Unknown"
    ).length;
  }, [syslogLogs]);

  const allowRate = useMemo(() => {
    if (syslogLogs.length === 0) return 0;
    return Math.round((totalAllow / syslogLogs.length) * 100);
  }, [syslogLogs, totalAllow]);

  const latestUpdate = useMemo(() => {
    const latest = syslogLogs[0];

    if (!latest?.timestamp) return "-";

    return new Date(latest.timestamp).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [syslogLogs]);

  const logTypeSummary = useMemo(() => {
    const grouped: Record<string, number> = {};

    syslogLogs.forEach((item) => {
      const type = item.log_type || "unknown";
      grouped[type] = (grouped[type] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([type, total]) => ({
        type,
        total,
        label: type
          .split("-")
          .map((text) => text.charAt(0).toUpperCase() + text.slice(1))
          .join(" "),
      }))
      .sort((a, b) => b.total - a.total);
  }, [syslogLogs]);

  const mostActiveLogType = useMemo(() => {
    if (logTypeSummary.length === 0) return "-";
    return logTypeSummary[0].label;
  }, [logTypeSummary]);

  const overviewTimeline = useMemo(() => {
    const now = new Date()
  
    const selectedYear = filter?.year
      ? Number(filter.year)
      : now.getFullYear()
  
    const selectedMonth = filter?.month
      ? Number(filter.month)
      : now.getMonth() + 1
  
    const totalDays = new Date(selectedYear, selectedMonth, 0).getDate()
  
    const days = Array.from({ length: totalDays }, (_, index) => {
      const day = String(index + 1).padStart(2, "0")
  
      return {
        date: day,
        allow: 0,
        deny: 0,
      }
    })
  
    syslogLogs.forEach((item) => {
      if (!item.timestamp) return
  
      const logDate = new Date(item.timestamp)
      const dayIndex = logDate.getDate() - 1
  
      if (!days[dayIndex]) return
  
      if (item.action === "Allow") {
        days[dayIndex].allow += 1
      }
  
      if (item.action === "Deny") {
        days[dayIndex].deny += 1
      }
    })
  
    return days
  }, [syslogLogs, filter?.month, filter?.year])

  const latestLogs = useMemo(() => {
    return syslogLogs.slice(0, 10000).map((item) => {
      const time = item.timestamp
        ? new Date(item.timestamp).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-";

      return {
        id: item.id,
        time,
        logType: item.log_type || "-",
        action: item.action || "Unknown",
        srcIp: item.src_ip || "-",
        dstIp: item.dst_ip || "-",
        protocol: item.protocol || "-",
        dstPort: item.dst_port || "-",
        geo:
          item.geo_src && item.geo_dst
            ? `${item.geo_src} → ${item.geo_dst}`
            : item.geo_src || item.geo_dst || "-",
        message: item.message || "-",
        policy: item.policy || "-",
      };
    });
  }, [syslogLogs]);

  const recentActivity = useMemo(() => {
    return syslogLogs.slice(0, 10000).map((item) => {
      const time = item.timestamp
        ? new Date(item.timestamp).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-";

      let title = "Syslog activity detected";

      if (item.action === "Deny") {
        title = "Traffic denied";
      } else if (item.action === "Allow") {
        title = "Traffic allowed";
      } else if (item.action === "Block") {
        title = "Traffic blocked";
      } else if (item.action === "Drop") {
        title = "Traffic dropped";
      } else if (item.log_type === "link-mon") {
        title = "Link monitor warning";
      } else if (item.log_type === "loggerd") {
        title = "System logger activity";
      }

      return {
        id: item.id,
        time,
        title,
        description:
          item.message ||
          `${item.src_ip || "-"} menuju ${item.dst_ip || "-"} melalui ${
            item.protocol || "-"
          }`,
        status: item.action || "Unknown",
      };
    });
  }, [syslogLogs]);


  const dataYearAt = useMemo(() => {
    const years = syslogLogs
      .filter((item) => item.timestamp)
      .map((item) => {
        const date = new Date(item.timestamp as string)
        return String(date.getFullYear())
      })
  
    return Array.from(new Set(years)).sort((a, b) => Number(b) - Number(a))
  }, [syslogLogs])
  
  const dataMonthAt = useMemo(() => {
    const months = syslogLogs
      .filter((item) => item.timestamp)
      .filter((item) => {
        if (!filter?.year) return true
  
        const date = new Date(item.timestamp as string)
        return String(date.getFullYear()) === filter.year
      })
      .map((item) => {
        const date = new Date(item.timestamp as string)
        return String(date.getMonth() + 1).padStart(2, "0")
      })
  
    return Array.from(new Set(months)).sort((a, b) => Number(a) - Number(b))
  }, [syslogLogs, filter?.year])
  
  const dataDateAt = useMemo(() => {
    const dates = syslogLogs
      .filter((item) => item.timestamp)
      .filter((item) => {
        const date = new Date(item.timestamp as string)
  
        const year = String(date.getFullYear())
        const month = String(date.getMonth() + 1).padStart(2, "0")
  
        if (filter?.year && year !== filter.year) return false
        if (filter?.month && month !== filter.month) return false
  
        return true
      })
      .map((item) => {
        const date = new Date(item.timestamp as string)
        return String(date.getDate()).padStart(2, "0")
      })
  
    return Array.from(new Set(dates)).sort((a, b) => Number(a) - Number(b))
  }, [syslogLogs, filter?.year, filter?.month])

  return {
    syslogLogs,
    totalData,
    isLoadingSyslog,
    errorSyslog,
  
    dataDateAt,
    dataMonthAt,
    dataYearAt,
  
    totalLogs,
    totalAllow,
    totalDeny,
    totalBlockDrop,
    totalAlarm,
    allowRate,
    latestUpdate,
    mostActiveLogType,
  
    logTypeSummary,
    overviewTimeline,
    latestLogs,
    recentActivity,
  }
};

export default useSyslogLogs;