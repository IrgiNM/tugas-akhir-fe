'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { backupDatabase, getDatabaseInfo } from '@/lib/function/api'

type TableInfo = {
  table_name: string
  records: number
}

type DatabaseInfo = {
  status: string
  engine: string
  total_tables: number
  total_records: number
  database_size: string
  backup_format: string
  checked_at: string
  tables: TableInfo[]
}

const BackupPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingInfo, setIsLoadingInfo] = useState(false)
  const [databaseInfo, setDatabaseInfo] = useState<DatabaseInfo | null>(null)

  const fetchDatabaseInfo = async () => {
    setIsLoadingInfo(true)

    try {
      const response = await getDatabaseInfo()
      setDatabaseInfo(response.data)
    } catch (error) {
      console.error(error)
      setDatabaseInfo(null)
    } finally {
      setIsLoadingInfo(false)
    }
  }

  useEffect(() => {
    fetchDatabaseInfo()
  }, [])

  const handleBackup = async () => {
    setIsLoading(true)

    try {
      const response = await backupDatabase()

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      )

      const link = document.createElement('a')
      link.href = url

      const filename = `backup_${new Date()
        .toISOString()
        .replace(/[:.]/g, '-')}.dump`

      link.setAttribute('download', filename)

      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
      alert('Gagal melakukan backup database.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex flex-col items-center gap-5 w-full min-h-screen px-6 md:px-12 pb-10">
      <div className="w-full rounded-2xl mt-[180px] border border-[#353b6c] bg-gradient-to-br from-[#111c45] to-[#120b2f] p-6">
        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5 mb-6">
          <div>
            <p className="font-bold text-[24px]">
              Backup Database
            </p>
            <p className="text-gray-400 mt-2">
              Lihat informasi database yang terhubung dan lakukan backup data sistem.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={fetchDatabaseInfo}
              disabled={isLoadingInfo}
              className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-[#353b6c] bg-[#14122d] hover:bg-[#353b6c] transition-all duration-200 disabled:opacity-50"
            >
              <p className="font-bold">
                {isLoadingInfo ? 'Loading...' : 'Refresh Info'}
              </p>
            </button>

            <button
              onClick={handleBackup}
              disabled={isLoading}
              className="flex items-center justify-center gap-4 px-8 py-3 rounded-xl bg-gradient-to-b from-[#2563eb] to-[#1e40af] border border-blue-500 shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
            >
              <p className="font-bold">
                {isLoading ? 'Backing Up...' : 'Backup Now'}
              </p>
              <Image src="/download.png" alt="Download" width={18} height={18} />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#353b6c] bg-[#0c0b20] p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div>
              <p className="font-semibold text-white">Database Information</p>
              <p className="text-gray-500 text-sm mt-1">
                Informasi ini diambil langsung dari backend yang sedang terhubung ke database.
              </p>
            </div>

            <div
              className={`
                px-4 py-2 rounded-full border text-sm font-bold w-fit
                ${
                  databaseInfo?.status === 'connected'
                    ? 'border-green-500/40 bg-green-500/10 text-green-400'
                    : 'border-red-500/40 bg-red-500/10 text-red-400'
                }
              `}
            >
              {databaseInfo?.status === 'connected' ? 'Connected' : 'Disconnected'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-xl border border-[#353b6c] bg-[#14122d]">
              <p className="text-gray-400 text-sm">Database Engine</p>
              <p className="text-[24px] font-bold mt-1 capitalize">
                {databaseInfo?.engine || '-'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#353b6c] bg-[#14122d]">
              <p className="text-gray-400 text-sm">Total Tables</p>
              <p className="text-[24px] font-bold mt-1">
                {databaseInfo?.total_tables ?? '-'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#353b6c] bg-[#14122d]">
              <p className="text-gray-400 text-sm">Total Records</p>
              <p className="text-[24px] font-bold mt-1">
                {databaseInfo?.total_records?.toLocaleString('id-ID') ?? '-'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#353b6c] bg-[#14122d]">
              <p className="text-gray-400 text-sm">Estimated Size</p>
              <p className="text-[24px] font-bold mt-1">
                {databaseInfo?.database_size || '-'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#353b6c] bg-[#14122d]">
              <p className="text-gray-400 text-sm">Backup Format</p>
              <p className="text-[24px] font-bold mt-1">
                {databaseInfo?.backup_format || '.dump'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#353b6c] bg-[#14122d]">
              <p className="text-gray-400 text-sm">Last Checked</p>
              <p className="text-[16px] font-bold mt-2">
                {databaseInfo?.checked_at || '-'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 mb-5">
            <p className="text-yellow-300 text-sm">
              Informasi sensitif seperti host, username, password, dan connection string database tidak ditampilkan demi keamanan.
            </p>
          </div>

          <div className="rounded-xl border border-[#353b6c] bg-[#08071a] p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-bold text-white">Table Details</p>
                <p className="text-gray-500 text-sm">
                  Daftar tabel dan jumlah data di dalam database.
                </p>
              </div>
            </div>

            {isLoadingInfo ? (
              <div className="p-5 text-center text-gray-400">
                Mengambil informasi database...
              </div>
            ) : !databaseInfo?.tables || databaseInfo.tables.length === 0 ? (
              <div className="p-5 text-center text-gray-400">
                Belum ada informasi tabel.
              </div>
            ) : (
              <div className="max-h-[320px] overflow-auto">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-[#08071a]">
                    <tr className="border-b border-[#353b6c]">
                      <th className="py-3 px-3 text-gray-400 text-sm">No</th>
                      <th className="py-3 px-3 text-gray-400 text-sm">Table Name</th>
                      <th className="py-3 px-3 text-gray-400 text-sm text-right">Records</th>
                    </tr>
                  </thead>

                  <tbody>
                    {databaseInfo.tables.map((table, index) => (
                      <tr
                        key={table.table_name}
                        className="border-b border-[#353b6c]/60 hover:bg-[#14122d]"
                      >
                        <td className="py-3 px-3 text-gray-400">
                          {index + 1}
                        </td>
                        <td className="py-3 px-3 font-semibold">
                          {table.table_name}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {table.records.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BackupPage