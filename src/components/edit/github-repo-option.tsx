"use client"

import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { GitHubRepoSummary } from "@/types/github"

interface GithubRepoOptionProps {
    repo: GitHubRepoSummary
    /** チェックボックス（複数選択）かラジオ（単一選択）か */
    type: "checkbox" | "radio"
    checked: boolean
    disabled?: boolean
    /** 「登録済み」など、リポジトリ名の横に出すラベル */
    badge?: string
    onSelect: () => void
}

/** リポジトリ選択ダイアログの1行分 */
export function GithubRepoOption({
    repo,
    type,
    checked,
    disabled,
    badge,
    onSelect,
}: GithubRepoOptionProps) {
    return (
        <label
            className={`flex gap-3 rounded-lg border p-3 ${
                disabled
                    ? "cursor-not-allowed border-slate-200 opacity-60 dark:border-slate-800"
                    : "cursor-pointer border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
            }`}
        >
            <input
                type={type}
                name={type === "radio" ? "github-repo" : undefined}
                className="mt-1 shrink-0"
                disabled={disabled}
                checked={checked}
                onChange={onSelect}
            />
            <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{repo.name}</span>
                    {badge && <Badge variant="secondary">{badge}</Badge>}
                </div>
                {repo.description && <p className="text-sm text-slate-500">{repo.description}</p>}
                {repo.languages.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {repo.languages.map((language) => (
                            <Badge key={language} variant="outline">
                                {language}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </label>
    )
}

/** 読み込み中・エラー・0件をまとめて表示する */
export function GithubRepoListStatus({
    loading,
    error,
    empty,
}: {
    loading: boolean
    error: string
    empty: boolean
}) {
    if (loading) {
        return (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                読み込み中...
            </div>
        )
    }

    if (error) {
        return <p className="py-6 text-sm text-red-500">{error}</p>
    }

    if (empty) {
        return <p className="py-6 text-sm text-slate-500">取り込めるリポジトリがありません</p>
    }

    return null
}
