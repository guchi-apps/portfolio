import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { fetchUptimeRobotMonitorsServer } from "@/lib/uptimerobot"

export async function GET() {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const monitors = await fetchUptimeRobotMonitorsServer()
    return NextResponse.json({ monitors })
}
