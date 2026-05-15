import React, { useEffect, useState } from 'react'
import { getLogDataset } from './api';
import { dataLogDatasetType } from '@/type/dataLogDatasetType';

const DataLogDatasetFunction = (selectedDate?: string) => {
    const [dataLogDataset, setDataLogDataset] = useState<dataLogDatasetType[]>([])
    const [dataMalwareCount, setDataMalwareCount] = useState<string[]>([])
    const [dataBenignCount, setDataBenignCount] = useState<string[]>([])
    const [dataCreatedAt, setDataCreatedAt] = useState<string[]>([])

    useEffect(() => {
        const fetch = async () => {
            // Kosongkan data sebelumnya sebelum memuat data baru
            setDataLogDataset([]);
    
            const res = await getLogDataset(selectedDate);
    
            if (res.status === 200) {
                setDataLogDataset(res.data);
            }
        };
    
        fetch();
    }, [selectedDate]);

    useEffect(() => {
        const malwareLabels = dataLogDataset
            .map((item) => item.label)
            .filter((label) => label && label !== "Benign");
    
        setDataMalwareCount(malwareLabels);
    }, [dataLogDataset]);
    
    useEffect(() => {
        const benignLabels = dataLogDataset
            .map((item) => item.label)
            .filter((label) => label && label === "Benign");
    
        setDataBenignCount(benignLabels);
    }, [dataLogDataset]);

    useEffect(() => {
        const dates = Array.from(
            new Set(
                dataLogDataset
                    .filter((item) => item.created_at)
                    .map((item) => item.created_at.split("T")[0])
            )
        );
        setDataCreatedAt(dates);
    }, [dataLogDataset]);

    useEffect(()=>{
        console.error('data created at', dataCreatedAt);
    }, [dataCreatedAt])

    return {dataLogDataset, dataMalwareCount, dataBenignCount, dataCreatedAt}
}

export default DataLogDatasetFunction