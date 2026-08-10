import type { GitHubRepoSummary } from "@/types/github"

interface GitHubRepo {
    owner: string
    repo: string
}

interface GitHubRelease {
    tag_name: string
    published_at: string
}

interface GitHubTag {
    name: string
    commit: { sha: string }
}

interface GitHubCommit {
    commit: { committer: { date: string } }
}

export interface ReleaseInfo {
    version: string
    publishedAt: string | null
}

function githubHeaders(): HeadersInit {
    const headers: HeadersInit = {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    const token = process.env.GITHUB_TOKEN
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    return headers
}

export function parseGitHubRepoUrl(url: string): GitHubRepo | null {
    try {
        const parsed = new URL(url)
        if (parsed.hostname !== "github.com") {
            return null
        }

        const [owner, repo, ...rest] = parsed.pathname.split("/").filter(Boolean)
        if (!owner || !repo || rest.length > 0) {
            return null
        }

        return {
            owner,
            repo: repo.replace(/\.git$/, ""),
        }
    } catch {
        return null
    }
}

export function stripLeadingV(tag: string): string {
    return tag.startsWith("v") ? tag.slice(1) : tag
}

async function fetchGitHubJson<T>(url: string): Promise<T | null> {
    try {
        const response = await fetch(url, {
            headers: githubHeaders(),
            next: { revalidate: 3600 },
        })

        if (!response.ok) {
            return null
        }

        return (await response.json()) as T
    } catch {
        return null
    }
}

export async function fetchLatestReleaseInfo(
    owner: string,
    repo: string,
): Promise<ReleaseInfo | null> {
    const release = await fetchGitHubJson<GitHubRelease>(
        `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
    )
    if (release?.tag_name) {
        return {
            version: stripLeadingV(release.tag_name),
            publishedAt: release.published_at ?? null,
        }
    }

    const tags = await fetchGitHubJson<GitHubTag[]>(
        `https://api.github.com/repos/${owner}/${repo}/tags?per_page=1`,
    )
    const latestTag = tags?.[0]
    if (!latestTag) return null

    const commitData = await fetchGitHubJson<GitHubCommit>(
        `https://api.github.com/repos/${owner}/${repo}/commits/${latestTag.commit.sha}`,
    )

    return {
        version: stripLeadingV(latestTag.name),
        publishedAt: commitData?.commit?.committer?.date ?? null,
    }
}

interface GitHubUserRepo {
    name: string
    full_name: string
    description: string | null
    html_url: string
    homepage: string | null
    created_at: string
    fork: boolean
    archived: boolean
}

/** 全体に占める割合がこの値未満の言語は、技術スタックとしてノイズになるため除外する */
const LANGUAGE_RATIO_THRESHOLD = 0.05

async function fetchRepoLanguages(owner: string, repo: string): Promise<string[]> {
    const languages = await fetchGitHubJson<Record<string, number>>(
        `https://api.github.com/repos/${owner}/${repo}/languages`,
    )
    if (!languages) return []

    const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0)
    if (total === 0) return []

    return Object.entries(languages)
        .filter(([, bytes]) => bytes / total >= LANGUAGE_RATIO_THRESHOLD)
        .sort(([, a], [, b]) => b - a)
        .map(([language]) => language)
}

async function toRepoSummary(owner: string, repo: GitHubUserRepo): Promise<GitHubRepoSummary> {
    return {
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        htmlUrl: repo.html_url,
        homepage: repo.homepage?.trim() || null,
        createdAt: repo.created_at,
        languages: await fetchRepoLanguages(owner, repo.name),
    }
}

/** 指定ユーザーの公開リポジトリ一覧（fork・アーカイブ済みは除く）を取得する */
export async function fetchUserRepos(username: string): Promise<GitHubRepoSummary[] | null> {
    const repos = await fetchGitHubJson<GitHubUserRepo[]>(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&type=owner&sort=updated`,
    )
    if (!repos) return null

    return Promise.all(
        repos
            .filter((repo) => !repo.fork && !repo.archived)
            .map((repo) => toRepoSummary(username, repo)),
    )
}

/** 単一のリポジトリ情報を取得する */
export async function fetchRepo(owner: string, repo: string): Promise<GitHubRepoSummary | null> {
    const data = await fetchGitHubJson<GitHubUserRepo>(`https://api.github.com/repos/${owner}/${repo}`)
    if (!data) return null

    return toRepoSummary(owner, data)
}

/**
 * READMEの取得結果。
 * 「READMEが無い」と「取得に失敗した」は区別する必要がある。
 * 後者を空として扱うと、AIが情報不足のまま当たり障りのない説明を生成してしまうため。
 */
export type RepoReadmeResult =
    | { status: "ok"; content: string }
    | { status: "none" }
    | { status: "error"; httpStatus: number | null }

/** READMEの本文を取得する。AIへ渡す入力なので、長すぎる場合は先頭を切り出す */
export async function fetchRepoReadme(
    owner: string,
    repo: string,
    maxChars: number,
): Promise<RepoReadmeResult> {
    let response: Response
    try {
        response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
            headers: githubHeaders(),
            next: { revalidate: 3600 },
        })
    } catch {
        return { status: "error", httpStatus: null }
    }

    if (response.status === 404) {
        return { status: "none" }
    }
    if (!response.ok) {
        return { status: "error", httpStatus: response.status }
    }

    const readme = (await response.json()) as { content?: string; encoding?: string }
    if (!readme.content || readme.encoding !== "base64") {
        return { status: "none" }
    }

    const decoded = Buffer.from(readme.content, "base64").toString("utf8").trim()
    if (!decoded) {
        return { status: "none" }
    }

    return {
        status: "ok",
        content: decoded.length > maxChars ? decoded.slice(0, maxChars) : decoded,
    }
}
