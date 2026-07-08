import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { fetchUptimeKumaDashboardMonitors } from "@/lib/uptime-kuma"

export async function GET() {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const monitors = await fetchUptimeKumaDashboardMonitors()
    return NextResponse.json({ monitors })
}
