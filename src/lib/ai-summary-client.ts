import type { GitHubRepoSummary } from "@/types/github"

export interface ProjectSummaryFields {
    description: string
    techStack: string[]
}

/** リポジトリの説明と技術スタックをAIで生成する。失敗時は理由付きで throw する */
export async function generateSummary(githubUrl: string): Promise<ProjectSummaryFields> {
    const res = await fetch("/api/admin/github/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl }),
    })

    const data = await res.json()
    if (!res.ok) {
        throw new Error(data.error ?? "AIでの生成に失敗しました")
    }

    return { description: data.description, techStack: data.techStack }
}

/**
 * 複数リポジトリ分をまとめて生成し、GitHub URL をキーにしたMapで返す。
 * 失敗したリポジトリはMapに含めない（呼び出し側で件数を数えて通知する）。
 */
export async function generateSummaries(
    repos: GitHubRepoSummary[],
): Promise<Map<string, ProjectSummaryFields>> {
    const results = await Promise.all(
        repos.map(async (repo) => {
            try {
                return [repo.htmlUrl, await generateSummary(repo.htmlUrl)] as const
            } catch {
                return null
            }
        }),
    )

    return new Map(results.filter((entry) => entry !== null))
}
