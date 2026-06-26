import { fetchLatestReleaseInfo, parseGitHubRepoUrl } from "@/lib/github"
import type { ReleaseInfo } from "@/lib/github"
import type { Project } from "@/types/site-content"

export type { ReleaseInfo }

function getPrimaryGitHubUrl(githubUrl?: string | string[]): string | undefined {
    if (!githubUrl) {
        return undefined
    }

    return Array.isArray(githubUrl) ? githubUrl[0] : githubUrl
}

export async function getProjectReleaseVersions(
    projects: Project[],
): Promise<Record<string, ReleaseInfo>> {
    const entries = await Promise.all(
        projects.map(async (project) => {
            const githubUrl = getPrimaryGitHubUrl(project.githubUrl)
            if (!githubUrl) {
                return null
            }

            const repo = parseGitHubRepoUrl(githubUrl)
            if (!repo) {
                return null
            }

            const info = await fetchLatestReleaseInfo(repo.owner, repo.repo)
            if (!info) {
                return null
            }

            return [project.id, info] as const
        }),
    )

    return Object.fromEntries(
        entries.filter((entry): entry is readonly [string, ReleaseInfo] => entry !== null),
    )
}
