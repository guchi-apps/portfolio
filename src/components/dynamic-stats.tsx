"use client"

import { useEffect, useState } from "react"
import { DashboardCard } from "@/components/dashboard-card"
import { StatsConfig } from "@/lib/site-config"
import type { UptimeKumaMonitor } from "@/lib/uptime-kuma"
import { useStatsConfig } from "@/hooks/use-stats-config"
import { MonitorCardGrid } from "@/components/monitor-card"
import { UptimeKumaPortfolioCard } from "@/components/uptime-kuma-card"
import type { UptimeKumaSettings } from "@/types/site-content"

interface DynamicStatsProps {
    initialStats?: StatsConfig | null
    uptimeKumaSettings: UptimeKumaSettings
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

export function DynamicStats({ initialStats, uptimeKumaSettings }: DynamicStatsProps) {
    const { stats: fetchedStats, loading: statsLoading } = useStatsConfig()
    const stats = initialStats || fetchedStats

    const [monitors, setMonitors] = useState<UptimeKumaMonitor[]>([])
    const [monitorsLoading, setMonitorsLoading] = useState(uptimeKumaSettings.portfolioVisible)

    useEffect(() => {
        if (!uptimeKumaSettings.portfolioVisible) {
            return
        }

        const loadMonitors = async () => {
            try {
                const res = await fetch("/api/uptime-kuma/portfolio", { cache: "no-store" })
                const data = await res.json()
                setMonitors(data.monitors ?? [])
            } catch (err) {
                console.error("Failed to fetch Uptime Kuma data:", err)
            }
            setMonitorsLoading(false)
        }
        loadMonitors()
    }, [uptimeKumaSettings.portfolioVisible])

    if (!stats && statsLoading && monitorsLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full animate-pulse">
                {[1, 2].map((i) => (
                    <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                ))}
            </div>
        )
    }

    if (monitors.length === 0) {
        return <LiveSinceCard startString={stats?.launchDate || ""} />
    }

    return (
        <MonitorCardGrid count={monitors.length}>
            {monitors.map((monitor) => (
                <UptimeKumaPortfolioCard key={monitor.id} monitor={monitor} />
            ))}
        </MonitorCardGrid>
    )
}
