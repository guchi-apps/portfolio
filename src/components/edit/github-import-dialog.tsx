"use client"

import { useCallback, useState } from "react"
import { Github, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    buildProjectFromRepo,
    collectRegisteredRepoKeys,
    normalizeRepoKey,
} from "@/lib/github-import"
import type { GitHubRepoSummary } from "@/types/github"
import type { Project } from "@/types/site-content"

interface GithubImportDialogProps {
    projects: Project[]
    onImport: (projects: Project[]) => void
}

export function GithubImportDialog({ projects, onImport }: GithubImportDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [repos, setRepos] = useState<GitHubRepoSummary[]>([])
    const [selected, setSelected] = useState<string[]>([])

    const registeredKeys = collectRegisteredRepoKeys(projects)

    const loadRepos = useCallback(async () => {
        setLoading(true)
        setError("")
        setRepos([])
        setSelected([])

        try {
            const res = await fetch("/api/admin/github/repos")
            const data = await res.json()
            if (!res.ok) {
                setError(data.error ?? "リポジトリ一覧を取得できませんでした")
                return
            }
            setRepos(data.repos as GitHubRepoSummary[])
        } catch {
            setError("リポジトリ一覧を取得できませんでした")
        } finally {
            setLoading(false)
        }
    }, [])

    const handleOpenChange = (next: boolean) => {
        setOpen(next)
        if (next) {
            void loadRepos()
        }
    }

    const toggle = (fullName: string) => {
        setSelected((prev) =>
            prev.includes(fullName) ? prev.filter((n) => n !== fullName) : [...prev, fullName]
        )
    }

    const handleImport = () => {
        onImport(
            repos
                .filter((repo) => selected.includes(repo.fullName))
                .map((repo) => buildProjectFromRepo(repo, crypto.randomUUID()))
        )
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline">
                    <Github className="h-4 w-4" />
                    GitHubから取得
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>GitHubからプロジェクトを取り込む</DialogTitle>
                    <DialogDescription>
                        取り込むリポジトリを選択してください。タイトル・説明・技術スタック・開始日はGitHubの情報から自動で入力されます（追加後に編集できます）。
                    </DialogDescription>
                </DialogHeader>

                {loading && (
                    <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        読み込み中...
                    </div>
                )}

                {!loading && error && <p className="py-6 text-sm text-red-500">{error}</p>}

                {!loading && !error && repos.length === 0 && (
                    <p className="py-6 text-sm text-slate-500">取り込めるリポジトリがありません</p>
                )}

                {!loading && !error && repos.length > 0 && (
                    <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
                        {repos.map((repo) => {
                            const registered = registeredKeys.has(
                                normalizeRepoKey(repo.htmlUrl) ?? ""
                            )

                            return (
                                <label
                                    key={repo.fullName}
                                    className={`flex gap-3 rounded-lg border p-3 ${
                                        registered
                                            ? "cursor-not-allowed border-slate-200 opacity-60 dark:border-slate-800"
                                            : "cursor-pointer border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        className="mt-1 shrink-0"
                                        disabled={registered}
                                        checked={selected.includes(repo.fullName)}
                                        onChange={() => toggle(repo.fullName)}
                                    />
                                    <div className="min-w-0 space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-medium">{repo.name}</span>
                                            {registered && (
                                                <Badge variant="secondary">登録済み</Badge>
                                            )}
                                        </div>
                                        {repo.description && (
                                            <p className="text-sm text-slate-500">
                                                {repo.description}
                                            </p>
                                        )}
                                        {repo.languages.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {repo.languages.slice(0, 5).map((language) => (
                                                    <Badge key={language} variant="outline">
                                                        {language}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </label>
                            )
                        })}
                    </div>
                )}

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        キャンセル
                    </Button>
                    <Button type="button" disabled={selected.length === 0} onClick={handleImport}>
                        {selected.length > 0 ? `${selected.length}件を追加` : "追加"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
