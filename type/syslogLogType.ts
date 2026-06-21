export type SyslogActionType = "Allow" | "Deny" | "Block" | "Drop" | "Unknown"

export type SyslogLogType = {
  id: number
  timestamp: string | null
  device_name: string | null
  device_id: string | null
  device_time: string | null

  log_type: string
  process_id: number | null
  msg_id: string | null

  action: SyslogActionType
  from_zone: string | null
  to_zone: string | null

  protocol: string | null

  src_ip: string | null
  dst_ip: string | null

  src_port: number | null
  dst_port: number | null

  geo_src: string | null
  geo_dst: string | null

  policy: string | null
  message: string | null

  app_name: string | null
  cat_name: string | null
  dstname: string | null

  extra_data: Record<string, any>
  raw_log: string
  created_at: string
}

export type SyslogLogListResponseType = {
  count: number
  data: SyslogLogType[]
}

export type SyslogLogFilterType = {
    log_type?: string
    action?: string
    src_ip?: string
    dst_ip?: string
    msg_id?: string
  
    date?: string
    month?: string
    year?: string
  }