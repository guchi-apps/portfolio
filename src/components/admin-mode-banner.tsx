"use client"

import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdminSession } from "@/hooks/use-admin-session"

export function AdminModeBanner() {
    const { isAdmin, loading } = useAdminSession()

    if (loading || !isAdmin) return null

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" })
        window.location.reload()
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-950 dark:text-amber-100">
            <div className="flex items-center gap-2 min-w-0">
                <ShieldCheck className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-sm font-medium">
                    管理者モードで閲覧中 — VPS ステータスなどの管理情報が表示されています
                </p>
            </div>
            <div className="flex items-center gap-2 sm:ml-auto shrink-0">
                <Button asChild variant="outline" size="sm" className="bg-transparent">
                    <Link href="/admin">管理画面</Link>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                    onClick={() => void handleLogout()}
                >
                    ログアウト
                </Button>
            </div>
        </div>
    )
}
