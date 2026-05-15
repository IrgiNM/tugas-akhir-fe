import React, { useEffect, useState } from 'react'
import { getDataTopReportsDay, getDataTopReportsAll, getLogDataset, getDataTopReportsMonth, getDataTopReportsYear } from './api';
import { dataLogDatasetType } from '@/type/dataLogDatasetType';
import { dataTopReportsType } from '@/type/dataTopReportsType';
import { jenisTopType } from '@/type/jenisTopType';
import { nameDataTopType } from '@/type/nameDataTopType';

const DataTopReportsFunction = (selectedDate?: string, selectedMonth?: string, selectedYear?: string) => {
    const [dataTopReportsAll, setDataTopReportsAll] = useState<dataTopReportsType[]>([])
    const [dataTopReportsYear, setDataTopReportsYear] = useState<dataTopReportsType[]>([])
    const [dataTopReportsMonth, setDataTopReportsMonth] = useState<dataTopReportsType[]>([])
    const [dataTopReports, setDataTopReports] = useState<dataTopReportsType[]>([])
    const [dataYearAt, setDataYearAt] = useState<string[]>([])
    const [dataMonthAt, setDataMonthAt] = useState<string[]>([])
    const [dataDateAt, setDataDateAt] = useState<string[]>([])
    const [dataDatePerMonth, setDataDatePerMonth] = useState<string[]>([])
    const [dataTopBlockedPerMonth, setDataTopBlockedPerMonth] = useState<string[]>([])
    const [dataNamePerMonth, setDataNamePerMonth] = useState<string[]>([])
    const [dataStatistikPerMonth, setDataStatistikPerMonth] = useState<{ time: string; [key: string]: number | string }[]>([])
    const [dataJenisAndCountTop, setDataJenisAndCountTop] = useState<jenisTopType[]>([])
    const [dataJenisTop, setDataJenisTop] = useState<string[]>([])
    const [dataNameTop, setDataNameTop] = useState<string[]>([])
    const [dataNameCountTop, setDataNameCountTop] = useState<nameDataTopType[]>([])


    // FETCH DATA TOP REPORTS All
    useEffect(() => {
        const fetch = async () => {
            try {
                setDataTopReportsAll([])
                const res = await getDataTopReportsAll()
                if (res.status === 200) {
                    setDataTopReportsAll(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetch()
    }, [])
    
    // FETCH DATA TOP REPORTS THIS DATE
    useEffect(() => {
        const fetch = async () => {
            try {
                setDataTopReports([])
                const dateToUse = new Date().toISOString().split('T')[0]
                // jangan fetch kalau tanggal belum ada
                if (!dateToUse) return
                const res = await getDataTopReportsDay(dateToUse)
                if (res.status === 200) {
                    setDataTopReports(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetch()
    }, [])
    
    // FETCH DATA TOP REPORTS DATE
    useEffect(() => {
        const fetch = async () => {
            try {
                setDataTopReports([])
                const dateToUse = `${selectedYear}-${selectedMonth}-${selectedDate}`;
                // jangan fetch kalau tanggal belum ada
                if (!dateToUse) return
                const res = await getDataTopReportsDay(dateToUse)
                if (res.status === 200) {
                    setDataTopReports(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetch()
    }, [selectedDate,selectedMonth,selectedYear])
    
    // FETCH DATA TOP REPORTS THIS MONTH
    useEffect(() => {
        const fetch = async () => {
            try {
                setDataTopReportsMonth([])
                const dateToUse = new Date().toISOString().split('T')[0].split('-')[1];
                // jangan fetch kalau tanggal belum ada
                if (!dateToUse) return
                const res = await getDataTopReportsMonth(dateToUse)
                if (res.status === 200) {
                    setDataTopReportsMonth(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetch()
    }, [])
    
    // FETCH DATA TOP REPORTS MONTH
    useEffect(() => {
        const fetch = async () => {
            try {
                setDataTopReportsMonth([])
                const dateToUse = selectedMonth
                // jangan fetch kalau tanggal belum ada
                if (!dateToUse) return
                const res = await getDataTopReportsMonth(dateToUse)
                if (res.status === 200) {
                    setDataTopReportsMonth(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetch()
    }, [selectedMonth])
    
    // FETCH DATA TOP REPORTS THIS YEAR
    useEffect(() => {
        const fetch = async () => {
            try {
                setDataTopReportsYear([])
                const dateToUse = new Date().toISOString().split('T')[0].split('-')[0];
                // jangan fetch kalau tanggal belum ada
                if (!dateToUse) return
                const res = await getDataTopReportsYear(dateToUse)
                if (res.status === 200) {
                    setDataTopReportsYear(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetch()
    }, [])
    
    // FETCH DATA TOP REPORTS YEAR
    useEffect(() => {
        const fetch = async () => {
            try {
                setDataTopReportsYear([])
                const dateToUse = selectedYear
                // jangan fetch kalau tanggal belum ada
                if (!dateToUse) return
                const res = await getDataTopReportsYear(dateToUse)
                if (res.status === 200) {
                    setDataTopReportsYear(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetch()
    }, [selectedYear])

    // EXTRACT JENIS TOP REPORTS
    useEffect(() => {
        const uniqueViewNames = [...new Set(
            dataTopReports.map((item)=>item.view_name)
        )]
        setDataJenisTop(uniqueViewNames)
    }, [dataTopReports])

    useEffect(() => {
        const result = dataJenisTop.map((view_name) => {
            const count = dataTopReports.filter(
                (item) => item.view_name === view_name
            ).length
    
            return {
                view_name,
                count
            }
        })
    
        setDataJenisAndCountTop(result)
    }, [dataJenisTop, dataTopReports])
    
    // EXTRACT PER CONNECTIONS
    useEffect(() => {
        const uniqueViewNames = [...new Set(
            dataTopReports.map((item)=>item.name)
        )]
        setDataNameTop(uniqueViewNames)
    }, [dataTopReports])

    useEffect(() => {
        const result = dataNameTop.map((name) => {
            // const total = dataTopReports.filter(
            //     (item) => item.name === name
            // ).length

            const view_name = dataTopReports.find(
                (item) => item.name === name
            )?.view_name || ""

            const total = dataTopReports.find(
                (item) => item.name === name
            )?.connections || 0
    
            return {
                view_name,
                name,
                total
            }
        })
    
        setDataNameCountTop(result)
    }, [dataNameTop, dataTopReports])

    // EXTRACT CREATED AT
    useEffect(() => {
        const dates = Array.from(
            new Set(
                dataTopReportsMonth
                    .filter((item) => item.fetched_at)
                    .map((item) => item.fetched_at.split("T")[0].split('-')[2])
            )
        );
        const months = Array.from(
            new Set(
                dataTopReportsYear
                    .filter((item) => item.fetched_at)
                    .map((item) => item.fetched_at.split("T")[0].split('-')[1])
            )
        );
        const years = Array.from(
            new Set(
                dataTopReportsAll
                    .filter((item) => item.fetched_at)
                    .map((item) => item.fetched_at.split("T")[0].split('-')[0])
            )
        );
        setDataDateAt(dates);
        setDataMonthAt(months);
        setDataYearAt(years);
    }, [dataTopReportsAll,dataTopReportsMonth,dataTopReportsYear]);

    // EXTRACT STATISTIK MONTH
    useEffect(() => {
        // AMBIL SEMUA DATE
        const dates = Array.from(
            new Set(
                dataTopReportsMonth
                    .filter((item) => item.fetched_at)
                    .map((item) => item.fetched_at.split("T")[0])
            )
        );
        // AMBIL SEMUA VIEW NAME
        const topBlocked = Array.from(
            new Set(
                dataTopReportsMonth
                    .filter((item) => item.view_name)
                    .map((item) => item.view_name)
            )
        );
        // AMBIL SEMUA NAME
        const Names = Array.from(
            new Set(
                dataTopReportsMonth
                    .filter((item) => item.name)
                    .map((item) => item.name)
            )
        );
        // SET STATE
        setDataDatePerMonth(dates);
        setDataTopBlockedPerMonth(topBlocked);
        setDataNamePerMonth(Names);
        // =========================
        // FORMAT DATA UNTUK CHART
        // =========================
        const dataMalware = dates.flatMap((date) => {

            // ambil semua view_name unik di tanggal ini
            const viewNames = Array.from(
                new Set(
                    dataTopReportsMonth
                        .filter(
                            (item) =>
                                item.fetched_at?.split("T")[0] === date
                        )
                        .map((item) => item.view_name)
                )
            );
        
            // buat data per view_name
            return viewNames.map((viewName) => {
        
                // filter berdasarkan tanggal + view_name
                const filteredData = dataTopReportsMonth.filter(
                    (item) =>
                        item.fetched_at?.split("T")[0] === date &&
                        item.view_name === viewName
                );
        
                // object awal
                const result: {
                    time: string;
                    view_name: string;
                    [key: string]: number | string;
                } = {
                    time: date,
                    view_name: viewName,
                };
        
                // isi dynamic category berdasarkan name
                filteredData.forEach((item) => {
                    result[item.name] = Number(item.connections || 0);
                });
        
                return result;
            });
        });
        console.log(dataMalware);
        // kalau mau simpan ke state
        setDataStatistikPerMonth(dataMalware);
    }, [dataTopReportsMonth, selectedMonth, selectedYear]);

    useEffect(()=>{
        console.error('data created at', dataDateAt);
        console.error('data bytes', dataTopReports[0]?.bytes);
    }, [dataDateAt,dataTopReports])

    return {
        dataTopReportsAll,
        dataTopReportsYear,
        dataTopReportsMonth,
        dataTopReports,
        dataDateAt,
        dataMonthAt,
        dataYearAt,
        dataJenisTop,
        dataNameCountTop,
        dataJenisAndCountTop,
        dataStatistikPerMonth,
        dataNamePerMonth,
    }
}

export default DataTopReportsFunction