"use client"

import { useState } from "react"
import { Github } from "lucide-react"
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
    GithubRepoListStatus,
    GithubRepoOption,
} from "@/components/edit/github-repo-option"
import { useGithubRepos } from "@/hooks/use-github-repos"
import { normalizeRepoKey } from "@/lib/github-import"
import type { GitHubRepoSummary } from "@/types/github"

interface GithubLinkDialogProps {
    /** 現在このプロジェクトに紐づいているGitHub URL */
    currentUrl?: string
    disabled?: boolean
    onSelect: (repo: GitHubRepoSummary) => void
}

/** 既存プロジェクトに紐づけるGitHubリポジトリを1件選ぶ */
export function GithubLinkDialog({ currentUrl, disabled, onSelect }: GithubLinkDialogProps) {
    const { repos, loading, error, load } = useGithubRepos()
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState("")

    const currentKey = currentUrl ? normalizeRepoKey(currentUrl) : null

    const handleOpenChange = (next: boolean) => {
        setOpen(next)
        if (next) {
            setSelected("")
            void load()
        }
    }

    const handleLink = () => {
        const repo = repos.find((r) => r.fullName === selected)
        if (repo) {
            onSelect(repo)
        }
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm" disabled={disabled}>
                    <Github className="h-4 w-4" />
                    リポジトリを選択
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>GitHubリポジトリを紐づける</DialogTitle>
                    <DialogDescription>
                        このプロジェクトに対応するリポジトリを選んでください。GitHub
                        URLに加えて、説明・技術スタック・開始日・アプリURLも取り込みます（GitHub側が空の項目は今の内容を残します）。
                    </DialogDescription>
                </DialogHeader>

                <GithubRepoListStatus
                    loading={loading}
                    error={error}
                    empty={repos.length === 0}
                />

                {!loading && !error && repos.length > 0 && (
                    <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
                        {repos.map((repo) => (
                            <GithubRepoOption
                                key={repo.fullName}
                                repo={repo}
                                type="radio"
                                checked={selected === repo.fullName}
                                badge={
                                    currentKey && normalizeRepoKey(repo.htmlUrl) === currentKey
                                        ? "紐づけ中"
                                        : undefined
                                }
                                onSelect={() => setSelected(repo.fullName)}
                            />
                        ))}
                    </div>
                )}

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        キャンセル
                    </Button>
                    <Button type="button" disabled={!selected} onClick={handleLink}>
                        紐づける
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
