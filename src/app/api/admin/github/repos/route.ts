import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { fetchUserRepos } from "@/lib/github"
import { findGitHubUsername } from "@/lib/github-import"
import { getSiteContent } from "@/lib/site-content"

export async function GET() {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const username =
        findGitHubUsername(getSiteContent().connectLinks) || process.env.GITHUB_USERNAME
    if (!username) {
        return NextResponse.json(
            { error: "GitHubのユーザー名が見つかりません。Connect リンクにGitHubのプロフィールURLを登録してください。" },
            { status: 400 },
        )
    }

    const repos = await fetchUserRepos(username)
    if (!repos) {
        return NextResponse.json(
            { error: "GitHubからリポジトリ一覧を取得できませんでした。" },
            { status: 502 },
        )
    }

    return NextResponse.json({ username, repos })
}
