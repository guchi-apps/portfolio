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

export function getOrderedMonitors(
    monitors: UptimeRobotMonitor[],
    settings: MonitorSetting[]
): UptimeRobotMonitor[] {
    const monitorById = new Map(monitors.map((m) => [m.id, m]))
    const ordered: UptimeRobotMonitor[] = []
    const seen = new Set<number>()

    for (const setting of settings) {
        const monitor = monitorById.get(setting.monitorId)
        if (monitor) {
            ordered.push(monitor)
            seen.add(setting.monitorId)
        }
    }
    for (const monitor of monitors) {
        if (!seen.has(monitor.id)) {
            ordered.push(monitor)
        }
    }
    return ordered
}

export function reorderMonitorSettings(
    settings: MonitorSetting[],
    monitors: UptimeRobotMonitor[],
    monitorId: number,
    direction: -1 | 1
): MonitorSetting[] {
    const ordered = getOrderedMonitors(monitors, settings)
    const index = ordered.findIndex((m) => m.id === monitorId)
    const newIndex = index + direction
    if (index < 0 || newIndex < 0 || newIndex >= ordered.length) return settings

    const newOrdered = [...ordered]
    ;[newOrdered[index], newOrdered[newIndex]] = [newOrdered[newIndex], newOrdered[index]]

    const newSettings = newOrdered.map((m) => getMonitorSetting(settings, m.id))
    const orderedIds = new Set(newOrdered.map((m) => m.id))
    const orphanSettings = settings.filter((s) => !orderedIds.has(s.monitorId))
    return [...newSettings, ...orphanSettings]
}

export function getVisibleMonitors(
    monitors: UptimeRobotMonitor[],
    settings: MonitorSetting[]
): Array<UptimeRobotMonitor & { setting: MonitorSetting }> {
    return getOrderedMonitors(monitors, settings)
        .map((monitor) => ({
            ...monitor,
            setting: getMonitorSetting(settings, monitor.id),
        }))
        .filter((m) => m.setting.visible)
}
