import { geoLocationIPType } from '@/type/geoLocationIPType'
import { useEffect, useState } from 'react'
import { getGeoIP } from '../function/api'

const dataGeoLocationIP = (ip: string) => {

    const [dataGeo, setDataGeo] = useState<geoLocationIPType>()

    const fetchDataGeoLocationIP = async () => {
        try {
            const res = await getGeoIP(ip)
            if (res.status === 200) {
                setDataGeo(res.data)
            }
        } catch (error) {
            console.error('Error fetching geolocation data:', error);
        }
    }

    useEffect(()=>{
        fetchDataGeoLocationIP()
    }, [ip])

    return {dataGeo}
}

export default dataGeoLocationIP