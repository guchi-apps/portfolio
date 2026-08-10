import { parseGitHubRepoUrl } from "@/lib/github"
import type { GitHubRepoSummary } from "@/types/github"
import type { ConnectLink, Project } from "@/types/site-content"

/** 技術スタックとして取り込む言語の最大件数 */
const MAX_LANGUAGES = 5

/** githubUrl は文字列でも配列でも持てるため、先頭のURLを取り出す */
export function getPrimaryGitHubUrl(githubUrl?: string | string[]): string | undefined {
    if (!githubUrl) return undefined
    return Array.isArray(githubUrl) ? githubUrl[0] : githubUrl
}

/** Connect リンクから GitHub のユーザー名を取り出す */
export function findGitHubUsername(connectLinks: ConnectLink[]): string | null {
    for (const link of connectLinks) {
        try {
            const parsed = new URL(link.url)
            if (parsed.hostname !== "github.com") continue

            const [username, ...rest] = parsed.pathname.split("/").filter(Boolean)
            if (username && rest.length === 0) {
                return username
            }
        } catch {
            continue
        }
    }

    return null
}

/** GitHub URL を owner/repo（小文字）に正規化する。リポジトリURLでなければ null */
export function normalizeRepoKey(url: string): string | null {
    const repo = parseGitHubRepoUrl(url)
    if (!repo) return null
    return `${repo.owner}/${repo.repo}`.toLowerCase()
}

/** 既にプロジェクトとして登録済みのリポジトリ（owner/repo）の集合を返す */
export function collectRegisteredRepoKeys(projects: Project[]): Set<string> {
    const keys = new Set<string>()

    for (const project of projects) {
        const urls = Array.isArray(project.githubUrl)
            ? project.githubUrl
            : project.githubUrl
              ? [project.githubUrl]
              : []

        for (const url of urls) {
            const key = normalizeRepoKey(url)
            if (key) keys.add(key)
        }
    }

    return keys
}

/** asset-manager → Asset Manager */
export function humanizeRepoName(name: string): string {
    return name
        .split(/[-_.]+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

/** ISO 8601 の日時を <input type="date"> と同じ YYYY-MM-DD 形式にする */
function toProjectPeriod(createdAt: string): string {
    return createdAt.slice(0, 10)
}

/**
 * リポジトリ情報を既存プロジェクトへ反映するための差分を作る。
 * GitHub側が空の項目は、手入力した内容を消さないよう上書きしない。
 */
export function buildProjectPatchFromRepo(repo: GitHubRepoSummary): Partial<Project> {
    return {
        githubUrl: repo.htmlUrl,
        period: toProjectPeriod(repo.createdAt),
        ...(repo.description ? { description: repo.description } : {}),
        ...(repo.languages.length > 0
            ? { techStack: repo.languages.slice(0, MAX_LANGUAGES) }
            : {}),
        ...(repo.homepage ? { appUrl: repo.homepage } : {}),
    }
}

/** リポジトリ情報からプロジェクトの下書きを作る */
export function buildProjectFromRepo(repo: GitHubRepoSummary, id: string): Project {
    return {
        id,
        title: humanizeRepoName(repo.name),
        description: "",
        techStack: [],
        period: "",
        ...buildProjectPatchFromRepo(repo),
    }
}
