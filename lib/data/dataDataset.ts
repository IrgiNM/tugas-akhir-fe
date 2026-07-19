'use client'

import { useEffect, useState } from 'react'
import {
  createSyslogDataset,
  downloadSyslogDataset,
  getSyslogDatasetList,
} from '@/lib/function/api'
import useSyslogLogs from '@/lib/data/dataSyslogLogs'

export type DatasetItem = {
  file_name: string
  file_path?: string
  date?: string
  total_rows?: number
  size_bytes?: number
  size_mb?: number
  created_at?: string
  modified_at?: string
  download_url?: string
}

export const useDataDataset = () => {
  const today = new Date()

  const [datasets, setDatasets] = useState<DatasetItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [selectedDateModal, setSelectedDateModal] = useState(false)

  const [pickDateTop, setPickDateTop] = useState<string>(
    String(today.getDate()).padStart(2, '0')
  )

  const [pickMonthTop, setPickMonthTop] = useState<string>(
    String(today.getMonth() + 1).padStart(2, '0')
  )

  const [pickYearTop, setPickYearTop] = useState<string>(
    String(today.getFullYear())
  )

  const selectedFullDate = `${pickYearTop}-${pickMonthTop}-${pickDateTop}`

  // INI YANG DIPAKAI UNTUK POPUP TANGGAL
  // SUMBERNYA DARI DATA SYSLOG, SAMA SEPERTI SECURITY EVENT
  const {
    dataDateAt,
    dataMonthAt,
    dataYearAt,
  } = useSyslogLogs({
    year: pickYearTop,
    month: pickMonthTop,
  })

  const fetchDatasets = async () => {
    setIsLoading(true)
    setError('')

    try {
      const res = await getSyslogDatasetList()

      if (res.status === 200) {
        setDatasets(res.data.data || [])
      }
    } catch (err) {
      console.error(err)
      setError('Gagal mengambil daftar dataset.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateDataset = async () => {
    setIsLoading(true)
    setMessage('')
    setError('')

    try {
      const res = await createSyslogDataset(selectedFullDate)

      if (res.status === 200) {
        setMessage(
          `Dataset berhasil dibuat: ${res.data.file_name} (${res.data.total_rows} data)`
        )

        await fetchDatasets()
      }
    } catch (err: any) {
      console.error(err)
      setError(
        err?.response?.data?.message ||
          'Gagal membuat dataset. Periksa kembali backend.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadDataset = (item: DatasetItem) => {
    setIsLoading(true)
    setMessage("")
    setError("")
  
    try {
      if (!item.file_path) {
        throw new Error("URL file dataset tidak ditemukan.")
      }
  
      const berhasil = downloadSyslogDataset(
        item.file_path,
        item.file_name
      )
  
      if (!berhasil) {
        throw new Error("Gagal membuka file dataset.")
      }
  
      const pesan = `Permintaan download dijalankan: ${item.file_name}`
  
      setMessage(pesan)
      alert(pesan)
    } catch (err: unknown) {
      console.error("Download dataset error:", err)
  
      const pesanError =
        err instanceof Error
          ? err.message
          : "Gagal mengunduh dataset."
  
      setError(pesanError)
      alert(pesanError)
    } finally {
      setIsLoading(false)
    }
  }

  const formatFileSize = (item: DatasetItem) => {
    if (item.size_mb !== undefined) {
      return `${item.size_mb} MB`
    }

    if (item.size_bytes !== undefined) {
      const mb = item.size_bytes / (1024 * 1024)
      return `${mb.toFixed(2)} MB`
    }

    return '-'
  }

  const formatDateTime = (value?: string) => {
    if (!value) return '-'

    try {
      return new Date(value).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    } catch {
      return value
    }
  }

  useEffect(() => {
    fetchDatasets()
  }, [])

  return {
    datasets,
    isLoading,
    message,
    error,

    selectedDateModal,
    setSelectedDateModal,

    pickDateTop,
    pickMonthTop,
    pickYearTop,

    setPickDateTop,
    setPickMonthTop,
    setPickYearTop,

    selectedFullDate,

    // DATA POPUP TANGGAL DARI SYSLOG
    dataDateAt,
    dataMonthAt,
    dataYearAt,

    fetchDatasets,
    handleCreateDataset,
    handleDownloadDataset,
    formatFileSize,
    formatDateTime,
  }
}