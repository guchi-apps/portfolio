"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input, Label, Textarea } from "@/components/ui/input"
import { AdminLoginForm } from "@/components/admin-login-form"
import { CollapsibleSection } from "@/components/edit/collapsible-section"
import { ConnectIconPicker } from "@/components/edit/connect-icon-picker"
import { ProjectImagesInput } from "@/components/edit/project-images-input"
import { ProjectLinksInput } from "@/components/edit/project-links-input"
import { TechStackInput } from "@/components/edit/tech-stack-input"
import type { AppAccessibility, ConnectLink, Project, SiteContent } from "@/types/site-content"
import { parseProjectPeriodForInput } from "@/lib/project-period"

function UptimeKumaEditor({
    settings,
    onChange,
}: {
    settings: SiteContent["uptimeKumaSettings"]
    onChange: (settings: SiteContent["uptimeKumaSettings"]) => void
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={settings.portfolioVisible}
                    onChange={(e) => onChange({ ...settings, portfolioVisible: e.target.checked })}
                />
                ポートフォリオに表示
            </label>
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
                    className="rounded-lg border border-slate-200 dark:border-slate-700 p-4"
                >
                    <Collapsible>
                        <div className="flex justify-between items-center gap-2">
                            <CollapsibleTrigger asChild>
                                <button
                                    type="button"
                                    className="group flex items-center gap-2 min-w-0 text-left"
                                >
                                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-data-[state=open]:rotate-180" />
                                    <span className="font-medium truncate min-w-0">
                                        {project.title.trim() || "（無題）"}
                                    </span>
                                </button>
                            </CollapsibleTrigger>
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
                        <CollapsibleContent>
                            <div className="space-y-3 pt-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1 min-w-0">
                                        <Label>タイトル</Label>
                                        <Input
                                            value={project.title}
                                            onChange={(e) =>
                                                updateProject(index, { title: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-1 min-w-0 overflow-hidden">
                                        <Label>プロジェクト開始</Label>
                                        <Input
                                            type="date"
                                            value={parseProjectPeriodForInput(project.period)}
                                            onChange={(e) =>
                                                updateProject(index, { period: e.target.value })
                                            }
                                            className="min-w-0 max-w-full"
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
                                            const urls = val
                                                .split(",")
                                                .map((s) => s.trim())
                                                .filter(Boolean)
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
                                <div className="space-y-1">
                                    <Label>写真</Label>
                                    <ProjectImagesInput
                                        value={project.images}
                                        onChange={(images) => updateProject(index, { images })}
                                    />
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            ))}
            <Button type="button" variant="outline" onClick={addProject}>
                プロジェクトを追加
            </Button>
        </div>
    )
}

export function EditDashboard() {
    const searchParams = useSearchParams()
    const loginError = searchParams.get("error") === "unauthorized_email"
    const [authenticated, setAuthenticated] = useState<boolean | null>(null)
    const [content, setContent] = useState<SiteContent | null>(null)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState("")

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
            const contentRes = await fetch("/api/admin/content")
            if (cancelled) return

            setContent(await contentRes.json())
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
        return (
            <AdminLoginForm
                error={loginError ? "このGoogleアカウントでは編集画面にログインできません" : undefined}
            />
        )
    }

    if (!content) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <p className="text-slate-500">コンテンツを読み込み中...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 pb-28">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-bold shrink-0">編集画面</h1>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/">サイトを見る</Link>
                        </Button>
                        <Button variant="outline" onClick={handleLogout}>
                            ログアウト
                        </Button>
                    </div>
                </div>

                <CollapsibleSection title="自己紹介">
                    <Textarea
                        value={content.intro}
                        onChange={(e) => setContent({ ...content, intro: e.target.value })}
                        rows={6}
                    />
                </CollapsibleSection>

                <CollapsibleSection title="Connect リンク">
                    <div className="space-y-3">
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
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Uptime Kuma">
                    <UptimeKumaEditor
                        settings={content.uptimeKumaSettings}
                        onChange={(uptimeKumaSettings) =>
                            setContent({ ...content, uptimeKumaSettings })
                        }
                    />
                </CollapsibleSection>

                <Card className="py-6">
                    <div className="px-6">
                        <span className="leading-none font-semibold">Projects</span>
                    </div>
                    <div className="px-6">
                        <ProjectEditor
                            projects={content.projects}
                            onChange={(projects) => setContent({ ...content, projects })}
                        />
                    </div>
                </Card>
            </div>
            <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center p-4">
                <div className="flex items-center gap-4 w-full max-w-4xl bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur p-4 rounded-lg border">
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
