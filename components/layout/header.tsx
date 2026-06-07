"use client"

import { GetDataUser } from '@/lib/function/userFunction'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const Header = () => {
  const [isApiActive, setIsApiActive] = useState(false)
  const { dataUser } = GetDataUser()

  useEffect(() => {
    if (dataUser.length > 0) {
      setIsApiActive(true)
    } else {
      setIsApiActive(false)
    }
  }, [dataUser])

  return (
    <header className="fixed z-40 top-0 left-0 w-full px-6 md:px-12 py-5 bg-[#070616]/95 backdrop-blur-md shadow-xl shadow-black/30">
      <div className="w-full flex flex-row justify-between items-center">

        {/* LEFT SIDE */}
        <div className="flex flex-row items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl" />

            <div className="relative flex justify-center items-center w-[70px] h-[70px] rounded-2xl border border-[#353b6c] bg-gradient-to-br from-[#111c45] to-[#120b2f] shadow-lg shadow-blue-500/10">
              <div className="flex justify-center items-center w-[54px] h-[54px] rounded-full bg-white">
                <Image
                  src="/polindra-logo.png"
                  alt="Polindra Logo"
                  width={42}
                  height={42}
                  priority
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                UPA-TIK Log Monitoring
              </h1>

              <div className="hidden md:flex px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10">
                <p className="text-xs text-blue-300 font-semibold">
                  Network Security
                </p>
              </div>
            </div>

            <p className="text-sm md:text-base text-gray-400 mt-1">
              Monitoring log jaringan pada server UPA-TIK Polindra
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-sm font-semibold text-white">API Status</p>
            <p className="text-xs text-gray-500">
              {isApiActive ? 'Connected' : 'Disconnected'}
            </p>
          </div>

          <div
            className={`
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              border
              transition-all duration-200
              ${
                isApiActive
                  ? 'border-green-500/30 bg-green-500/10'
                  : 'border-red-500/30 bg-red-500/10'
              }
            `}
          >
            <div className="relative flex items-center justify-center">
              {isApiActive && (
                <div className="absolute w-4 h-4 rounded-full bg-green-400 animate-ping opacity-50" />
              )}

              <div
                className={`
                  relative w-3 h-3 rounded-full
                  ${
                    isApiActive ? 'bg-green-400' : 'bg-red-400'
                  }
                `}
              />
            </div>

            <p
              className={`
                text-sm font-bold
                ${
                  isApiActive ? 'text-green-400' : 'text-red-400'
                }
              `}
            >
              API
            </p>
          </div>
        </div>

      </div>
    </header>
  )
}

export default Header