import { useEffect, useState } from "react"

type NavbarSecurityEventType = {
  pick: string
  click: (title: string) => void
}

type NavItemType = {
  title: string
  description: string
  permission?: string
  accent: "blue" | "cyan" | "green" | "purple" | "orange" | "yellow"
}

const NavbarSecurityEvent = ({ pick, click }: NavbarSecurityEventType) => {
  const [permissionsNow, setPermissionsNow] = useState<string[]>([])
  const [isActive, setIsActive] = useState(pick || "Dashboard Overview")

  const navItems: NavItemType[] = [
    {
      title: "Dashboard Overview",
      description: "Ringkasan semua data syslog",
      permission: "security event",
      accent: "blue",
    },
    {
      title: "Traffic Monitoring",
      description: "Monitoring traffic jaringan",
      permission: "traffic monitoring",
      accent: "cyan",
    },
    {
      title: "Web & Application Monitoring",
      description: "Aktivitas website dan aplikasi",
      permission: "web application",
      accent: "purple",
    },
    {
      title: "Client Monitoring",
      description: "Aktivitas IP client/internal",
      permission: "client monitoring",
      accent: "green",
    },
    {
      title: "Destination Monitoring",
      description: "Tujuan IP, domain, negara, dan port",
      permission: "destination monitoring",
      accent: "orange",
    },
    {
      title: "Network & System Alarm",
      description: "Link monitor dan system log",
      permission: "network alarm",
      accent: "yellow",
    },
  ]

  useEffect(() => {
    const storedPermissions = localStorage.getItem("permission")

    if (storedPermissions) {
      setPermissionsNow(JSON.parse(storedPermissions))
    }
  }, [])

  useEffect(() => {
    if (pick) {
      setIsActive(pick)
    }
  }, [pick])

  const getAccentStyle = (accent: NavItemType["accent"], active: boolean) => {
    const styles = {
      blue: {
        activeBorder: "border-blue-500",
        activeShadow: "shadow-blue-500/10",
        hoverBorder: "hover:border-blue-500/60",
        glow: "bg-blue-500/20",
        iconBorder: "border-blue-500",
        iconBg: "bg-blue-500/10",
        dot: "bg-blue-500",
        title: "text-blue-300",
      },
      cyan: {
        activeBorder: "border-cyan-500",
        activeShadow: "shadow-cyan-500/10",
        hoverBorder: "hover:border-cyan-500/60",
        glow: "bg-cyan-500/20",
        iconBorder: "border-cyan-500",
        iconBg: "bg-cyan-500/10",
        dot: "bg-cyan-500",
        title: "text-cyan-300",
      },
      green: {
        activeBorder: "border-green-500",
        activeShadow: "shadow-green-500/10",
        hoverBorder: "hover:border-green-500/60",
        glow: "bg-green-500/20",
        iconBorder: "border-green-500",
        iconBg: "bg-green-500/10",
        dot: "bg-green-500",
        title: "text-green-300",
      },
      purple: {
        activeBorder: "border-purple-500",
        activeShadow: "shadow-purple-500/10",
        hoverBorder: "hover:border-purple-500/60",
        glow: "bg-purple-500/20",
        iconBorder: "border-purple-500",
        iconBg: "bg-purple-500/10",
        dot: "bg-purple-500",
        title: "text-purple-300",
      },
      orange: {
        activeBorder: "border-orange-500",
        activeShadow: "shadow-orange-500/10",
        hoverBorder: "hover:border-orange-500/60",
        glow: "bg-orange-500/20",
        iconBorder: "border-orange-500",
        iconBg: "bg-orange-500/10",
        dot: "bg-orange-500",
        title: "text-orange-300",
      },
      yellow: {
        activeBorder: "border-yellow-500",
        activeShadow: "shadow-yellow-500/10",
        hoverBorder: "hover:border-yellow-500/60",
        glow: "bg-yellow-500/20",
        iconBorder: "border-yellow-500",
        iconBg: "bg-yellow-500/10",
        dot: "bg-yellow-400",
        title: "text-yellow-300",
      },
    }

    return styles[accent]
  }

  const canShowMenu = (item: NavItemType) => {
    if (!item.permission) {
      return true
    }

    return permissionsNow.includes(item.permission)
  }

  const handleClick = (title: string) => {
    setIsActive(title)
    click(title)
  }

  return (
    <div className="w-full mb-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {navItems.filter(canShowMenu).map((item) => {
          const active = isActive === item.title
          const accent = getAccentStyle(item.accent, active)

          return (
            <button
              key={item.title}
              onClick={() => handleClick(item.title)}
              className={`
                group relative overflow-hidden
                flex items-center justify-between gap-4
                rounded-xl border p-4
                text-left
                transition-all duration-200 ease-in-out
                ${
                  active
                    ? `${accent.activeBorder} bg-gradient-to-br from-[#111c45] to-[#120b2f] text-white shadow-lg ${accent.activeShadow}`
                    : `border-[#353b6c] bg-[#0c0b20] text-gray-400 hover:bg-[#14122d] hover:text-white ${accent.hoverBorder}`
                }
              `}
            >
              {active && (
                <div
                  className={`absolute -right-10 -top-10 w-[110px] h-[110px] rounded-full ${accent.glow} blur-2xl`}
                />
              )}

              <div className="relative flex items-center gap-4 min-w-0">
                <div
                  className={`
                    w-[42px] h-[42px]
                    rounded-xl border
                    flex items-center justify-center
                    transition-all duration-200
                    ${
                      active
                        ? `${accent.iconBorder} ${accent.iconBg}`
                        : `border-[#353b6c] bg-[#14122d] ${accent.hoverBorder}`
                    }
                  `}
                >
                  <div
                    className={`
                      w-3 h-3 rounded-full
                      ${
                        active
                          ? "bg-green-400 shadow-lg shadow-green-400/40"
                          : accent.dot
                      }
                    `}
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className={`
                      font-bold text-[14px] truncate
                      ${active ? accent.title : ""}
                    `}
                  >
                    {item.title}
                  </p>

                  <p
                    className={`
                      text-xs mt-1 truncate
                      ${
                        active
                          ? "text-blue-200"
                          : "text-gray-600 group-hover:text-gray-400"
                      }
                    `}
                  >
                    {item.description}
                  </p>
                </div>
              </div>

              <div
                className={`
                  relative px-3 py-1 rounded-full text-xs font-semibold border shrink-0
                  ${
                    active
                      ? "border-green-500/30 bg-green-500/10 text-green-400"
                      : "border-[#353b6c] bg-[#08071a] text-gray-600 group-hover:text-gray-300"
                  }
                `}
              >
                {active ? "Active" : "Open"}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default NavbarSecurityEvent