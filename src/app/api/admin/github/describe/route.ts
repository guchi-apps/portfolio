import { NextRequest, NextResponse } from "next/server"
import { generateProjectSummary, README_MAX_CHARS } from "@/lib/ai-project-summary"
import { isAuthenticated } from "@/lib/auth"
import { fetchRepo, fetchRepoReadme, parseGitHubRepoUrl } from "@/lib/github"

/** リポジトリのREADME等をもとに、説明文と技術スタックをAIで生成する */
export async function POST(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = process.env.CLAUDE_CODE_OAUTH_TOKEN
    if (!token) {
        return NextResponse.json(
            { error: "AI生成が設定されていません（CLAUDE_CODE_OAUTH_TOKEN が未設定です）。" },
            { status: 501 },
        )
    }

    const { githubUrl } = (await request.json()) as { githubUrl?: string }
    const target = githubUrl ? parseGitHubRepoUrl(githubUrl) : null
    if (!target) {
        return NextResponse.json(
            { error: "GitHubリポジトリのURLではありません。" },
            { status: 400 },
        )
    }

    const [repo, readme] = await Promise.all([
        fetchRepo(target.owner, target.repo),
        fetchRepoReadme(target.owner, target.repo, README_MAX_CHARS),
    ])
    if (!repo) {
        return NextResponse.json(
            { error: "GitHubからリポジトリ情報を取得できませんでした。" },
            { status: 502 },
        )
    }

    try {
        return NextResponse.json(await generateProjectSummary(token, repo, readme))
    } catch (error) {
        console.error("AI summary error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "AIでの生成に失敗しました。" },
            { status: 502 },
        )
    }
}
