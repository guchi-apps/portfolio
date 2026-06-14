import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata = {
    title: "管理画面 | gucchii.com",
    robots: { index: false, follow: false },
}

export default function AdminPage() {
    return <AdminDashboard />
}
