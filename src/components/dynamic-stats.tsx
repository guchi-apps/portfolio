
"use client"

import { useEffect, useState } from "react"
import { Link as LinkIcon } from "lucide-react"
import { DashboardCard } from "@/components/dashboard-card"
import { StatsConfig } from "@/lib/site-config"
import { getMonitorLinkHref, getVisibleMonitors } from "@/lib/monitor-settings"
import { UptimeRobotMonitor } from "@/lib/uptimerobot"
import { useStatsConfig } from "@/hooks/use-stats-config"
import { useAdminSession } from "@/hooks/use-admin-session"
import { cn } from "@/lib/utils"
import type { MonitorDisplayMode, MonitorSetting } from "@/types/site-content"

interface DynamicStatsProps {
    initialStats?: StatsConfig | null
    monitorSettings: MonitorSetting[]
    monitorDisplayMode: MonitorDisplayMode
}

function getStatusInfo(status: number) {
    switch (status) {
        case 2:
            return { text: "Running", color: "text-emerald-500 dark:text-emerald-400" }
        case 8:
        case 9:
            return { text: "Down", color: "text-red-500 dark:text-red-400" }
        case 0:
            return { text: "Paused", color: "text-yellow-500 dark:text-yellow-400" }
        case 1:
            return { text: "Checking...", color: "text-blue-500 dark:text-blue-400" }
        default:
            return { text: "Unknown", color: "text-slate-400" }
    }
}

function BoldLinkLabel({ label, className }: { label: string; className?: string }) {
    return (
        <div className={cn("flex items-center gap-1.5 min-w-0 max-w-full", className)}>
            <span className="font-bold truncate">{label}</span>
            <LinkIcon className="h-4 w-4 shrink-0" aria-hidden />
        </div>
    )
}

function UptimeCardLink({
    href,
    label,
    children,
}: {
    href?: string
    label: string
    children: React.ReactNode
}) {
    if (!href) return <>{children}</>

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label}（外部リンク）`}
            className="block h-full w-full rounded-xl transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
        >
            {children}
        </a>
    )
}

function UptimeCard({
    monitor,
    label,
    displayMode,
    href,
}: {
    monitor: UptimeRobotMonitor
    label: string
    displayMode: MonitorDisplayMode
    href?: string
}) {
    const ratioStr = monitor.custom_uptime_ratio || monitor.uptime_ratio || "0"
    const ratio = parseFloat(ratioStr.split("-")[0])
    const status = getStatusInfo(monitor.status)

    const content =
        displayMode === "badge" ? (
            <DashboardCard
                className={cn("h-full flex items-center justify-between gap-3 px-4 py-3", href && "cursor-pointer")}
            >
                {href ? (
                    <BoldLinkLabel label={label} className="text-sm" />
                ) : (
                    <span className="text-sm font-medium truncate">{label}</span>
                )}
                <span className={`text-sm font-bold shrink-0 ${status.color}`}>{status.text}</span>
            </DashboardCard>
        ) : displayMode === "compact" ? (
            <DashboardCard
                className={cn("h-full flex items-center justify-between gap-3 px-4 py-4", href && "cursor-pointer")}
            >
                <div className="min-w-0">
                    {href ? (
                        <BoldLinkLabel label={label} className="text-sm mb-1" />
                    ) : (
                        <span className="text-xs opacity-70 uppercase tracking-widest block truncate">
                            {label}
                        </span>
                    )}
                    <span className={`text-lg font-bold font-mono ${status.color}`}>{status.text}</span>
                </div>
                <span className="text-sm text-blue-100 dark:text-slate-400 shrink-0">
                    {ratio}%
                </span>
            </DashboardCard>
        ) : (
            <DashboardCard
                className={cn(
                    "h-full flex flex-col justify-center items-center text-center gap-1",
                    href && "cursor-pointer"
                )}
            >
                {href ? (
                    <BoldLinkLabel label={label} className="text-sm px-2" />
                ) : (
                    <span
                        className="text-xs opacity-70 uppercase tracking-widest truncate w-full px-2"
                        title={label}
                    >
                        {label}
                    </span>
                )}
                <div className={`text-2xl font-bold font-mono ${status.color}`}>{status.text}</div>
                <div className="text-sm font-medium text-blue-100 dark:text-slate-400">
                    {ratio}% uptime (30d)
                </div>
            </DashboardCard>
        )

    return (
        <UptimeCardLink href={href} label={label}>
            {content}
        </UptimeCardLink>
    )
}

function LiveSinceCard({ startString }: { startString: string }) {
    const [uptimeString, setUptimeString] = useState<string>("")

    useEffect(() => {
        if (!startString) return

        const launchDate = new Date(startString)
        const updateUptime = () => {
            const now = new Date()
            const diff = now.getTime() - launchDate.getTime()

            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            const formattedHours = hours.toString().padStart(2, "0")
            const formattedMinutes = minutes.toString().padStart(2, "0")
            const formattedSeconds = seconds.toString().padStart(2, "0")

            setUptimeString(`${days}d ${formattedHours}:${formattedMinutes}:${formattedSeconds}`)
        }

        updateUptime()
        const interval = setInterval(updateUptime, 1000)
        return () => clearInterval(interval)
    }, [startString])

    return (
        <DashboardCard className="flex flex-col justify-center items-center text-center">
            <span className="text-xs opacity-70 uppercase tracking-widest mb-1">System Live Since</span>
            <div className="text-xl font-bold font-mono text-emerald-300 dark:text-emerald-400">
                {uptimeString || "CALCULATING..."}
            </div>
        </DashboardCard>
    )
}

export function DynamicStats({
    initialStats,
    monitorSettings,
    monitorDisplayMode,
}: DynamicStatsProps) {
    const { stats: fetchedStats, loading: statsLoading } = useStatsConfig()
    const stats = initialStats || fetchedStats
    const { isAdmin } = useAdminSession()

    const [monitors, setMonitors] = useState<UptimeRobotMonitor[]>([])
    const [monitorsLoading, setMonitorsLoading] = useState(true)

    useEffect(() => {
        const loadMonitors = async () => {
            try {
                const res = await fetch("/api/uptime", { cache: "no-store" })
                const data = await res.json()
                setMonitors(data.monitors ?? [])
            } catch (err) {
                console.error("Failed to fetch uptime data:", err)
            }
            setMonitorsLoading(false)
        }
        loadMonitors()
    }, [])

    const visibleMonitors = getVisibleMonitors(monitors, monitorSettings)

    if (!stats && statsLoading && monitorsLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full animate-pulse">
                {[1, 2].map((i) => (
                    <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                ))}
            </div>
        )
    }

    const totalItems = visibleMonitors.length > 0 ? visibleMonitors.length : 1
    const gridCols =
        totalItems === 1
            ? "grid-cols-1"
            : totalItems === 2
              ? "md:grid-cols-2"
              : totalItems === 3
                ? "md:grid-cols-3"
                : "md:grid-cols-2 lg:grid-cols-4"

    return (
        <div className={`grid grid-cols-1 ${gridCols} gap-4 h-full`}>
            {visibleMonitors.length > 0 ? (
                visibleMonitors.map((m) => (
                    <UptimeCard
                        key={m.id}
                        monitor={m}
                        label={m.setting.customLabel || m.friendly_name}
                        displayMode={monitorDisplayMode}
                        href={getMonitorLinkHref(m.setting, isAdmin)}
                    />
                ))
            ) : (
                <LiveSinceCard startString={stats?.launchDate || ""} />
            )}
        </div>
    )
}
