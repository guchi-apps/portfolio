import { NextResponse } from "next/server"
import { fetchUptimeKumaMonitors } from "@/lib/uptime-kuma"

export async function GET() {
    const monitors = await fetchUptimeKumaMonitors()
    return NextResponse.json({ monitors })
}
