"use client"

import { Link as LinkIcon } from "lucide-react"
import { DashboardCard } from "@/components/dashboard-card"
import { cn } from "@/lib/utils"
import type { UptimeKumaMonitor, UptimeKumaStatus } from "@/lib/uptime-kuma"

const STATUS_STYLES: Record<UptimeKumaStatus, { label: string; className: string }> = {
    up: { label: "Up", className: "bg-emerald-500" },
    down: { label: "Down", className: "bg-red-600" },
    pending: { label: "Pending", className: "bg-orange-500" },
    maintenance: { label: "Maintenance", className: "bg-blue-600" },
}

function StatusBadge({ status }: { status: UptimeKumaStatus }) {
    const style = STATUS_STYLES[status]
    return (
        <span
            className={cn(
                "inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold text-white",
                style.className
            )}
        >
            {style.label}
        </span>
    )
}

function MonitorUrl({ url }: { url?: string }) {
    if (!url) return null

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-0 items-center gap-1 text-xs text-blue-100 hover:underline dark:text-slate-400"
        >
            <LinkIcon className="h-3 w-3 shrink-0" aria-hidden />
            <span className="truncate">{url}</span>
        </a>
    )
}

export function UptimeKumaPortfolioCard({ monitor }: { monitor: UptimeKumaMonitor }) {
    return (
        <DashboardCard className="h-full flex flex-col justify-center gap-2 px-4 py-4">
            <div className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-sm font-bold" title={monitor.name}>
                    {monitor.name}
                </span>
                <StatusBadge status={monitor.status} />
            </div>
            <MonitorUrl url={monitor.url} />
        </DashboardCard>
    )
}
