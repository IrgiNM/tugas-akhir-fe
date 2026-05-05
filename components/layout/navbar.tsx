import { buttonActionType } from '@/type/buttonActionType'
import { NavbarType } from '@/type/navbarType'
import Image from 'next/image'
import React, { useState } from 'react'


const Navbar = ({ click1, click4, click3, click2, isActived }: NavbarType) => {

  return (
    <>
        <div className='w-full flex flex-row gap-2 justify-end items-center px-12 absolute z-10 top-[88px] right-[200px]'>
            <ButtonAction
                onKlik={click1}
                label='Get Log UPA TIK'
                picked={isActived}
            />
            <ButtonAction
                onKlik={click2}
                label='Detection Malware'
                picked={isActived}
            />
            <ButtonAction
                onKlik={click3}
                label='Reset data'
                picked={isActived}
            />
            <ButtonAction
                onKlik={click4}
                label='Data User'
                picked={isActived}
            />
        </div>
    </>
  )
}

const ButtonAction = ({label,onKlik,picked}:buttonActionType) => {
    return(
        <button onClick={onKlik} className={`w-[200px] p-2 border-1 ${label===picked?'text-white bg-black':'text-black bg-white'}  rounded-t-xl  font-semibold hover:border-1 hover:border-white hover:bg-black hover:text-white transition duration-200 ease-in-out `}>
            <div className={`p-1 w-full h-full flex items-center justify-center  ${label==='Reset data'&&'border-2 border-black '}  rounded-md text-[12px]`}>
                {label}
            </div>
        </button>
    )
}

export default Navbar