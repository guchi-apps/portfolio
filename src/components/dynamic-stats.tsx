"use client"

import { useEffect, useState } from "react"
import type { UptimeKumaMonitor } from "@/lib/uptime-kuma"
import { MonitorCardGrid } from "@/components/monitor-card"
import { UptimeKumaPortfolioCard } from "@/components/uptime-kuma-card"
import type { UptimeKumaSettings } from "@/types/site-content"

interface DynamicStatsProps {
    uptimeKumaSettings: UptimeKumaSettings
}

export function DynamicStats({ uptimeKumaSettings }: DynamicStatsProps) {
    const [monitors, setMonitors] = useState<UptimeKumaMonitor[]>([])

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
        }
        loadMonitors()
    }, [uptimeKumaSettings.portfolioVisible])

    if (monitors.length === 0) {
        return null
    }

    return (
        <MonitorCardGrid count={monitors.length}>
            {monitors.map((monitor) => (
                <UptimeKumaPortfolioCard key={monitor.id} monitor={monitor} />
            ))}
        </MonitorCardGrid>
    )
}
