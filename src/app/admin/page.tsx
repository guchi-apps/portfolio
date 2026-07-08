import { AdminDashboard } from "@/components/admin/dashboard"

export const metadata = {
    title: "ダッシュボード | gucchii.com",
    robots: { index: false, follow: false },
}

export default function AdminPage() {
    return <AdminDashboard />
}
