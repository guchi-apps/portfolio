
import { HomeContent } from "@/components/home-content"
import { SiteContentProvider } from "@/components/site-content-provider"
import { getStatsConfig } from "@/lib/site-config"
import { getSiteContent } from "@/lib/site-content"

export const dynamic = "force-dynamic"

export default async function Home() {
    const stats = getStatsConfig()
    const content = getSiteContent()

    return (
        <SiteContentProvider initialContent={content}>
            <HomeContent initialStats={stats} />
        </SiteContentProvider>
    )
}
