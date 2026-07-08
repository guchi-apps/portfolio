"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { AdminLoginForm } from "@/components/admin-login-form"
import { MonitorCard, MonitorCardGrid } from "@/components/monitor-card"
import { SectionHeading } from "@/components/section-heading"
import { ServerStats } from "@/components/server-stats"
import { Button } from "@/components/ui/button"
import { useSiteContent } from "@/components/site-content-provider"
import { getUptimeRobotStatusInfo, type UptimeRobotMonitor } from "@/lib/uptimerobot"
import { getUptimeKumaStatusInfo, type UptimeKumaMonitor } from "@/lib/uptime-kuma"

function UptimeRobotSection() {
    const [monitors, setMonitors] = useState<UptimeRobotMonitor[]>([])

    useEffect(() => {
        let cancelled = false

        async function load() {
            const res = await fetch("/api/admin/monitors")
            const data = (await res.json()) as { monitors?: UptimeRobotMonitor[] }
            if (!cancelled) setMonitors(data.monitors ?? [])
        }

        void load()
        return () => {
            cancelled = true
        }
    }, [])

    if (monitors.length === 0) return null

    return (
        <section className="space-y-4">
            <SectionHeading title="UptimeRobot" />
            <MonitorCardGrid count={monitors.length}>
                {monitors.map((monitor) => {
                    const status = getUptimeRobotStatusInfo(monitor.status)
                    const ratioStr = monitor.custom_uptime_ratio || monitor.uptime_ratio || "0"
                    const ratio = parseFloat(ratioStr.split("-")[0])
                    return (
                        <MonitorCard
                            key={monitor.id}
                            label={monitor.friendly_name}
                            statusText={status.text}
                            statusColor={status.color}
                            uptimeLabel={`${ratio}% uptime (30d)`}
                            href={monitor.url}
                        />
                    )
                })}
            </MonitorCardGrid>
        </section>
    )
}

function UptimeKumaSection({ showLink, linkUrl }: { showLink: boolean; linkUrl?: string }) {
    const [monitors, setMonitors] = useState<UptimeKumaMonitor[]>([])

    useEffect(() => {
        let cancelled = false

        async function load() {
            const res = await fetch("/api/uptime-kuma")
            const data = (await res.json()) as { monitors?: UptimeKumaMonitor[] }
            if (!cancelled) setMonitors(data.monitors ?? [])
        }

        void load()
        return () => {
            cancelled = true
        }
    }, [])

    if (monitors.length === 0) return null

    const href = showLink ? linkUrl : undefined

    return (
        <section className="space-y-4">
            <SectionHeading title="Uptime Kuma" />
            <MonitorCardGrid count={monitors.length}>
                {monitors.map((monitor) => {
                    const status = getUptimeKumaStatusInfo(monitor.status)
                    return (
                        <MonitorCard
                            key={monitor.id}
                            label={monitor.name}
                            statusText={status.text}
                            statusColor={status.color}
                            uptimeLabel={
                                monitor.uptime24h !== null
                                    ? `${monitor.uptime24h.toFixed(2)}% uptime (24h)`
                                    : undefined
                            }
                            href={href}
                        />
                    )
                })}
            </MonitorCardGrid>
        </section>
    )
}

export function AdminDashboard() {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null)
    const content = useSiteContent()

    const loadSession = useCallback(async () => {
        const res = await fetch("/api/auth/session")
        const data = (await res.json()) as { authenticated: boolean }
        setAuthenticated(data.authenticated)
    }, [])

    useEffect(() => {
        let cancelled = false

        async function init() {
            const res = await fetch("/api/auth/session")
            const data = (await res.json()) as { authenticated: boolean }
            if (cancelled) return
            setAuthenticated(data.authenticated)
        }

        void init()
        return () => {
            cancelled = true
        }
    }, [])

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" })
        setAuthenticated(false)
    }

    if (authenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <p className="text-slate-500">読み込み中...</p>
            </div>
        )
    }

    if (!authenticated) {
        return <AdminLoginForm onSuccess={loadSession} />
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">ダッシュボード</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/">サイトを見る</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/edit">編集画面</Link>
                        </Button>
                        <Button variant="outline" onClick={handleLogout}>
                            ログアウト
                        </Button>
                    </div>
                </div>

                <ServerStats />
                <UptimeRobotSection />
                {content.uptimeKumaSettings.dashboardVisible && (
                    <UptimeKumaSection
                        showLink={content.uptimeKumaSettings.dashboardShowLink}
                        linkUrl={content.uptimeKumaSettings.linkUrl}
                    />
                )}
            </div>
        </div>
    )
}
