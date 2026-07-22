"use client"

import { useEffect, useState } from "react"
import { SectionHeading } from "@/components/section-heading"
import type { RegisteredUserAppResult } from "@/lib/registered-users"

export function RegisteredUsersSection() {
    const [apps, setApps] = useState<RegisteredUserAppResult[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                const response = await fetch("/api/admin/registered-users", { cache: "no-store" })
                const data = (await response.json()) as { apps?: RegisteredUserAppResult[] }
                if (!cancelled) setApps(data.apps ?? [])
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
            <SectionHeading title="登録ユーザー" />
            {loading ? (
                <p className="text-sm text-slate-500">読み込み中...</p>
            ) : (
                <div className="space-y-4">
                    {apps.map((app) => (
                        <div key={app.id} className="overflow-hidden rounded-lg border bg-white dark:bg-slate-900">
                            <div className="flex items-center justify-between border-b px-4 py-3">
                                <h3 className="font-semibold">{app.label}</h3>
                                <span className="text-sm text-slate-500">{app.users.length}人</span>
                            </div>
                            {app.error ? (
                                <p className="px-4 py-3 text-sm text-red-600">{app.error}</p>
                            ) : app.users.length === 0 ? (
                                <p className="px-4 py-3 text-sm text-slate-500">登録ユーザーはいません。</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 text-left dark:bg-slate-800">
                                            <tr>
                                                <th className="px-4 py-2 font-medium">名前</th>
                                                <th className="px-4 py-2 font-medium">メールアドレス</th>
                                                <th className="px-4 py-2 font-medium">Google連携</th>
                                                <th className="px-4 py-2 font-medium">ID</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {app.users.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="px-4 py-2">{user.name || "—"}</td>
                                                    <td className="px-4 py-2">{user.email || "—"}</td>
                                                    <td className="px-4 py-2">{user.googleLinked ? "連携済み" : "未連携"}</td>
                                                    <td className="px-4 py-2 font-mono text-xs text-slate-500">{user.id}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
