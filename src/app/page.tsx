
import { HomeContent } from "@/components/home-content"
import { SiteContentProvider } from "@/components/site-content-provider"
import { getProjectReleaseVersions } from "@/lib/project-releases"
import { getSiteContent } from "@/lib/site-content"

export const dynamic = "force-dynamic"

export default async function Home() {
    const content = getSiteContent()
    const projectReleaseVersions = await getProjectReleaseVersions(content.projects)

    return (
        <SiteContentProvider initialContent={content}>
            <HomeContent projectReleaseVersions={projectReleaseVersions} />
        </SiteContentProvider>
    )
}
