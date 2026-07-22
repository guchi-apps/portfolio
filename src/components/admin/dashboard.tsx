"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { AdminLoginForm } from "@/components/admin-login-form"
import { MonitorCard, MonitorCardGrid } from "@/components/monitor-card"
import { SectionHeading } from "@/components/section-heading"
import { ServerStats } from "@/components/server-stats"
import { Button } from "@/components/ui/button"
import { useSiteContent } from "@/components/site-content-provider"
import { UptimeKumaDashboardCard } from "@/components/uptime-kuma-card"
import { RegisteredUsersSection } from "@/components/admin/registered-users-section"
import { getUptimeRobotStatusInfo, type UptimeRobotMonitor } from "@/lib/uptimerobot"
import type { UptimeKumaMonitor } from "@/lib/uptime-kuma"

function UptimeRobotSection() {
    const [monitors, setMonitors] = useState<UptimeRobotMonitor[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                const res = await fetch("/api/admin/monitors")
                const data = (await res.json()) as { monitors?: UptimeRobotMonitor[] }
                if (!cancelled) setMonitors(data.monitors ?? [])
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        void load()
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <section className="space-y-4">
            <SectionHeading title="UptimeRobot" />
            {loading ? (
                <p className="text-sm text-slate-500">読み込み中...</p>
            ) : monitors.length === 0 ? (
                <p className="text-sm text-slate-500">
                    UptimeRobot のモニターが取得できません。APIキーを確認してください。
                </p>
            ) : (
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
            )}
        </section>
    )
}

function UptimeKumaSection() {
    const [monitors, setMonitors] = useState<UptimeKumaMonitor[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                const res = await fetch("/api/uptime-kuma/dashboard")
                const data = (await res.json()) as { monitors?: UptimeKumaMonitor[] }
                if (!cancelled) setMonitors(data.monitors ?? [])
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        void load()
        return () => {
            cancelled = true
        }
    }, [])

    if (!loading && monitors.length === 0) return null

    return (
        <section className="space-y-4">
            <SectionHeading title="Uptime Kuma" />
            {loading ? (
                <p className="text-sm text-slate-500">読み込み中...</p>
            ) : (
                <MonitorCardGrid count={monitors.length}>
                    {monitors.map((monitor) => (
                        <UptimeKumaDashboardCard key={monitor.id} monitor={monitor} />
                    ))}
                </MonitorCardGrid>
            )}
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
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-bold shrink-0">ダッシュボード</h1>
                    <div className="flex flex-wrap gap-2">
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
                <RegisteredUsersSection />
                {content.uptimeKumaSettings.dashboardVisible && <UptimeKumaSection />}
                <UptimeRobotSection />
            </div>
        </div>
    )
}
