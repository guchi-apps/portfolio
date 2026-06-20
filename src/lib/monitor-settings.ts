import type { MonitorSetting } from "@/types/site-content"
import type { UptimeRobotMonitor } from "@/lib/uptimerobot"

export function getMonitorSetting(
    settings: MonitorSetting[],
    monitorId: number
): MonitorSetting {
    const existing = settings.find((s) => s.monitorId === monitorId)
    if (existing) return existing
    return { monitorId, visible: true }
}

function normalizeExternalUrl(url: string): string {
    if (/^https?:\/\//i.test(url)) return url
    return `https://${url}`
}

export function getMonitorLinkUrl(setting: MonitorSetting): string | undefined {
    const url = setting.linkUrl?.trim()
    if (!url) return undefined
    return normalizeExternalUrl(url)
}

export function getVisibleMonitors(
    monitors: UptimeRobotMonitor[],
    settings: MonitorSetting[]
): Array<UptimeRobotMonitor & { setting: MonitorSetting }> {
    return monitors
        .map((monitor) => ({
            ...monitor,
            setting: getMonitorSetting(settings, monitor.id),
        }))
        .filter((m) => m.setting.visible)
}
