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
import { generateSummaries, type ProjectSummaryFields } from "@/lib/ai-summary-client"
import {
    buildProjectFromRepo,
    collectRegisteredRepoKeys,
    normalizeRepoKey,
} from "@/lib/github-import"
import type { Project } from "@/types/site-content"

interface GithubImportDialogProps {
    projects: Project[]
    onImport: (projects: Project[]) => void
}

export function GithubImportDialog({ projects, onImport }: GithubImportDialogProps) {
    const { repos, loading, error, load } = useGithubRepos()
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<string[]>([])
    const [useAi, setUseAi] = useState(false)
    const [importing, setImporting] = useState(false)
    const [message, setMessage] = useState("")

    const registeredKeys = collectRegisteredRepoKeys(projects)

    const handleOpenChange = (next: boolean) => {
        setOpen(next)
        if (next) {
            setSelected([])
            setMessage("")
            void load()
        }
    }

    const toggle = (fullName: string) => {
        setSelected((prev) =>
            prev.includes(fullName) ? prev.filter((n) => n !== fullName) : [...prev, fullName]
        )
    }

    const handleImport = async () => {
        const targets = repos.filter((repo) => selected.includes(repo.fullName))
        setImporting(true)
        setMessage("")

        const summaries = useAi
            ? await generateSummaries(targets)
            : new Map<string, ProjectSummaryFields>()
        const failed = useAi ? targets.length - summaries.size : 0

        onImport(
            targets.map((repo) => {
                const project = buildProjectFromRepo(repo, crypto.randomUUID())
                const summary = summaries.get(repo.htmlUrl)
                return summary ? { ...project, ...summary } : project
            })
        )

        setImporting(false)
        if (failed > 0) {
            setMessage(`${failed}件はAI生成に失敗したため、GitHubの情報のみ取り込みました`)
            return
        }
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

                <GithubRepoListStatus
                    loading={loading}
                    error={error}
                    empty={repos.length === 0}
                />

                {!loading && !error && repos.length > 0 && (
                    <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
                        {repos.map((repo) => {
                            const registered = registeredKeys.has(
                                normalizeRepoKey(repo.htmlUrl) ?? ""
                            )

                            return (
                                <GithubRepoOption
                                    key={repo.fullName}
                                    repo={repo}
                                    type="checkbox"
                                    checked={selected.includes(repo.fullName)}
                                    disabled={registered}
                                    badge={registered ? "登録済み" : undefined}
                                    onSelect={() => toggle(repo.fullName)}
                                />
                            )
                        })}
                    </div>
                )}

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={useAi}
                        onChange={(e) => setUseAi(e.target.checked)}
                    />
                    説明と技術スタックをAIで生成する（READMEをもとに作成します）
                </label>

                {message && <p className="text-sm text-amber-600">{message}</p>}

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        キャンセル
                    </Button>
                    <Button
                        type="button"
                        disabled={selected.length === 0 || importing}
                        onClick={handleImport}
                    >
                        {importing
                            ? useAi
                                ? "AIで生成中..."
                                : "追加中..."
                            : selected.length > 0
                              ? `${selected.length}件を追加`
                              : "追加"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
