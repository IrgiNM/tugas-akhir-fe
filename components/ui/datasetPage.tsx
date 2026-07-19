'use client'

import { useDataDataset } from '@/lib/data/dataDataset'
import { ClickType } from '@/type/clickType'
import Image from 'next/image'


const DatasetPage = ({ click1 }: ClickType) => {

    const {
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
      
        dataDateAt,
        dataMonthAt,
        dataYearAt,
      
        fetchDatasets,
        handleCreateDataset,
        handleDownloadDataset,
        formatFileSize,
        formatDateTime,
      } = useDataDataset()
  

  return (
    <>
      <div className="relative flex min-h-screen w-full flex-col gap-6 px-8 py-8 text-white mt-[135px]">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-3xl border border-[#26345f] bg-gradient-to-br from-[#101936] via-[#121f49] to-[#081024] p-8 shadow-2xl">
          <div className="absolute -right-20 -top-20 h-[260px] w-[260px] rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-[260px] w-[260px] rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              <span className="h-2 w-2 rounded-full bg-cyan-300" />
              Syslog Dataset Management
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Dataset Syslog untuk Machine Learning
            </h1>

            <p className="max-w-3xl text-sm leading-6 text-slate-300">
              Halaman ini digunakan untuk melihat informasi file dataset CSV
              yang sudah dibuat, membuat dataset baru berdasarkan tanggal
              tertentu, dan mengunduh file dataset untuk kebutuhan preprocessing
              atau machine learning.
            </p>
          </div>
        </div>

        {/* SUMMARY CARD */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-[#26345f] bg-[#0d1733] p-6 shadow-lg">
            <p className="text-sm text-slate-400">Total Dataset</p>
            <h2 className="mt-2 text-3xl font-bold">{datasets.length}</h2>
            <p className="mt-2 text-xs text-slate-500">
              File CSV yang tersedia di folder dataset.
            </p>
          </div>

          <div className="rounded-2xl border border-[#26345f] bg-[#0d1733] p-6 shadow-lg">
            <p className="text-sm text-slate-400">Dataset Terbaru</p>
            <h2 className="mt-2 truncate text-lg font-bold">
              {datasets.length > 0 ? datasets[0].file_name : '-'}
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              File dataset terakhir yang ditemukan.
            </p>
          </div>

          <div className="rounded-2xl border border-[#26345f] bg-[#0d1733] p-6 shadow-lg">
            <p className="text-sm text-slate-400">Tanggal Dataset Terbaru</p>
            <h2 className="mt-2 text-lg font-bold">
              {datasets.length > 0 ? datasets[0].date || '-' : '-'}
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              Berdasarkan metadata file dataset.
            </p>
          </div>
        </div>

        {/* ACTION PANEL */}
        <div className="rounded-3xl border border-[#26345f] bg-[#0b1430] p-6 shadow-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-bold">Create Dataset Manual</h2>
              <p className="mt-1 text-sm text-slate-400">
                Pilih tanggal syslog yang ingin dijadikan dataset CSV. Jika
                tanggal dikosongkan, backend akan menggunakan default dari
                service.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
            onClick={() => setSelectedDateModal(true)}
            className="flex h-[45px] items-center justify-between gap-4 rounded-xl border border-[#354675] bg-[#081024] px-4 text-sm text-white transition hover:bg-[#111c45]"
            >
                <div className="text-left">
                    <p className="text-[10px] text-slate-500">Selected Date</p>
                    <p className="font-bold">
                    {selectedFullDate}
                    </p>
                </div>

                <Image src="/arrow-icon.png" alt="Arrow" width={8} height={8} />
            </button>

              <button
                onClick={handleCreateDataset}
                disabled={isLoading}
                className="h-[45px] rounded-xl border border-cyan-400 bg-cyan-400 px-5 text-sm font-bold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                + Create Dataset
              </button>

              <button
                onClick={fetchDatasets}
                disabled={isLoading}
                className="h-[45px] rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-bold text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
          </div>

          {message && (
            <div className="mt-5 rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm text-green-200">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* DATASET LIST */}
        <div className="rounded-3xl border border-[#26345f] bg-[#0b1430] shadow-xl">
          <div className="flex items-center justify-between border-b border-[#26345f] p-6">
            <div>
              <h2 className="text-xl font-bold">Daftar Dataset CSV</h2>
              <p className="mt-1 text-sm text-slate-400">
                File dataset yang sudah tersimpan di server lokal.
              </p>
            </div>
          </div>

          {datasets.length === 0 && !isLoading ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
                📄
              </div>
              <h3 className="text-lg font-bold">Belum ada dataset</h3>
              <p className="max-w-md text-sm text-slate-400">
                Dataset CSV belum ditemukan. Klik tombol Create Dataset untuk
                membuat file dataset baru dari data syslog.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-[#26345f] bg-[#081024] text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-6 py-4">No</th>
                    <th className="px-6 py-4">Nama File</th>
                    <th className="px-6 py-4">Tanggal Dataset</th>
                    <th className="px-6 py-4">Total Row</th>
                    <th className="px-6 py-4">Ukuran</th>
                    <th className="px-6 py-4">Modified</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {datasets.map((item, index) => (
                    <tr
                      key={`${item.file_name}-${index}`}
                      className="border-b border-[#26345f]/70 transition hover:bg-white/[0.03]"
                    >
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">
                            {item.file_name}
                          </span>
                          <span className="mt-1 max-w-[320px] truncate text-xs text-slate-500">
                            {item.file_path || '-'}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-300">
                        {item.date || '-'}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-300">
                        {item.total_rows !== undefined
                          ? item.total_rows.toLocaleString('id-ID')
                          : '-'}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-300">
                        {formatFileSize(item)}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-300">
                        {formatDateTime(item.modified_at || item.created_at)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {/* <button
                            onClick={() => handleDownloadDataset(item)}
                            disabled={isLoading}
                            className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Download
                          </button> */}
                          <a
                            href={item.file_path || '#'}
                            className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Download
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* LOADING POPUP */}
        {isLoading && (
          <>
            <div className="fixed left-0 top-0 z-[99] h-screen w-screen bg-black/80" />

            <div className="fixed left-0 top-0 z-[100] flex h-screen w-screen items-center justify-center">
              <div className="flex min-h-[180px] w-[360px] flex-col items-center justify-center gap-4 rounded-2xl border border-[#26345f] bg-[#0b1430] shadow-2xl">
                <Image
                  src="/Loading.png"
                  alt="Loading"
                  width={42}
                  height={42}
                  className="animate-spin"
                />
                <p className="text-sm font-semibold text-white">Memproses...</p>
                <p className="text-xs text-slate-400">
                  Mohon tunggu, sistem sedang memuat dataset.
                </p>
              </div>
            </div>
          </>
        )}

        {/* MODAL DATE DARI DATA SYSLOG */}
        {selectedDateModal && (
        <>
            <div className="fixed inset-0 z-[70] bg-[#0c0b20]/90 backdrop-blur-sm" />

            <div className="fixed inset-0 z-[80] flex justify-center items-start gap-3 pt-[170px] px-5">
            <div className="w-full max-w-[620px] rounded-2xl border border-[#353b6c] bg-[#0c0b20] p-7 shadow-2xl">
                <p className="font-bold text-[24px]">Available Syslog Dates</p>

                <p className="text-gray-500 mt-1 mb-6">
                Pilih tanggal syslog yang tersedia untuk dibuat menjadi dataset CSV.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <button className="w-full p-3 rounded-xl border border-blue-500 bg-gradient-to-b from-[#2563eb] to-[#1e40af] font-bold mb-3">
                    {pickYearTop || 'Year'}
                    </button>

                    <div className="h-[180px] overflow-auto scrollbar-hide space-y-2">
                    {dataYearAt.length > 0 ? (
                        dataYearAt.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                            setPickYearTop(item)
                            }}
                            className="w-full p-3 rounded-lg border border-[#353b6c] bg-[#14122d] hover:bg-[#353b6c] transition-all duration-200"
                        >
                            {item}
                        </button>
                        ))
                    ) : (
                        <div className="rounded-lg border border-[#353b6c] bg-[#14122d] p-3 text-center text-sm text-gray-500">
                        Tidak ada tahun
                        </div>
                    )}
                    </div>
                </div>

                <div>
                    <button className="w-full p-3 rounded-xl border border-blue-500 bg-gradient-to-b from-[#2563eb] to-[#1e40af] font-bold mb-3">
                    {pickMonthTop || 'Month'}
                    </button>

                    <div className="h-[180px] overflow-auto scrollbar-hide space-y-2">
                    {dataMonthAt.length > 0 ? (
                        dataMonthAt.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                            setPickMonthTop(item)
                            }}
                            className="w-full p-3 rounded-lg border border-[#353b6c] bg-[#14122d] hover:bg-[#353b6c] transition-all duration-200"
                        >
                            {item}
                        </button>
                        ))
                    ) : (
                        <div className="rounded-lg border border-[#353b6c] bg-[#14122d] p-3 text-center text-sm text-gray-500">
                        Tidak ada bulan
                        </div>
                    )}
                    </div>
                </div>

                <div>
                    <button className="w-full p-3 rounded-xl border border-blue-500 bg-gradient-to-b from-[#2563eb] to-[#1e40af] font-bold mb-3">
                    {pickDateTop || 'Date'}
                    </button>

                    <div className="h-[180px] overflow-auto scrollbar-hide space-y-2">
                    {dataDateAt.length > 0 ? (
                        dataDateAt.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                            setPickDateTop(item)
                            setSelectedDateModal(false)
                            }}
                            className="w-full p-3 rounded-lg border border-[#353b6c] bg-[#14122d] hover:bg-[#353b6c] transition-all duration-200"
                        >
                            {item}
                        </button>
                        ))
                    ) : (
                        <div className="rounded-lg border border-[#353b6c] bg-[#14122d] p-3 text-center text-sm text-gray-500">
                        Tidak ada tanggal
                        </div>
                    )}
                    </div>
                </div>
                </div>
            </div>

            <button
                onClick={() => setSelectedDateModal(false)}
                className="rounded-xl p-4 border border-[#353b6c] bg-[#0c0b20] hover:bg-[#353b6c] transition-all duration-200"
            >
                <Image src="/close.png" alt="Close" width={12} height={12} />
            </button>
            </div>
        </>
        )}
      </div>
    </>
  )
}

export default DatasetPage