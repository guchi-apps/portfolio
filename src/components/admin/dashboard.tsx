"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { AdminLoginForm } from "@/components/admin-login-form"
import { ServerStats } from "@/components/server-stats"
import { Button } from "@/components/ui/button"

export function AdminDashboard() {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null)

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
            </div>
        </div>
    )
}
