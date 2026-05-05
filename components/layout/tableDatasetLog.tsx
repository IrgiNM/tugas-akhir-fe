"use client"
import { dataResultDetection } from '@/lib/data/dataResultDetection'
import DataLogDatasetFunction from '@/lib/function/dataLogDatasetFunction'
import { dataNetworkTrafficFunction } from '@/lib/function/dataNetworkTrafficFunction'
import { ClickType } from '@/type/clickType'
import { dataLog } from '@/type/dataLogType'
import React, { useState } from 'react'

const TableDatasetLog = ({click1}: ClickType) => {
  const [data, setData] = useState<dataLog[]>(dataResultDetection)
  const {dataLogDataset} = DataLogDatasetFunction()
  return (
    <>
        <div className="w-full h-[78%] flex flex-col gap-2">
            {/* WRAPPER SCROLL X + Y */}
            <div className="w-full h-full overflow-auto relative">

                {/* HEADER (STICKY) */}
                <div className="sticky top-0 z-10 flex flex-row items-center justify-between gap-2 p-3 rounded-md border border-white bg-[#10101b] mb-3 min-w-max">

                    <p className="w-[60px] border border-gray-700 rounded-md p-3 flex justify-center">ID</p>
                    <p className="w-[140px] border border-gray-700 rounded-md p-3 flex justify-center">UID</p>
                    <p className="w-[160px] border border-gray-700 rounded-md p-3 flex justify-center">TS</p>

                    <p className="w-[140px] border border-gray-700 rounded-md p-3 flex justify-center">IP ORIG</p>
                    <p className="w-[140px] border border-gray-700 rounded-md p-3 flex justify-center">IP RESP</p>

                    <p className="w-[100px] border border-gray-700 rounded-md p-3 flex justify-center">PORT ORIG</p>
                    <p className="w-[100px] border border-gray-700 rounded-md p-3 flex justify-center">PORT RESP</p>

                    <p className="w-[100px] border border-gray-700 rounded-md p-3 flex justify-center">PROTO</p>
                    <p className="w-[120px] border border-gray-700 rounded-md p-3 flex justify-center">SERVICE</p>

                    <p className="w-[120px] border border-gray-700 rounded-md p-3 flex justify-center">DURATION</p>
                    <p className="w-[120px] border border-gray-700 rounded-md p-3 flex justify-center">ORIG BYTES</p>
                    <p className="w-[120px] border border-gray-700 rounded-md p-3 flex justify-center">RESP BYTES</p>

                    <p className="w-[120px] border border-gray-700 rounded-md p-3 flex justify-center">CONN STATE</p>

                    <p className="w-[120px] border border-gray-700 rounded-md p-3 flex justify-center">LOCAL ORIG</p>
                    <p className="w-[120px] border border-gray-700 rounded-md p-3 flex justify-center">LOCAL RESP</p>

                    <p className="w-[100px] border border-gray-700 rounded-md p-3 flex justify-center">HISTORY</p>
                    <p className="w-[140px] border border-gray-700 rounded-md p-3 flex justify-center">TUNNEL</p>

                    <p className="w-[120px] border border-gray-700 rounded-md p-3 flex justify-center">LABEL</p>
                    <p className="w-[160px] border border-gray-700 rounded-md p-3 flex justify-center">DETAIL LABEL</p>
                    <p className="w-[200px] border border-gray-700 rounded-md p-3 flex justify-center">CREATED AT</p>

                </div>

                {/* BODY */}
                <div className="flex flex-col gap-3 bg-[#10101b] rounded-lg pt-[10px] pb-[50px] min-w-max">

                    {dataLogDataset.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-row items-center justify-between gap-2 p-3 rounded-md border border-gray-700 min-w-max"
                        >

                            <p className="w-[60px] flex justify-center">{item.id}</p>
                            <p className="w-[140px] flex justify-center">{item.uid}</p>

                            <p className="w-[160px] flex justify-center">
                                {item.ts ? new Date(item.ts).toLocaleString() : "-"}
                            </p>

                            <p className="w-[140px] flex justify-center">{item.id_orig_h}</p>
                            <p className="w-[140px] flex justify-center">{item.id_resp_h}</p>

                            <p className="w-[100px] flex justify-center">{item.id_orig_p}</p>
                            <p className="w-[100px] flex justify-center">{item.id_resp_p}</p>

                            <p className="w-[100px] flex justify-center">{item.proto}</p>
                            <p className="w-[120px] flex justify-center">{item.service}</p>

                            <p className="w-[120px] flex justify-center">{item.duration}</p>
                            <p className="w-[120px] flex justify-center">{item.orig_bytes}</p>
                            <p className="w-[120px] flex justify-center">{item.resp_bytes}</p>

                            <p className="w-[120px] flex justify-center">{item.conn_state}</p>

                            <p className="w-[120px] flex justify-center">{item.local_orig}</p>
                            <p className="w-[120px] flex justify-center">{item.local_resp}</p>

                            <p className="w-[100px] flex justify-center">{item.history}</p>
                            <p className="w-[140px] flex justify-center">{item.tunnel_parents}</p>

                            <p className="w-[120px] flex justify-center">{item.label}</p>
                            <p className="w-[160px] flex justify-center">{item.detailed_label}</p>

                            <p className="w-[200px] flex justify-center">
                                {new Date(item.created_at).toLocaleString()}
                            </p>

                        </div>
                    ))}

                    {dataLogDataset.length === 0 && (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            <p className="text-gray-500">Tidak ada data log yang tersedia.</p>
                            <button
                                onClick={click1}
                                className="p-2 px-4 font-bold border border-white rounded-md mt-3 hover:bg-white hover:text-black"
                            >
                                Get Log
                            </button>
                        </div>
                    )}

                </div>

            </div>
        </div>
    </>
  )
}

export default TableDatasetLog