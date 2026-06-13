import { useEffect, useState } from "react";

type NavbarSecurityEventType = {
    pick: string
    click: (title: string) => void
  }
  
  const NavbarSecurityEvent = ({ pick, click }: NavbarSecurityEventType) => {
    const [permissionsNow, setPermissionsNow] = useState<string[]>([]);
    const [isActive, setIsActive] = useState('Event Information');
    
    const nav = [
      {
        title: "Event Information",
        description: "Security event overview",
        accent: "blue",
      },
      {
        title: "Device User Activity Information",
        description: "Device and user activity",
        accent: "cyan",
      },
    ]

    useEffect(() => {
      const storedPermissions = localStorage.getItem("permission");
      if (storedPermissions) {
        setPermissionsNow(JSON.parse(storedPermissions));
      }
    }, []);
  
    return (
      <div className="w-full mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => {click("Event Information"),setIsActive("Event Information")}}
              className={`
                group relative overflow-hidden
                flex items-center justify-between gap-4
                rounded-xl border p-4
                text-left
                transition-all duration-200 ease-in-out
                ${
                  isActive === "Event Information"
                    ? "border-blue-500 bg-gradient-to-br from-[#111c45] to-[#120b2f] text-white shadow-lg shadow-blue-500/10"
                    : "border-[#353b6c] bg-[#0c0b20] text-gray-400 hover:bg-[#14122d] hover:text-white hover:border-blue-500/60"
                }
              `}
            >
              {isActive === "Event Information" && (
                <div className="absolute -right-10 -top-10 w-[110px] h-[110px] rounded-full bg-blue-500/20 blur-2xl" />
              )}

              <div className="relative flex items-center gap-4">
                <div
                  className={`
                    w-[42px] h-[42px]
                    rounded-xl border
                    flex items-center justify-center
                    transition-all duration-200
                    ${
                      isActive === "Event Information"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-[#353b6c] bg-[#14122d] group-hover:border-blue-500/60"
                    }
                  `}
                >
                  <div
                    className={`
                      w-3 h-3 rounded-full
                      ${
                        isActive === "*Event Information"
                          ? "bg-green-400 shadow-lg shadow-green-400/40"
                          : "bg-blue-500"
                      }
                    `}
                  />
                </div>

                <div>
                  <p className="font-bold text-[14px]">
                    Event Information
                  </p>
                  <p
                    className={`
                      text-xs mt-1
                      ${isActive ? "text-blue-200" : "text-gray-600 group-hover:text-gray-400"}
                    `}
                  >
                    Security event overview
                  </p>
                </div>
              </div>

              <div
                className={`
                  relative px-3 py-1 rounded-full text-xs font-semibold border
                  ${
                    isActive === "Event Information"
                      ? "border-green-500/30 bg-green-500/10 text-green-400"
                      : "border-[#353b6c] bg-[#08071a] text-gray-600 group-hover:text-gray-300"
                  }
                `}
              >
                {isActive === "Event Information" ? "Active" : "Open"}
              </div>
            </button>
            
            {permissionsNow.includes("device user") && (
                <button
                onClick={() => {click("Device User Activity Information"); setIsActive("Device User Activity Information")}}
                className={`
                    group relative overflow-hidden
                    flex items-center justify-between gap-4
                    rounded-xl border p-4
                    text-left
                    transition-all duration-200 ease-in-out
                    ${
                    isActive === "Device User Activity Information"
                        ? "border-blue-500 bg-gradient-to-br from-[#111c45] to-[#120b2f] text-white shadow-lg shadow-blue-500/10"
                        : "border-[#353b6c] bg-[#0c0b20] text-gray-400 hover:bg-[#14122d] hover:text-white hover:border-blue-500/60"
                    }
                `}
                >
                {isActive === "Device User Activity Information" && (
                    <div className="absolute -right-10 -top-10 w-[110px] h-[110px] rounded-full bg-blue-500/20 blur-2xl" />
                )}

                <div className="relative flex items-center gap-4">
                    <div
                    className={`
                        w-[42px] h-[42px]
                        rounded-xl border
                        flex items-center justify-center
                        transition-all duration-200
                        ${
                        isActive === "*Device User Activity Information"
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-[#353b6c] bg-[#14122d] group-hover:border-blue-500/60"
                        }
                    `}
                    >
                    <div
                        className={`
                        w-3 h-3 rounded-full
                        ${
                            isActive === "*Device User Activity Information"
                            ? "bg-green-400 shadow-lg shadow-green-400/40"
                            : "bg-blue-500"
                        }
                        `}
                    />
                    </div>

                    <div>
                    <p className="font-bold text-[14px]">
                        Device User Activity Information
                    </p>
                    <p
                        className={`
                        text-xs mt-1
                        ${isActive ? "text-blue-200" : "text-gray-600 group-hover:text-gray-400"}
                        `}
                    >
                        Device and user activity
                    </p>
                    </div>
                </div>

                <div
                    className={`
                    relative px-3 py-1 rounded-full text-xs font-semibold border
                    ${
                        isActive === "Device User Activity Information"
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : "border-[#353b6c] bg-[#08071a] text-gray-600 group-hover:text-gray-300"
                    }
                    `}
                >
                    {isActive === "Device User Activity Information" ? "Active" : "Open"}
                </div>
                </button>
            )}
        </div>
      </div>
    )
  }
  
  export default NavbarSecurityEvent