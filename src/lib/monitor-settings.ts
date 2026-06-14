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

export function getMonitorLinkUrl(setting: MonitorSetting): string | undefined {
    const url = setting.linkUrl?.trim()
    return url || undefined
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
