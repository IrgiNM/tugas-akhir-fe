import { getLogCSV, getLogWatchguard, runDetection } from '@/lib/function/api'
import DataLogDatasetFunction from '@/lib/data/dataLogDatasetFunction'
import { dataNetworkTrafficFunction } from '@/lib/data/dataNetworkTrafficFunction'
import { ClickType } from '@/type/clickType'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import CardSummaryGetTopReports from '../layout/cardSummaryGetTopReports'

const GetLogPage = ({click1}: ClickType) => {
    const {dataNerworkTraffic} = dataNetworkTrafficFunction()
    const [isActive, setIsActive] = useState('Top Reports')
    const [isAddCSV, setisAddCSV] = useState(false)
    const [isPickCreatedLog, setisPickCreatedLog] = useState(false)
    const [pickDate, setpickDate] = useState('')
    const {dataCreatedAt} = DataLogDatasetFunction(pickDate)
    const [isLoading, setIsLoading] = useState(false)
    const [isDeteksiMalware, setisDeteksiMalware] = useState(false)
    const [filter, setFilter] = useState('All')
    const limit = [100, 500, 1000, 5000]

    useEffect(()=>{
        console.error('data created at', dataCreatedAt);
    }, [dataCreatedAt]);

    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async () => {
        setIsLoading(true);
        try{
            if (!file) return
    
            const formData = new FormData()
            formData.append("file", file)
    
            const res = await getLogCSV(formData)
    
            if(res.status === 201){
                 console.error('berhasil',res.data);
            }
        }finally{
            setIsLoading(false);
        }
    }

    const handleGetLogWatchguard = async () => {
        setIsLoading(true);
        try{
            const res = await getLogWatchguard()
    
            if(res.status === 200){
                 console.error('berhasil',res.data);
            }
        }finally{
            setIsLoading(false);
        }
    }

    const handleDetectionMalware = async () => {
        setIsLoading(true);
        try{
            const res = await runDetection(pickDate)
            if(res.status === 200){
                console.error('berhasil',res.data);
            }
        }finally{
            setIsLoading(false);
        }
    }
  
    return (
        <>
            <div className='relative flex flex-col items-center gap-5 w-full h-full px-12'>
                {/* <HeadButtonJenisLog pick='get log' click={()=>setisDeteksiMalware(true)} click2={()=>setisPickCreatedLog(true)}/> */}
                {/* <HeadTopReports pick='get log' click={()=>setisDeteksiMalware(true)} click2={()=>setisPickCreatedLog(true)}/> */}
                
                {isActive === 'Top Reports' && (
                    <>
                        <CardSummaryGetTopReports/>
                        {/* <TableTopReports click1={() => setisAddCSV(true)}/> */}
                    </>
                )}

                {/* {dataNerworkTraffic.length > 0 && (
                    <button onClick={()=>{setisAddCSV(true)}} className='absolute w-[200px] h-[1px] rounded-l-full bg-white text-black top-5 right-0 p-5 flex justify-center items-center border-1 border-white hover:text-white hover:border-white hover:bg-black transition duration-200 ease-in-out cursor-pointer'>
                        <p className='font-bold'>+ Add Data</p>
                    </button>
                )} */}
                {isAddCSV && (
                    <>
                        <div className='fixed w-full z-99 h-full bg-black opacity-90'></div>
                        <div className='fixed w-full z-99 h-full top-0 bottom-0 flex justify-center items-center'>
                            <div className='absolute rounded-xl flex flex-col p-10 items justify-center border-1 border-white bg-black'>    
                                {isLoading ? (
                                    <div className='flex flex-col items-center justify-center gap-3'>
                                        <Image src="/Loading.png" alt="Logo" width={37} height={37} className='animate-spin'/>
                                        <p>Progres...</p>
                                    </div>
                                ):(
                                    <>
                                        <p className='text-[20px] font-bold'>Add Data</p>
                                        <p className='mb-7'>masukan atau upload file csv anda</p>
                                        <input className='w-full border-1 flex justify-center items-center p-3 rounded-md opacity-50 hover:opacity-100' 
                                            type="file"
                                            accept=".csv"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        />
                                        <button onClick={()=>{handleUpload()}} className='w-full p-3 rounded-md border-1 border-white text-white font-bold mt-7 hover:bg-white hover:text-black transition-all duration-250'>+ Upload</button>
                                        <div className='w-full h-[.5px] my-5 bg-white opacity-50'/>
                                        <button onClick={()=>{handleGetLogWatchguard()}} className='w-full p-3 rounded-md border-1 border-white text-white font-bold hover:bg-white hover:text-black transition-all duration-250'>+ GET Log Watchguard</button>

                                        <button onClick={()=>{setisAddCSV(false)}} className='w-[35px] h-[35px] bg-black font-bold border-3 border-white rounded-md absolute -top-2 -right-2 hover:bg-white hover:text-black transition-all duration-250'>X</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
                {isPickCreatedLog && (
                    <>
                        <div className='fixed w-full z-99 h-full bg-black opacity-90'></div>
                        <div className='fixed w-full z-99 h-full top-0 bottom-0 flex justify-center items-center'>
                            <div className='absolute rounded-xl flex flex-col p-10 items justify-center border-1 border-white bg-black'>    
                                {isLoading ? (
                                    <div className='flex flex-col items-center justify-center gap-3'>
                                        <Image src="/Loading.png" alt="Logo" width={37} height={37} className='animate-spin'/>
                                        <p>Progres...</p>
                                    </div>
                                ):(
                                    <>
                                        <p className='text-[20px] font-bold'>Pilih Created Log</p>
                                        <p className=''>pilih data tanggal waktu log diambil, berikut data tanggal saat log diambil :</p>

                                        {dataCreatedAt.map((item,index)=>{
                                            return (
                                                <button key={index} onClick={()=>{setpickDate(item),setisPickCreatedLog(false)}} className='w-full p-3 rounded-md border-1 border-white text-white font-bold mt-7 hover:bg-white hover:text-black transition-all duration-250'>{item}</button>
                                            )
                                        })}

                                        <button onClick={()=>{setisPickCreatedLog(false)}} className='w-[35px] h-[35px] bg-black font-bold border-3 border-white rounded-md absolute -top-2 -right-2 hover:bg-white hover:text-black transition-all duration-250'>X</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
                {isDeteksiMalware && (
                    <>
                        <div className='w-screen h-screen bg-black fixed z-11 top-0 left-0 opacity-90'>
                        </div>
                        <div className='fixed z-12 w-full h-full top-0 bottom-0 flex justify-center items-center'>
                            <div className='absolute rounded-xl flex flex-col p-10 items justify-center border-1 border-white bg-black'>    
                                <p className='text-[20px] font-bold'>Deteksi Malware</p>
                                {dataNerworkTraffic.length > 0 ? (
                                    <>
                                    <p className='mb-7'>mau mendeteksi malware sekarang?</p>
                                    <button onClick={()=>{handleDetectionMalware()}} className='w-full p-3 rounded-md border-1 border-white text-white font-bold mt-7 hover:bg-white hover:text-black transition-all duration-250'>Ya</button>
                                    </>
                                ):(
                                    <p>apa yang mau dideteksi kalo data nya gak ada satupun.</p>
                                )}

                                <button onClick={()=>{setisDeteksiMalware(false)}} className='w-[35px] h-[35px] bg-black font-bold border-3 border-white rounded-md absolute -top-2 -right-2 hover:bg-white hover:text-black transition-all duration-250'>X</button>
                            </div>
                        </div>
                    </>
                )}
                {/* POPUP PROSESS */}
                {isLoading && (
                    <>  
                        <div className='w-screen h-screen bg-black fixed z-99 top-0 left-0 opacity-90'>
                            <p>ssd</p>
                        </div>
                        <div className='w-screen h-screen fixed z-99 top-0 left-0 flex items-center justify-center'>
                            <div className='w-[400px] h-[200px] rounded-md flex flex-col gap-3 items-center justify-center'>
                            <Image src="/Loading.png" alt="Logo" width={37} height={37} className='animate-spin'/>
                            <p>Progres...</p>
                            <button onClick={()=>{setIsLoading(false)}} className='mt-[40px] p-2 px-4 border-1 border-white rounded-md font-bold text-[12px] hover:text-black hover:bg-white '>batal</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default GetLogPage