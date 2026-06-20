import { fetchLatestReleaseVersion, parseGitHubRepoUrl } from "@/lib/github"
import type { Project } from "@/types/site-content"

function getPrimaryGitHubUrl(githubUrl?: string | string[]): string | undefined {
    if (!githubUrl) {
        return undefined
    }

    return Array.isArray(githubUrl) ? githubUrl[0] : githubUrl
}

export async function getProjectReleaseVersions(
    projects: Project[],
): Promise<Record<string, string>> {
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

            const version = await fetchLatestReleaseVersion(repo.owner, repo.repo)
            if (!version) {
                return null
            }

            return [project.id, version] as const
        }),
    )

    return Object.fromEntries(
        entries.filter((entry): entry is readonly [string, string] => entry !== null),
    )
}
