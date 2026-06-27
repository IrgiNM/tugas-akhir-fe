import { permissionType } from '@/type/permissionType'
import { useEffect, useState } from 'react'
import { getPermission } from '../function/api'

const dataPermission = (id?: number) => {
    const [dataPermissionUser, setDataPermissionUser] = useState<permissionType[]>([])
  
    useEffect(()=>{
        const fetchDataPermissionUserLocationIP = async () => {
            try {
                const res = await getPermission(id||0)
                if (res.status === 200) {
                    setDataPermissionUser(res.data)
                }
            } catch (error) {
                console.error('Error fetching geolocation data:', error);
            }
        }
        fetchDataPermissionUserLocationIP()
    }, [id])

    return {dataPermissionUser}
}

export default dataPermission