"use client"

import { useCallback, useState } from "react"
import type { GitHubRepoSummary } from "@/types/github"

/** 編集画面でGitHubの公開リポジトリ一覧を読み込む */
export function useGithubRepos() {
    const [repos, setRepos] = useState<GitHubRepoSummary[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const load = useCallback(async () => {
        setLoading(true)
        setError("")
        setRepos([])

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

    return { repos, loading, error, load }
}
