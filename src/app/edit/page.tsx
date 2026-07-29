import { Suspense } from "react"
import { EditDashboard } from "@/components/edit/edit-dashboard"

export const metadata = {
    title: "編集画面 | gucchii.com",
    robots: { index: false, follow: false },
}

export default function EditPage() {
    return (
        <Suspense>
            <EditDashboard />
        </Suspense>
    )
}
