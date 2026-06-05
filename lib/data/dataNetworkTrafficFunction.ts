import { dataNetworkTrafficType } from "@/type/dataNetworkTrafficType"
import { useEffect, useState } from "react"
import { getListNetworkTraffic } from "../function/api"
import { dataProtokolType } from "@/type/dataProtokolType"

export const dataNetworkTrafficFunction = () => {
    const [dataNerworkTraffic, setDataNetworkTraffic] = useState<dataNetworkTrafficType[]>([])
    const [dataProtokol, setDataProtokol] = useState<dataProtokolType[]>([])
    const [dataDurasi, setDataDurasi] = useState<dataProtokolType[]>([])
    const [dataJumlahByte, setDataJumlahByte] = useState<dataProtokolType[]>([])
    const [dataJumlahPacket, setDataJumlahPacket] = useState<dataProtokolType[]>([])
    const [dataStatusKoneksi, setDataStatusKoneksi] = useState<dataProtokolType[]>([])
    const [dataTenY, setDataTenY] = useState<number[]>([])
    const dataCount = dataNerworkTraffic.length;

    useEffect(()=>{
        const fetch = async() => {
            const res = await getListNetworkTraffic();
            if(res.status === 200){
                setDataNetworkTraffic(res.data);
            }
        }
        fetch();
    }, [])

    useEffect(()=>{
        const dataY: number[] = [];
        const minus = dataCount/10;
        let data = dataCount;
        for(let i = 10; i > 0; i--){
            dataY.push(Math.round(data));
            data = data - minus;
        }
        setDataTenY(dataY);
    }, [dataNerworkTraffic])

    // PROTOKOL
    useEffect(()=>{
        const data: string[] = [];
        const dataProtokolTemp: dataProtokolType[] = [];

        dataNerworkTraffic.map((item)=>{
            const protokol = item.protokol??'';
            data.push(protokol);
        })
        const dataSet = [...new Set(data)];

        dataSet.map((item)=>{
            let count = 0;
            data.forEach((protokol) => {
                if (protokol === item) {
                    count++;
                }
            });
            dataProtokolTemp.push({
                name: item,
                value: count
            });
        })

        setDataProtokol(dataProtokolTemp);
    }, [dataNerworkTraffic])

    // DURASI
    useEffect(()=>{
        const data: number[] = [];
        const dataDurasiTemp: dataProtokolType[] = [];
        let durasiTop = 0;
        const durasiTen: number[] = [];

        dataNerworkTraffic.map((item)=>{
            const durasi = item.durasi??0;
            data.push(durasi);
        })
        const dataSet = [...new Set(data)];

        data.map((item)=>{
            if(item > durasiTop){
                durasiTop = item;
            }
        })

        for (let i = 10; i > 0; i--) {
            durasiTen.push(Number(durasiTop));
            durasiTop = Number((durasiTop - (durasiTop / 10)));
        }

        for(let i = 0; i < 10; i++){
            const item = durasiTen[i];
            let count = 0;
            data.forEach((durasi) => {
                if(i<=8){
                    if (durasi <= item && durasi >= durasiTen[i + 1]) {
                        count++;
                    }
                }else{
                    if(durasi >= 0 && durasi <= durasiTen[9]){
                        count++;
                    }
                }
            });
            dataDurasiTemp.push({
                name: item.toString(),
                value: count
            });
        }

        setDataDurasi(dataDurasiTemp);
    }, [dataNerworkTraffic])
    
    // JUMLAH BYTES
    useEffect(()=>{
        const data: number[] = [];
        const dataJumlahByteTemp: dataProtokolType[] = [];
        let jumlahByteTop = 0;
        const jumlahByteTen: number[] = [];

        dataNerworkTraffic.map((item)=>{
            const JumlahByte = item.jumlah_bytes??0;
            data.push(JumlahByte);
        })
        const dataSet = [...new Set(data)];

        data.map((item)=>{
            if(item > jumlahByteTop){
                jumlahByteTop = item;
            }
        })

        for (let i = 10; i > 0; i--) {
            jumlahByteTen.push(Number(jumlahByteTop));
            jumlahByteTop = Number((jumlahByteTop - (jumlahByteTop / 10)));
        }

        for(let i = 0; i < 10; i++){
            const item = jumlahByteTen[i];
            let count = 0;
            data.forEach((JumlahByte) => {
                if(i<=8){
                    if (JumlahByte <= item && JumlahByte >= jumlahByteTen[i + 1]) {
                        count++;
                    }
                }else{
                    if(JumlahByte >= 0 && JumlahByte <= jumlahByteTen[9]){
                        count++;
                    }
                }
            });
            dataJumlahByteTemp.push({
                name: item.toString(),
                value: count
            });
        }

        setDataJumlahByte(dataJumlahByteTemp);
    }, [dataNerworkTraffic])
    
    // JUMLAH PACKET
    useEffect(()=>{
        const data: number[] = [];
        const dataJumlahPacketTemp: dataProtokolType[] = [];
        let jumlahPacketTop = 0;
        const jumlahPacketTen: number[] = [];

        dataNerworkTraffic.map((item)=>{
            const JumlahPacket = item.jumlah_packet??0;
            data.push(JumlahPacket);
        })
        const dataSet = [...new Set(data)];

        data.map((item)=>{
            if(item > jumlahPacketTop){
                jumlahPacketTop = item;
            }
        })

        for (let i = 10; i > 0; i--) {
            jumlahPacketTen.push(Number(jumlahPacketTop));
            jumlahPacketTop = Number((jumlahPacketTop - (jumlahPacketTop / 10)));
        }

        for(let i = 0; i < 10; i++){
            const item = jumlahPacketTen[i];
            let count = 0;
            data.forEach((JumlahPacket) => {
                if(i<=8){
                    if (JumlahPacket <= item && JumlahPacket >= jumlahPacketTen[i + 1]) {
                        count++;
                    }
                }else{
                    if(JumlahPacket >= 0 && JumlahPacket <= jumlahPacketTen[9]){
                        count++;
                    }
                }
            });
            dataJumlahPacketTemp.push({
                name: item.toString(),
                value: count
            });
        }

        setDataJumlahPacket(dataJumlahPacketTemp);
    }, [dataNerworkTraffic])

    // STATUS KONEKSI
    useEffect(()=>{
        const data: string[] = [];
        const dataStatusKoneksiTemp: dataProtokolType[] = [];

        dataNerworkTraffic.map((item)=>{
            const statusKoneksi = item.status_koneksi??'';
            data.push(statusKoneksi);
        })
        const dataSet = [...new Set(data)];

        dataSet.map((item)=>{
            let count = 0;
            data.forEach((statusKoneksi) => {
                if (statusKoneksi === item) {
                    count++;
                }
            });
            dataStatusKoneksiTemp.push({
                name: item,
                value: count
            });
        })

        setDataStatusKoneksi(dataStatusKoneksiTemp);
    }, [dataNerworkTraffic])


    return { dataNerworkTraffic, dataProtokol, dataDurasi, dataJumlahByte, dataJumlahPacket, dataStatusKoneksi, dataCount, dataTenY }
}