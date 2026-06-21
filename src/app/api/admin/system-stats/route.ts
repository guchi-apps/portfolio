import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getSystemStats } from "@/lib/system-stats"

export const dynamic = "force-dynamic"

export async function GET() {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const stats = await getSystemStats()
        return NextResponse.json(stats, {
            headers: { "Cache-Control": "no-store" },
        })
    } catch (error) {
        console.error("System stats error:", error)
        return NextResponse.json({ error: "Failed to read system stats" }, { status: 500 })
    }
}
