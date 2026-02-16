
"use client"

import { useEffect, useState } from "react"
import { DashboardCard } from "@/components/dashboard-card"
import { StatsConfig } from "@/lib/site-config"
import { UptimeRobotMonitor } from "@/lib/uptimerobot"
import { useStatsConfig } from "@/hooks/use-stats-config"

interface DynamicStatsProps {
    initialStats?: StatsConfig | null
    monitors?: UptimeRobotMonitor[]
}


function UptimeCard({ monitor }: { monitor: UptimeRobotMonitor }) {
    const ratioStr = monitor.custom_uptime_ratio || monitor.uptime_ratio || "0"
    const ratio = parseFloat(ratioStr.split('-')[0])

    // Status mapping
    // 0: paused, 1: not checked yet, 2: up, 8: seems down, 9: down
    let statusText = "Unknown"
    let statusColor = "text-slate-400"
    let isLive = false

    switch (monitor.status) {
        case 2:
            statusText = "Running"
            statusColor = "text-emerald-500 dark:text-emerald-400"
            isLive = true
            break
        case 8:
        case 9:
            statusText = "Down"
            statusColor = "text-red-500 dark:text-red-400"
            break
        case 0:
            statusText = "Paused"
            statusColor = "text-yellow-500 dark:text-yellow-400"
            break
        case 1:
            statusText = "Checking..."
            statusColor = "text-blue-500 dark:text-blue-400"
            break
    }

    return (
        <DashboardCard className="flex flex-col justify-center items-center text-center" live={isLive}>
            <span className="text-xs opacity-70 uppercase tracking-widest mb-2 truncate w-full px-2" title={monitor.friendly_name}>
                {monitor.friendly_name}
            </span>

            {/* Main: Current Status */}
            <div className={`text-2xl font-bold font-mono ${statusColor} mb-2`}>
                {statusText}
            </div>

            {/* Sub: Uptime Ratio (Smaller) */}
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {ratio}% uptime (30d)
            </div>
        </DashboardCard>
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

            const formattedHours = hours.toString().padStart(2, '0')
            const formattedMinutes = minutes.toString().padStart(2, '0')
            const formattedSeconds = seconds.toString().padStart(2, '0')

            setUptimeString(`${days}d ${formattedHours}:${formattedMinutes}:${formattedSeconds}`)
        }

        updateUptime()
        const interval = setInterval(updateUptime, 1000)
        return () => clearInterval(interval)
    }, [startString])

    return (
        <DashboardCard className="flex flex-col justify-center items-center text-center" live>
            <span className="text-xs opacity-70 uppercase tracking-widest mb-1">System Live Since</span>
            <div className="text-xl font-bold font-mono text-emerald-300 dark:text-emerald-400">
                {uptimeString || "CALCULATING..."}
            </div>
        </DashboardCard>
    )
}

export function DynamicStats({ initialStats, monitors = [] }: DynamicStatsProps) {
    const { stats: fetchedStats, loading: statsLoading } = useStatsConfig()
    // Prefer initialStats (server-side) over fetchedStats (client-side) if available
    const stats = initialStats || fetchedStats

    if (!stats && (statsLoading && !initialStats)) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full animate-pulse">
                {[1, 2].map((i) => (
                    <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                ))}
            </div>
        )
    }

    // Determine grid columns based on number of items
    // Monitors (N) or Default Uptime (1)
    const totalItems = monitors.length > 0 ? monitors.length : 1;
    const gridCols = totalItems === 1 ? 'grid-cols-1' : totalItems === 2 ? 'md:grid-cols-2' : totalItems === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';

    return (
        <div className={`grid grid-cols-1 ${gridCols} gap-4 h-full`}>
            {/* Monitors or Fallback Uptime */}
            {monitors.length > 0 ? (
                monitors.map((m) => (
                    <UptimeCard key={m.id} monitor={m} />
                ))
            ) : (
                <LiveSinceCard startString={stats?.launchDate || ""} />
            )}
        </div>
    )
}
