import { NextResponse } from "next/server"
import { fetchUptimeKumaPortfolioMonitors } from "@/lib/uptime-kuma"

export async function GET() {
    const monitors = await fetchUptimeKumaPortfolioMonitors()
    return NextResponse.json({ monitors })
}
