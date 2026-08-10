import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { fetchRepo, parseGitHubRepoUrl } from "@/lib/github"

/** 登録済みプロジェクトのGitHub URLから、最新のリポジトリ情報を取り直す */
export async function POST(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { githubUrl } = (await request.json()) as { githubUrl?: string }
    const target = githubUrl ? parseGitHubRepoUrl(githubUrl) : null
    if (!target) {
        return NextResponse.json(
            { error: "GitHubリポジトリのURLではありません。" },
            { status: 400 },
        )
    }

    const repo = await fetchRepo(target.owner, target.repo)
    if (!repo) {
        return NextResponse.json(
            { error: "GitHubからリポジトリ情報を取得できませんでした。" },
            { status: 502 },
        )
    }

    return NextResponse.json({ repo })
}
