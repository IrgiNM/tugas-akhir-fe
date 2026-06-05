import { buttonActionType } from '@/type/buttonActionType'
import { NavbarType } from '@/type/navbarType'


const Navbar = ({ click1, click4, click3, click2, isActived }: NavbarType) => {

  return (
    <>
        <div className='w-full flex flex-row gap-2 justify-end items-center px-12 fixed z-10 top-[90px] right-[200px]'>
            <ButtonAction
                onKlik={click1}
                label='Top Reports'
                picked={isActived}
            />
            <ButtonAction
                onKlik={click2}
                label='Security Events'
                picked={isActived}
            />
            {/* <ButtonAction
                onKlik={click2}
                label='Detection Malware'
                picked={isActived}
            /> */}
            {/* <ButtonAction
                onKlik={click3}
                label='Reset data'
                picked={isActived}
            /> */}
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
        <button onClick={onKlik} className={`w-[200px] p-2 border-1 border-white ${label===picked?'text-[#fcff50] bg-gradient-to-b from-blue-900 to-slate-950':'text-[#120b2f] bg-gradient-to-b from-white to-[#91caff]'}  rounded-t-xl  font-semibold hover:border-white hover:from-blue-900 hover:to-slate-950 hover:text-[#fcff50] transition duration-200 ease-in-out `}>
            <div className={`p-1 w-full h-full flex items-center justify-center  ${label==='Reset data'&&'border-2 border-[#120b2f] '}  rounded-md text-[12px]`}>
                {label}
            </div>
        </button>
    )
}

export default Navbar