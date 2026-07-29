"use client"

import { useCallback, useEffect, useState } from "react"
import { SectionHeading } from "@/components/section-heading"
import type { RegisteredApp } from "@/lib/registered-apps"
import type { RegisteredUserAppResult } from "@/lib/registered-users"

const emptyApp: RegisteredApp = { id: "", label: "", database: "", enabled: true, sortOrder: 0 }

export function RegisteredUsersSection() {
    const [apps, setApps] = useState<RegisteredUserAppResult[]>([])
    const [settings, setSettings] = useState<RegisteredApp[]>([])
    const [form, setForm] = useState<RegisteredApp>(emptyApp)
    const [originalId, setOriginalId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState("")

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const [usersResponse, settingsResponse] = await Promise.all([
                fetch("/api/admin/registered-users", { cache: "no-store" }),
                fetch("/api/admin/registered-apps", { cache: "no-store" }),
            ])
            const usersData = await usersResponse.json() as { apps?: RegisteredUserAppResult[] }
            const settingsData = await settingsResponse.json() as { apps?: RegisteredApp[]; error?: string }
            setApps(usersData.apps ?? [])
            setSettings(settingsData.apps ?? [])
            if (settingsData.error) setMessage(settingsData.error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { void load() }, [load])

    function edit(app: RegisteredApp) {
        setOriginalId(app.id)
        setForm(app)
        setMessage("")
    }

    function resetForm() {
        setOriginalId(null)
        setForm(emptyApp)
    }

    async function save() {
        setSaving(true)
        setMessage("")
        try {
            const response = await fetch("/api/admin/registered-apps", {
                method: originalId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(originalId ? { originalId, app: form } : form),
            })
            const data = await response.json() as { error?: string }
            if (!response.ok) throw new Error(data.error || "保存に失敗しました")
            resetForm()
            setMessage("保存しました")
            await load()
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "保存に失敗しました")
        } finally {
            setSaving(false)
        }
    }

    async function remove(id: string) {
        if (!window.confirm(`${id} を削除しますか？`)) return
        const response = await fetch(`/api/admin/registered-apps?id=${encodeURIComponent(id)}`, { method: "DELETE" })
        const data = await response.json() as { error?: string }
        setMessage(response.ok ? "削除しました" : data.error || "削除に失敗しました")
        if (response.ok) await load()
    }

    return (
        <section className="space-y-4">
            <SectionHeading title="登録ユーザー" />

            <div className="rounded-lg border bg-white p-4 dark:bg-slate-900">
                <h3 className="mb-3 font-semibold">対象アプリ設定</h3>
                <div className="grid gap-3 md:grid-cols-5">
                    <input className="rounded border px-3 py-2 text-sm" placeholder="アプリID" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
                    <input className="rounded border px-3 py-2 text-sm" placeholder="表示名" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
                    <input className="rounded border px-3 py-2 text-sm" placeholder="DB名" value={form.database} onChange={(e) => setForm({ ...form, database: e.target.value })} />
                    <input className="rounded border px-3 py-2 text-sm" type="number" placeholder="表示順" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />有効</label>
                </div>
                <div className="mt-3 flex gap-2">
                    <button className="rounded bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900" onClick={() => void save()} disabled={saving}>{originalId ? "更新" : "追加"}</button>
                    {originalId && <button className="rounded border px-4 py-2 text-sm" onClick={resetForm}>キャンセル</button>}
                </div>
                {message && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{message}</p>}

                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-left dark:bg-slate-800"><tr><th className="px-3 py-2">ID</th><th className="px-3 py-2">表示名</th><th className="px-3 py-2">DB名</th><th className="px-3 py-2">状態</th><th className="px-3 py-2">操作</th></tr></thead>
                        <tbody className="divide-y">{settings.map((app) => <tr key={app.id}><td className="px-3 py-2">{app.id}</td><td className="px-3 py-2">{app.label}</td><td className="px-3 py-2 font-mono">{app.database}</td><td className="px-3 py-2">{app.enabled ? "有効" : "無効"}</td><td className="px-3 py-2"><button className="mr-3 underline" onClick={() => edit(app)}>編集</button><button className="text-red-600 underline" onClick={() => void remove(app.id)}>削除</button></td></tr>)}</tbody>
                    </table>
                </div>
            </div>

            {loading ? <p className="text-sm text-slate-500">読み込み中...</p> : <div className="space-y-4">
                {apps.map((app) => <div key={app.id} className="overflow-hidden rounded-lg border bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b px-4 py-3"><h3 className="font-semibold">{app.label}</h3><span className="text-sm text-slate-500">{app.users.length}人</span></div>
                    {app.error ? <p className="px-4 py-3 text-sm text-red-600">{app.error}</p> : app.users.length === 0 ? <p className="px-4 py-3 text-sm text-slate-500">登録ユーザーはいません。</p> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-left dark:bg-slate-800"><tr><th className="px-4 py-2 font-medium">名前</th><th className="px-4 py-2 font-medium">メールアドレス</th><th className="px-4 py-2 font-medium">Google連携</th><th className="px-4 py-2 font-medium">ID</th></tr></thead><tbody className="divide-y">{app.users.map((user) => <tr key={user.id}><td className="px-4 py-2">{user.name || "—"}</td><td className="px-4 py-2">{user.email || "—"}</td><td className="px-4 py-2">{user.googleLinked ? "連携済み" : "未連携"}</td><td className="px-4 py-2 font-mono text-xs text-slate-500">{user.id}</td></tr>)}</tbody></table></div>}
                </div>)}
            </div>}
        </section>
    )
}
