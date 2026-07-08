import { AdminDashboard } from "@/components/admin/dashboard"
import { SiteContentProvider } from "@/components/site-content-provider"
import { getSiteContent } from "@/lib/site-content"

export const metadata = {
    title: "ダッシュボード | gucchii.com",
    robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default function AdminPage() {
    const content = getSiteContent()
    return (
        <SiteContentProvider initialContent={content}>
            <AdminDashboard />
        </SiteContentProvider>
    )
}
