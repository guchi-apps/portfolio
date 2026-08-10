"use client"

import { useState } from "react"
import { Loader2, RefreshCw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GithubLinkDialog } from "@/components/edit/github-link-dialog"
import { generateSummary } from "@/lib/ai-summary-client"
import { buildProjectPatchFromRepo, getPrimaryGitHubUrl } from "@/lib/github-import"
import type { GitHubRepoSummary } from "@/types/github"
import type { Project } from "@/types/site-content"

interface ProjectGithubActionsProps {
    githubUrl?: string | string[]
    onApply: (patch: Partial<Project>) => void
}

/** プロジェクト1件分の、GitHub連携（紐づけ・再取得・AI生成）操作 */
export function ProjectGithubActions({ githubUrl, onApply }: ProjectGithubActionsProps) {
    const [pending, setPending] = useState<"sync" | "ai" | null>(null)
    const [message, setMessage] = useState("")
    const [failed, setFailed] = useState(false)

    const primaryUrl = getPrimaryGitHubUrl(githubUrl)
    const busy = pending !== null

    const report = (text: string, isError: boolean) => {
        setMessage(text)
        setFailed(isError)
    }

    const handleLink = (repo: GitHubRepoSummary) => {
        onApply(buildProjectPatchFromRepo(repo))
        report(`${repo.name} を紐づけて、GitHubの情報を反映しました`, false)
    }

    const handleSync = async () => {
        if (!primaryUrl) return
        setPending("sync")
        setMessage("")

        try {
            const res = await fetch("/api/admin/github/repo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ githubUrl: primaryUrl }),
            })
            const data = await res.json()
            if (!res.ok) {
                report(data.error ?? "GitHubから取得できませんでした", true)
                return
            }
            onApply(buildProjectPatchFromRepo(data.repo as GitHubRepoSummary))
            report("GitHubの情報を反映しました", false)
        } catch {
            report("GitHubから取得できませんでした", true)
        } finally {
            setPending(null)
        }
    }

    const handleGenerate = async () => {
        if (!primaryUrl) return
        setPending("ai")
        setMessage("")

        try {
            onApply(await generateSummary(primaryUrl))
            report("AIが説明と技術スタックを生成しました", false)
        } catch (error) {
            report(error instanceof Error ? error.message : "AIでの生成に失敗しました", true)
        } finally {
            setPending(null)
        }
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                <GithubLinkDialog
                    currentUrl={primaryUrl}
                    disabled={busy}
                    onSelect={handleLink}
                />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!primaryUrl || busy}
                    onClick={handleSync}
                >
                    {pending === "sync" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className="h-4 w-4" />
                    )}
                    GitHubから再取得
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!primaryUrl || busy}
                    onClick={handleGenerate}
                >
                    {pending === "ai" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="h-4 w-4" />
                    )}
                    {pending === "ai" ? "AIで生成中..." : "AIで説明を生成"}
                </Button>
            </div>
            {message && (
                <p className={`text-xs ${failed ? "text-red-500" : "text-emerald-600"}`}>
                    {message}
                </p>
            )}
        </div>
    )
}
