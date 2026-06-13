"use client"

import { createPermission, getMe, getPermission } from '@/lib/function/api'
import { getToken } from '@/lib/function/token'
import { loginUser } from '@/lib/function/userFunction'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Page = () => {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError('')
  
    if (!username || !password) {
      setError('Username dan password wajib diisi.')
      return
    }
  
    setIsLoading(true)
  
    try {
      const res = await loginUser({
        username,
        password,
      })
  
      if (res) {
        const res2 = await getMe()
  
        if (res2.status === 200) {
          const res3 = await getPermission(Number(res2.data.id))
  
          if (res3.status === 200) {
            const permissions: string[] = res3.data.map(
              (item: { name: string }) => item.name
            )
  
            localStorage.setItem(
              "permission",
              JSON.stringify(permissions)
            )
          }
        }
  
        setUsername('')
        setPassword('')

        if(res2.data.is_staff === true) {
          router.push('/dataUser')
        }else{
          router.push('/dashboard')
        }
  
      } else {
        setError('Username atau password salah.')
      }
    } catch (error) {
      setError('Terjadi kesalahan saat login.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = getToken()

    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#070616] px-5">

      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[#0c0b20]" />
      <div className="absolute top-[-120px] right-[-120px] w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-[-120px] left-[-120px] w-[350px] h-[350px] rounded-full bg-red-500/10 blur-3xl" />

      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="
          relative
          w-full max-w-[430px]
          rounded-2xl
          border border-[#353b6c]
          bg-gradient-to-br from-[#111c45] via-[#120b2f] to-[#0c0b20]
          p-8 md:p-10
          shadow-2xl shadow-black/40
        "
      >
        <div className="mb-8">
          <div className="w-[60px] h-[60px] rounded-2xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-center mb-5">
            <div className="w-4 h-4 rounded-full bg-green-400 shadow-lg shadow-green-400/40" />
          </div>

          <p className="text-sm text-blue-300 font-semibold mb-2">
            Secure Access
          </p>

          <h1 className="text-[30px] font-bold text-white">
            Login
          </h1>

          <p className="text-gray-400 mt-2">
            Masukkan username dan password yang sudah terdaftar.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="
                w-full
                px-4 py-3
                rounded-xl
                border border-[#353b6c]
                bg-[#0c0b20]
                text-white
                outline-none
                placeholder:text-gray-600
                focus:border-blue-500
                transition-all duration-200
              "
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="
                w-full
                px-4 py-3
                rounded-xl
                border border-[#353b6c]
                bg-[#0c0b20]
                text-white
                outline-none
                placeholder:text-gray-600
                focus:border-blue-500
                transition-all duration-200
              "
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full
            mt-8
            py-3
            rounded-xl
            bg-gradient-to-b from-[#2563eb] to-[#1e40af]
            border border-blue-500
            text-white
            font-bold
            shadow-lg shadow-blue-500/20
            hover:scale-[1.02]
            transition-all duration-200
            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:hover:scale-100
          "
        >
          {isLoading ? 'Memproses...' : 'Login'}
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <p>UPA-TIK Log Monitoring System</p>
        </div>
      </form>
    </div>
  )
}

export default Page