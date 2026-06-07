'use client'

import { CreateUser, GetDataUser } from '@/lib/function/userFunction'
import Image from 'next/image'
import { useState } from 'react'

const DataUser = () => {
  const { dataUser } = GetDataUser()

  const [isDelete, setisDelete] = useState(false)
  const [isAddUser, setisAddUser] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const filteredUser = dataUser.filter((item) =>
    item.username?.toLowerCase().includes(search.toLowerCase()) ||
    item.email?.toLowerCase().includes(search.toLowerCase())
  )

  const resetForm = () => {
    setUsername('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
  }

  const addUser = async () => {
    setError('')

    if (!username || !email || !password || !confirmPassword) {
      setError('Semua data wajib diisi.')
      return
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak sesuai.')
      return
    }

    setisLoading(true)

    try {
      const res = await CreateUser({
        username,
        email,
        password,
      })

      if (res) {
        alert(res)
        resetForm()
        setisAddUser(false)
      } else {
        setError('Gagal membuat user.')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat membuat user.')
    } finally {
      setisLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen px-6 md:px-10 pt-[135px] pb-10 bg-[#070616] text-white">

      {/* Main Container */}
      <div className="w-full rounded-xl border-[.5px] border-[#353b6c] bg-[#0c0b20] p-6 md:p-8 shadow-xl shadow-black/30">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">User Management</p>
            <h1 className="font-bold text-[28px] md:text-[32px]">
              Data User
            </h1>
            <p className="text-gray-500 mt-2 max-w-xl">
              Kelola akun user yang terdaftar di sistem.
            </p>
          </div>

          <button
            onClick={() => setisAddUser(true)}
            className="
              flex items-center justify-center gap-3
              px-7 py-3
              rounded-md
              bg-gradient-to-b from-[#2563eb] to-[#1e40af]
              border border-[#3b82f6]
              shadow-lg shadow-blue-500/20
              hover:scale-[1.02]
              transition-all duration-200
              font-bold
            "
          >
            + Add User
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-row items-center gap-4 rounded-xl border-[.5px] border-[#353b6c] bg-gradient-to-t from-[#111c45] to-[#120b2f] p-5">
            <div className="w-[50px] h-[50px] rounded-full bg-[#071049] border-2 border-blue-500 flex items-center justify-center">
              <Image src="/admin.png" alt="Admin" width={22} height={22} />
            </div>

            <div>
              <p className="text-gray-400 text-sm">Total User</p>
              <p className="text-[24px] font-bold">{dataUser.length}</p>
            </div>
          </div>

          <div className="flex flex-row items-center gap-4 rounded-xl border-[.5px] border-[#353b6c] bg-gradient-to-t from-[#111c45] to-[#120b2f] p-5">
            <div className="w-[50px] h-[50px] rounded-full bg-[#062e1a] border-2 border-green-500 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>

            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-[20px] font-bold text-green-400">Active</p>
            </div>
          </div>

          <div className="flex flex-row items-center gap-4 rounded-xl border-[.5px] border-[#353b6c] bg-[#14122d] p-5">
            <div className="w-[50px] h-[50px] rounded-full bg-[#3a2604] border-2 border-[#fdff71] flex items-center justify-center">
              <p className="font-bold text-yellow-300">A</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Role</p>
              <p className="text-[20px] font-bold">User Account</p>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="w-full rounded-lg border border-[#353b6c] bg-[#08071a] p-5">

          {/* Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div>
              <p className="font-bold text-[20px]">List User</p>
              <p className="text-gray-500 text-sm">
                Daftar akun yang tersedia di sistem.
              </p>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari username atau email..."
              className="
                w-full md:w-[330px]
                px-4 py-3
                rounded-md
                bg-[#0c0b20]
                border border-[#353b6c]
                outline-none
                text-white
                placeholder:text-gray-600
                focus:border-white
                transition-all duration-200
              "
            />
          </div>

          {/* Empty Data */}
          {dataUser.length === 0 ? (
            <div className="w-full min-h-[330px] flex flex-col items-center justify-center rounded-lg border border-dashed border-[#353b6c] bg-[#0c0b20]">
              <div className="w-[80px] h-[80px] rounded-full bg-[#14122d] border border-[#353b6c] flex items-center justify-center mb-5">
                <Image src="/admin.png" alt="Admin" width={32} height={32} />
              </div>

              <p className="font-bold text-[20px] mb-2">Belum Ada User</p>
              <p className="text-gray-500 mb-6">
                Silakan tambahkan user pertama.
              </p>

              <button
                onClick={() => setisAddUser(true)}
                className="
                  px-7 py-3
                  rounded-md
                  bg-gradient-to-b from-[#2563eb] to-[#1e40af]
                  border border-[#3b82f6]
                  font-bold
                  hover:scale-[1.02]
                  transition-all duration-200
                "
              >
                + Add User
              </button>
            </div>
          ) : filteredUser.length === 0 ? (
            <div className="w-full min-h-[250px] flex flex-col items-center justify-center rounded-lg border border-dashed border-[#353b6c] bg-[#0c0b20]">
              <p className="font-bold text-[20px] mb-2">User Tidak Ditemukan</p>
              <p className="text-gray-500">
                Coba gunakan kata kunci pencarian lain.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredUser.map((item, index) => (
                <div
                  key={index}
                  className="
                    group
                    relative
                    overflow-hidden
                    flex items-center justify-between gap-4
                    rounded-xl
                    border-[.5px] border-[#353b6c]
                    bg-gradient-to-t from-[#111c45] to-[#120b2f]
                    p-5
                    hover:border-white
                    hover:shadow-lg hover:shadow-blue-500/10
                    transition-all duration-200
                  "
                >
                  <div className="absolute -right-10 -top-10 w-[100px] h-[100px] bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-200" />

                  <div className="relative flex items-center gap-4 min-w-0">
                    <div className="w-[55px] h-[55px] rounded-full bg-[#071049] border-2 border-blue-500 flex items-center justify-center shrink-0">
                      <Image
                        src="/admin.png"
                        alt="Admin"
                        width={24}
                        height={24}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-[17px] truncate">
                        {item.username}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {item.email}
                      </p>

                      <div className="inline-flex items-center gap-2 px-3 py-1 mt-3 rounded-full border border-green-500/30 bg-green-500/10">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <p className="text-xs text-green-400 font-bold">
                          Active
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setisDelete(true)}
                    className="
                      relative
                      w-[45px] h-[45px]
                      rounded-md
                      border border-[#353b6c]
                      bg-[#0c0b20]
                      flex items-center justify-center
                      hover:bg-red-500/20
                      hover:border-red-500
                      transition-all duration-200
                      shrink-0
                    "
                  >
                    <Image
                      src="/delete.png"
                      alt="Delete"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              ))}

              {/* Add Card */}
              <button
                onClick={() => setisAddUser(true)}
                className="
                  min-h-[140px]
                  rounded-xl
                  border border-dashed border-[#353b6c]
                  bg-[#0c0b20]
                  flex flex-col items-center justify-center gap-2
                  hover:bg-[#353b6c]
                  transition-all duration-200
                "
              >
                <div className="w-[50px] h-[50px] rounded-full border border-white bg-[#14122d] flex items-center justify-center text-[26px] font-bold">
                  +
                </div>
                <p className="font-bold">Tambah User Baru</p>
                <p className="text-sm text-gray-400">
                  Klik untuk membuat akun
                </p>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Delete */}
      {isDelete && (
        <div className="fixed inset-0 z-50 flex justify-center items-center px-5">
          <div
            onClick={() => setisDelete(false)}
            className="absolute inset-0 bg-[#0c0b20]/90 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-[400px] rounded-xl border border-[#353b6c] bg-[#0c0b20] p-7 shadow-xl">
            <button
              onClick={() => setisDelete(false)}
              className="absolute -top-3 -right-3 w-[38px] h-[38px] rounded-md border-2 border-white bg-[#0c0b20] hover:bg-[#353b6c] font-bold transition-all duration-200"
            >
              X
            </button>

            <div className="w-[65px] h-[65px] rounded-full bg-[#3a020f] border-2 border-red-500 flex items-center justify-center mb-5">
              <Image src="/delete.png" alt="Delete" width={24} height={24} />
            </div>

            <p className="font-bold text-[24px] mb-2">Hapus User?</p>
            <p className="text-gray-400 mb-7">
              Apakah kamu yakin ingin menghapus user ini?
            </p>

            <button className="w-full py-3 rounded-md bg-red-600 hover:bg-red-700 font-bold transition-all duration-200 mb-3">
              Ya, Hapus
            </button>

            <button
              onClick={() => setisDelete(false)}
              className="w-full py-3 rounded-md border border-[#353b6c] hover:bg-[#353b6c] font-bold transition-all duration-200"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Modal Add User */}
      {isAddUser && (
        <div className="fixed inset-0 z-50 flex justify-center items-center px-5">
          <div
            onClick={() => {
              setisAddUser(false)
              resetForm()
            }}
            className="absolute inset-0 bg-[#0c0b20]/90 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-[500px] rounded-xl border border-[#353b6c] bg-[#0c0b20] p-7 shadow-xl">
            <button
              onClick={() => {
                setisAddUser(false)
                resetForm()
              }}
              className="absolute -top-3 -right-3 w-[38px] h-[38px] rounded-md border-2 border-white bg-[#0c0b20] hover:bg-[#353b6c] font-bold transition-all duration-200"
            >
              X
            </button>

            <div className="mb-6">
              <div className="w-[65px] h-[65px] rounded-full bg-[#071049] border-2 border-blue-500 flex items-center justify-center mb-5">
                <Image src="/admin.png" alt="Admin" width={30} height={30} />
              </div>

              <p className="font-bold text-[26px]">Add User</p>
              <p className="text-gray-500 mt-1">
                Masukkan data user yang belum terdaftar.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-md border border-red-500/30 bg-red-500/10 text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-gray-400">Username</p>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full px-4 py-3 rounded-md bg-[#14122d] border border-[#353b6c] outline-none focus:border-white placeholder:text-gray-600 transition-all duration-200"
                />
              </div>

              <div>
                <p className="mb-2 text-gray-400">Email</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                  className="w-full px-4 py-3 rounded-md bg-[#14122d] border border-[#353b6c] outline-none focus:border-white placeholder:text-gray-600 transition-all duration-200"
                />
              </div>

              <div>
                <p className="mb-2 text-gray-400">Password</p>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full px-4 py-3 rounded-md bg-[#14122d] border border-[#353b6c] outline-none focus:border-white placeholder:text-gray-600 transition-all duration-200"
                />
              </div>

              <div>
                <p className="mb-2 text-gray-400">Confirm Password</p>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password"
                  className="w-full px-4 py-3 rounded-md bg-[#14122d] border border-[#353b6c] outline-none focus:border-white placeholder:text-gray-600 transition-all duration-200"
                />
              </div>
            </div>

            <button
              onClick={addUser}
              disabled={isLoading}
              className="
                w-full mt-7 py-3
                rounded-md
                bg-gradient-to-b from-[#2563eb] to-[#1e40af]
                border border-[#3b82f6]
                shadow-lg shadow-blue-500/20
                font-bold
                hover:scale-[1.02]
                transition-all duration-200
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {isLoading ? 'Creating...' : '+ Create User'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataUser