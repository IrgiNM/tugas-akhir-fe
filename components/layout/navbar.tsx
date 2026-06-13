"use client"

import { getMe } from '@/lib/function/api'
import { buttonActionType } from '@/type/buttonActionType'
import { NavbarType } from '@/type/navbarType'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Navbar = ({ click1, click4, click3, click2, isActived }: NavbarType) => {
  const router = useRouter()
  const [permissionsNow, setPermissionsNow] = useState<string[]>([]);
  const [userPage, setUserPage] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('permission')
    router.push('/')
  }

  useEffect(() => {
    const storedPermissions = localStorage.getItem("permission");
    if (storedPermissions) {
      setPermissionsNow(JSON.parse(storedPermissions));
    }
  }, []);

  useEffect(()=>{
      const fetch = async () => {
        const res = await getMe();
        if(res.status === 200){
          setUserPage(res.data.is_staff)
        }
      }
      fetch();
    }, [])

  return (
    <div className="w-full fixed z-50 top-[90px] left-0 px-6 md:px-12">
      <div className="w-full flex justify-end">
        <div
          className="
            flex flex-row gap-2 items-center
            px-3 py-3
            rounded-2xl
            border border-[#353b6c]
            bg-[#0c0b20]/90
            backdrop-blur-md
            shadow-xl shadow-black/30
          "
        >
        {permissionsNow.includes("top reports") && (
          <ButtonAction
            onKlik={click1}
            label="Top Reports"
            picked={isActived}
          />
        )}

        {permissionsNow.includes("security event") && (
          <ButtonAction
            onKlik={click2}
            label="Security Events"
            picked={isActived}
          />
        )}

        {userPage && (
          <ButtonAction
            onKlik={()=>{router.push('/dataUser')}}
            label="Data User"
            picked={isActived}
          />
        )}

          <button
            onClick={handleLogout}
            className="
              ml-8
              relative
              px-7 py-3
              rounded-xl
              text-[13px]
              font-bold
              text-red-400
              bg-red-500/10
              border border-red-500/30
              hover:bg-[#e30066]
              hover:text-white
              transition-all duration-200
            "
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

const ButtonAction = ({ label, onKlik, picked }: buttonActionType) => {
  const isActive = label === picked

  return (
    <button
      onClick={onKlik}
      className={`
        relative
        px-7 py-3
        rounded-xl
        text-[13px]
        font-bold
        transition-all duration-200
        ${
          isActive
            ? 'text-white bg-[#14122d]'
            : 'text-gray-500 hover:text-white hover:bg-[#14122d]'
        }
      `}
    >
      <span className="relative z-10">{label}</span>

      {isActive && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-1 w-[40%] h-[3px] rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
      )}
    </button>
  )
}

export default Navbar