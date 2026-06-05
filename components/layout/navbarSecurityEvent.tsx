    import { useState } from "react";
    type NavbarSecurityEventType = {
        pick: string
        click: (title: string) => void
    }
    const NavbarSecurityEvent = ({pick,click} : NavbarSecurityEventType) => {
        const nav = [
            {
                title: "Event Information",
                bg: "bg-[#0b0c1c]",
                border: "border-blue-700",
            },
            {
                title: "Device User Activity Information",
                bg: "bg-blue-950/30",
                border: "border-cyan-700",
            },
            // {
            //     title: "User Activity Information",
            //     bg: "bg-purple-950/30",
            //     border: "border-purple-700",
            // },
            // {
            //     title: "Threat / Malware Information",
            //     bg: "bg-red-950/30",
            //     border: "border-red-700",
            // },
            // {
            //     title: "File Analysis Information",
            //     bg: "bg-orange-950/30",
            //     border: "border-orange-700",
            // },
            // {
            //     title: "Network Information",
            //     bg: "bg-green-950/30",
            //     border: "border-green-700",
            // },
            // {
            //     title: "Detection & Rule Engine",
            //     bg: "bg-yellow-950/30",
            //     border: "border-yellow-700",
            // },
            // {
            //     title: "Attack Classification",
            //     bg: "bg-pink-950/30",
            //     border: "border-pink-700",
            // },
            // {
            //     title: "Folder / Group Structure",
            //     bg: "bg-indigo-950/30",
            //     border: "border-indigo-700",
            // },
            // {
            //     title: "Event Action / Lifecycle",
            //     bg: "bg-teal-950/30",
            //     border: "border-teal-700",
            // }
        ]
    return (
        <div className='w-full grid grid-cols-5 gap-2 mb-5'>
            {nav.map((item,index)=>{
                return (
                    <button key={index} onClick={() => click(item.title)} className={`flex flex-row justify-between items-center px-3 py-2 border-1 rounded-md hover:bg-[#090911] transition-all duration-200 ease-in-out ${pick===item.title?`border-2 ${item.bg} ${item.border} text-white`:'bg-[#10101b] text-gray-700'}`}>
                        <p className=''>{item.title}</p>
                    </button>
                )
            })}
        </div>
    )
    }

    export default NavbarSecurityEvent