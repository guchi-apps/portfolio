"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input, Label, Textarea } from "@/components/ui/input"
import { ConnectIconPicker } from "@/components/admin/connect-icon-picker"
import { ProjectLinksInput } from "@/components/admin/project-links-input"
import { TechStackInput } from "@/components/admin/tech-stack-input"
import { cn } from "@/lib/utils"
import {
    getMonitorSetting,
    getOrderedMonitors,
    reorderMonitorSettings,
} from "@/lib/monitor-settings"
import type { UptimeRobotMonitor } from "@/lib/uptimerobot"
import type {
    AppAccessibility,
    ConnectLink,
    MonitorDisplayMode,
    MonitorLinkVisibility,
    MonitorSetting,
    Project,
    SiteContent,
} from "@/types/site-content"
import { parseProjectPeriodForInput } from "@/lib/project-period"

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        })

        if (res.ok) {
            onSuccess()
        } else {
            setError("パスワードが正しくありません")
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>管理画面ログイン</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">パスワード</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "ログイン中..." : "ログイン"}
                        </Button>
                    </form>
                    <p className="mt-4 text-center text-sm text-slate-500">
                        <Link href="/" className="hover:underline">
                            サイトに戻る
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

function MonitorEditor({
    monitors,
    settings,
    displayMode,
    onSettingsChange,
    onDisplayModeChange,
}: {
    monitors: UptimeRobotMonitor[]
    settings: MonitorSetting[]
    displayMode: MonitorDisplayMode
    onSettingsChange: (settings: MonitorSetting[]) => void
    onDisplayModeChange: (displayMode: MonitorDisplayMode) => void
}) {
    const updateSetting = (monitorId: number, patch: Partial<MonitorSetting>) => {
        const index = settings.findIndex((s) => s.monitorId === monitorId)
        if (index >= 0) {
            onSettingsChange(
                settings.map((s, i) => (i === index ? { ...s, ...patch } : s))
            )
        } else {
            onSettingsChange([...settings, { monitorId, visible: true, ...patch }])
        }
    }

    const moveMonitor = (monitorId: number, direction: -1 | 1) => {
        onSettingsChange(reorderMonitorSettings(settings, monitors, monitorId, direction))
    }

    const orderedMonitors = getOrderedMonitors(monitors, settings)

    if (monitors.length === 0) {
        return (
            <p className="text-sm text-slate-500">
                UptimeRobot のモニターが取得できません。APIキーを確認してください。
            </p>
        )
    }

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <Label>表示方法（全モニター共通）</Label>
                <select
                    className="flex h-10 w-full max-w-xs rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                    value={displayMode}
                    onChange={(e) =>
                        onDisplayModeChange(e.target.value as MonitorDisplayMode)
                    }
                >
                    <option value="card">カード</option>
                    <option value="compact">コンパクト</option>
                    <option value="badge">バッジ</option>
                </select>
            </div>

            <div className="space-y-3">
            {orderedMonitors.map((monitor, index) => {
                const setting = getMonitorSetting(settings, monitor.id)

                return (
                    <div
                        key={monitor.id}
                        className={cn(
                            "rounded-lg border p-4 space-y-3 transition-colors",
                            setting.visible
                                ? "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
                                : "border-slate-300 border-dashed bg-slate-100 opacity-70 dark:border-slate-600 dark:bg-slate-900/70"
                        )}
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 min-w-0">
                                <span
                                    className={cn(
                                        "font-medium text-sm truncate",
                                        setting.visible
                                            ? "text-slate-700 dark:text-slate-200"
                                            : "text-slate-400 dark:text-slate-500"
                                    )}
                                >
                                    {setting.customLabel?.trim() || monitor.friendly_name}
                                </span>
                                {!setting.visible && (
                                    <span className="shrink-0 rounded bg-slate-300 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                        非表示
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={index === 0}
                                    onClick={() => moveMonitor(monitor.id, -1)}
                                    aria-label="上に移動"
                                >
                                    ↑
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={index === orderedMonitors.length - 1}
                                    onClick={() => moveMonitor(monitor.id, 1)}
                                    aria-label="下に移動"
                                >
                                    ↓
                                </Button>
                                <label
                                    className={cn(
                                        "flex items-center gap-2 text-sm",
                                        !setting.visible && "text-slate-400"
                                    )}
                                >
                                    <input
                                        type="checkbox"
                                        checked={setting.visible}
                                        onChange={(e) =>
                                            updateSetting(monitor.id, { visible: e.target.checked })
                                        }
                                    />
                                    表示
                                </label>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className={!setting.visible ? "text-slate-400" : undefined}>
                                表示名（任意）
                            </Label>
                            <Input
                                value={setting.customLabel ?? ""}
                                placeholder={monitor.friendly_name}
                                disabled={!setting.visible}
                                onChange={(e) =>
                                    updateSetting(monitor.id, {
                                        customLabel: e.target.value || undefined,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className={!setting.visible ? "text-slate-400" : undefined}>
                                リンク先 URL（任意）
                            </Label>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <Input
                                    className="min-w-0 flex-1 w-full"
                                    value={setting.linkUrl ?? ""}
                                    placeholder={monitor.url || "https://example.com"}
                                    disabled={!setting.visible}
                                    onChange={(e) =>
                                        updateSetting(monitor.id, {
                                            linkUrl: e.target.value || undefined,
                                        })
                                    }
                                />
                                {monitor.url && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="shrink-0 self-start sm:self-auto"
                                        disabled={!setting.visible}
                                        onClick={() =>
                                            updateSetting(monitor.id, { linkUrl: monitor.url })
                                        }
                                    >
                                        モニター先URLを使用
                                    </Button>
                                )}
                            </div>
                            <p className="text-xs text-slate-500">
                                空欄の場合はカードをクリックしても遷移しません
                            </p>
                        </div>
                        <div className="space-y-1">
                            <Label className={!setting.visible ? "text-slate-400" : undefined}>
                                リンクの表示
                            </Label>
                            <select
                                className="flex h-10 w-full max-w-xs rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                                value={setting.linkVisibility ?? "public"}
                                disabled={!setting.visible}
                                onChange={(e) =>
                                    updateSetting(monitor.id, {
                                        linkVisibility: e.target.value as MonitorLinkVisibility,
                                    })
                                }
                            >
                                <option value="public">全員に表示</option>
                                <option value="admin-only">管理者モードのみ表示</option>
                            </select>
                            <p className="text-xs text-slate-500">
                                リンク先 URL を設定した場合、カードから遷移できるようになります
                            </p>
                        </div>
                    </div>
                )
            })}
            </div>
        </div>
    )
}

function ProjectEditor({
    projects,
    onChange,
}: {
    projects: Project[]
    onChange: (projects: Project[]) => void
}) {
    const updateProject = (index: number, patch: Partial<Project>) => {
        onChange(projects.map((p, i) => (i === index ? { ...p, ...patch } : p)))
    }

    const addProject = () => {
        onChange([
            ...projects,
            {
                id: crypto.randomUUID(),
                title: "新しいプロジェクト",
                description: "",
                techStack: [],
                period: "",
            },
        ])
    }

    const removeProject = (index: number) => {
        onChange(projects.filter((_, i) => i !== index))
    }

    const moveProject = (index: number, direction: -1 | 1) => {
        const newIndex = index + direction
        if (newIndex < 0 || newIndex >= projects.length) return
        const next = [...projects]
        ;[next[index], next[newIndex]] = [next[newIndex], next[index]]
        onChange(next)
    }

    return (
        <div className="space-y-4">
            {projects.map((project, index) => (
                <div
                    key={project.id}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3"
                >
                    <div className="flex justify-between items-center gap-2">
                        <span className="font-medium truncate min-w-0">
                            {project.title.trim() || "（無題）"}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={index === 0}
                                onClick={() => moveProject(index, -1)}
                                aria-label="上に移動"
                            >
                                ↑
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={index === projects.length - 1}
                                onClick={() => moveProject(index, 1)}
                                aria-label="下に移動"
                            >
                                ↓
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeProject(index)}
                            >
                                削除
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1 min-w-0">
                            <Label>タイトル</Label>
                            <Input
                                value={project.title}
                                onChange={(e) => updateProject(index, { title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1 min-w-0">
                            <Label>プロジェクト開始</Label>
                            <Input
                                type="date"
                                value={parseProjectPeriodForInput(project.period)}
                                onChange={(e) =>
                                    updateProject(index, { period: e.target.value })
                                }
                                className="min-w-0"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label>説明</Label>
                        <Textarea
                            value={project.description}
                            onChange={(e) =>
                                updateProject(index, { description: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-1">
                        <Label>技術スタック</Label>
                        <TechStackInput
                            value={project.techStack}
                            onChange={(techStack) => updateProject(index, { techStack })}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label>GitHub URL</Label>
                        <Input
                            value={
                                Array.isArray(project.githubUrl)
                                    ? project.githubUrl.join(", ")
                                    : project.githubUrl ?? ""
                            }
                            onChange={(e) => {
                                const val = e.target.value.trim()
                                if (!val) {
                                    updateProject(index, { githubUrl: undefined })
                                    return
                                }
                                const urls = val.split(",").map((s) => s.trim()).filter(Boolean)
                                updateProject(index, {
                                    githubUrl: urls.length === 1 ? urls[0] : urls,
                                })
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label>アプリURL</Label>
                            <Input
                                value={project.appUrl ?? ""}
                                placeholder="https://example.com"
                                onChange={(e) => {
                                    const val = e.target.value.trim()
                                    updateProject(index, { appUrl: val || undefined })
                                }}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>アクセス可否</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                value={project.appAccessibility ?? "public"}
                                onChange={(e) =>
                                    updateProject(index, {
                                        appAccessibility: e.target.value as AppAccessibility,
                                    })
                                }
                            >
                                <option value="public">誰でもアクセス可</option>
                                <option value="registration-required">登録が必要</option>
                                <option value="inaccessible">アクセス不可</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label>リンク</Label>
                        <ProjectLinksInput
                            key={project.id}
                            value={project.links}
                            onChange={(links) => updateProject(index, { links })}
                        />
                    </div>
                </div>
            ))}
            <Button type="button" variant="outline" onClick={addProject}>
                プロジェクトを追加
            </Button>
        </div>
    )
}

export function AdminDashboard() {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null)
    const [content, setContent] = useState<SiteContent | null>(null)
    const [monitors, setMonitors] = useState<UptimeRobotMonitor[]>([])
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState("")

    const loadData = useCallback(async () => {
        const sessionRes = await fetch("/api/auth/session")
        const session = await sessionRes.json()
        if (!session.authenticated) {
            setAuthenticated(false)
            return
        }

        setAuthenticated(true)
        const [contentRes, monitorsRes] = await Promise.all([
            fetch("/api/admin/content"),
            fetch("/api/admin/monitors"),
        ])
        setContent(await contentRes.json())
        const monitorData = await monitorsRes.json()
        setMonitors(monitorData.monitors ?? [])
    }, [])

    useEffect(() => {
        let cancelled = false

        async function init() {
            const sessionRes = await fetch("/api/auth/session")
            const session = await sessionRes.json()
            if (cancelled) return

            if (!session.authenticated) {
                setAuthenticated(false)
                return
            }

            setAuthenticated(true)
            const [contentRes, monitorsRes] = await Promise.all([
                fetch("/api/admin/content"),
                fetch("/api/admin/monitors"),
            ])
            if (cancelled) return

            setContent(await contentRes.json())
            const monitorData = await monitorsRes.json()
            setMonitors(monitorData.monitors ?? [])
        }

        void init()
        return () => {
            cancelled = true
        }
    }, [])

    const handleSave = async () => {
        if (!content) return
        setSaving(true)
        setMessage("")

        const sanitized: SiteContent = {
            ...content,
            projects: content.projects.map((p) => ({
                ...p,
                techStack: p.techStack.filter(Boolean),
            })),
        }

        const res = await fetch("/api/admin/content", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sanitized),
        })

        setSaving(false)
        if (res.ok) {
            setContent(sanitized)
        }
        setMessage(res.ok ? "保存しました" : "保存に失敗しました")
    }

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" })
        setAuthenticated(false)
        setContent(null)
    }

    const updateConnectLink = (index: number, patch: Partial<ConnectLink>) => {
        if (!content) return
        setContent({
            ...content,
            connectLinks: content.connectLinks.map((link, i) =>
                i === index ? { ...link, ...patch } : link
            ),
        })
    }

    const addConnectLink = () => {
        if (!content) return
        setContent({
            ...content,
            connectLinks: [
                ...content.connectLinks,
                { name: "新しいリンク", icon: "ExternalLink", url: "https://" },
            ],
        })
    }

    const removeConnectLink = (index: number) => {
        if (!content) return
        setContent({
            ...content,
            connectLinks: content.connectLinks.filter((_, i) => i !== index),
        })
    }

    const moveConnectLink = (index: number, direction: -1 | 1) => {
        if (!content) return
        const newIndex = index + direction
        if (newIndex < 0 || newIndex >= content.connectLinks.length) return
        const next = [...content.connectLinks]
        ;[next[index], next[newIndex]] = [next[newIndex], next[index]]
        setContent({ ...content, connectLinks: next })
    }

    if (authenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <p className="text-slate-500">読み込み中...</p>
            </div>
        )
    }

    if (!authenticated) {
        return <LoginForm onSuccess={loadData} />
    }

    if (!content) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <p className="text-slate-500">コンテンツを読み込み中...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">管理画面</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/">サイトを見る</Link>
                        </Button>
                        <Button variant="outline" onClick={handleLogout}>
                            ログアウト
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>自己紹介</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={content.intro}
                            onChange={(e) => setContent({ ...content, intro: e.target.value })}
                            rows={6}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Connect リンク</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {content.connectLinks.map((link, index) => (
                            <div
                                key={index}
                                className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-4"
                            >
                                <div className="flex justify-between items-center gap-2">
                                    <span className="font-medium truncate min-w-0">
                                        {link.name.trim() || "（無題）"}
                                    </span>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={index === 0}
                                            onClick={() => moveConnectLink(index, -1)}
                                            aria-label="上に移動"
                                        >
                                            ↑
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={index === content.connectLinks.length - 1}
                                            onClick={() => moveConnectLink(index, 1)}
                                            aria-label="下に移動"
                                        >
                                            ↓
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeConnectLink(index)}
                                        >
                                            削除
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label>名前</Label>
                                        <Input
                                            value={link.name}
                                            onChange={(e) =>
                                                updateConnectLink(index, { name: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>URL</Label>
                                        <Input
                                            value={link.url}
                                            onChange={(e) =>
                                                updateConnectLink(index, { url: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>アイコン</Label>
                                    <ConnectIconPicker
                                        value={link.icon}
                                        onChange={(icon) => updateConnectLink(index, { icon })}
                                    />
                                </div>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addConnectLink}>
                            リンクを追加
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>UptimeRobot モニター</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MonitorEditor
                            monitors={monitors}
                            settings={content.monitorSettings}
                            displayMode={content.monitorDisplayMode}
                            onSettingsChange={(monitorSettings) =>
                                setContent({ ...content, monitorSettings })
                            }
                            onDisplayModeChange={(monitorDisplayMode) =>
                                setContent({ ...content, monitorDisplayMode })
                            }
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProjectEditor
                            projects={content.projects}
                            onChange={(projects) => setContent({ ...content, projects })}
                        />
                    </CardContent>
                </Card>

                <div className="flex items-center gap-4 sticky bottom-4 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur p-4 rounded-lg border">
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "保存中..." : "変更を保存"}
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/">サイトを見る</Link>
                    </Button>
                    {message && (
                        <span
                            className={
                                message.includes("失敗")
                                    ? "text-red-500 text-sm"
                                    : "text-emerald-600 text-sm"
                            }
                        >
                            {message}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
