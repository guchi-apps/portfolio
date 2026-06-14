import { NextResponse } from "next/server"
import { fetchUptimeRobotMonitorsServer } from "@/lib/uptimerobot"

export async function GET() {
    const monitors = await fetchUptimeRobotMonitorsServer()
    return NextResponse.json({ monitors })
}
