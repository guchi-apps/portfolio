export interface UptimeKumaMonitor {
    id: number
    name: string
    url?: string
    status: "up" | "down" | "pending"
    uptime24h: number | null
}

interface StatusPageResponse {
    publicGroupList: {
        monitorList: { id: number; name: string; url?: string }[]
    }[]
}

interface HeartbeatResponse {
    heartbeatList: Record<string, { status: number; time: string }[]>
    uptimeList: Record<string, number>
}

export function getUptimeKumaStatusInfo(status: UptimeKumaMonitor["status"]): {
    text: string
    color: string
} {
    switch (status) {
        case "up":
            return { text: "Running", color: "text-emerald-500 dark:text-emerald-400" }
        case "down":
            return { text: "Down", color: "text-red-500 dark:text-red-400" }
        default:
            return { text: "Checking...", color: "text-blue-500 dark:text-blue-400" }
    }
}

export async function fetchUptimeKumaMonitors(): Promise<UptimeKumaMonitor[]> {
    const baseUrl = process.env.UPTIMEKUMA_BASE_URL
    const slug = process.env.UPTIMEKUMA_STATUS_SLUG
    if (!baseUrl || !slug) {
        return []
    }

    try {
        const [pageRes, heartbeatRes] = await Promise.all([
            fetch(`${baseUrl}/api/status-page/${slug}`, { cache: "no-store" }),
            fetch(`${baseUrl}/api/status-page/heartbeat/${slug}`, { cache: "no-store" }),
        ])

        if (!pageRes.ok || !heartbeatRes.ok) {
            console.error("Uptime Kuma API Error:", pageRes.status, heartbeatRes.status)
            return []
        }

        const page = (await pageRes.json()) as StatusPageResponse
        const heartbeat = (await heartbeatRes.json()) as HeartbeatResponse
        const monitors = page.publicGroupList.flatMap((group) => group.monitorList)

        return monitors.map((monitor) => {
            const beats = heartbeat.heartbeatList[String(monitor.id)] ?? []
            const last = beats[beats.length - 1]
            const status: UptimeKumaMonitor["status"] = !last
                ? "pending"
                : last.status === 1
                  ? "up"
                  : "down"
            const uptime24h = heartbeat.uptimeList[`${monitor.id}_24`] ?? null

            return { id: monitor.id, name: monitor.name, url: monitor.url, status, uptime24h }
        })
    } catch (err) {
        console.error("Failed to fetch Uptime Kuma data:", err)
        return []
    }
}
