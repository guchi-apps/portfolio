import fs from "fs"
import path from "path"
import type { MonitorDisplayMode, MonitorSetting, SiteContent } from "@/types/site-content"

const DEFAULT_PATH = path.join(process.cwd(), "data", "site-content.json")

type LegacyMonitorSetting = MonitorSetting & { displayMode?: MonitorDisplayMode }
type LegacySiteContent = Omit<SiteContent, "monitorDisplayMode" | "monitorSettings"> & {
    monitorDisplayMode?: MonitorDisplayMode
    monitorSettings?: LegacyMonitorSetting[]
}

function normalizeSiteContent(raw: LegacySiteContent): SiteContent {
    const settings = raw.monitorSettings ?? []
    const monitorDisplayMode =
        raw.monitorDisplayMode ??
        settings.find((s) => s.displayMode)?.displayMode ??
        "card"

    const monitorSettings: MonitorSetting[] = settings.map(
        ({ monitorId, visible, customLabel, linkUrl }) => ({
            monitorId,
            visible,
            ...(customLabel ? { customLabel } : {}),
            ...(linkUrl ? { linkUrl } : {}),
        })
    )

    return {
        intro: raw.intro,
        connectLinks: raw.connectLinks,
        monitorDisplayMode,
        monitorSettings,
        projects: raw.projects,
    }
}

function getContentPath(): string {
    return process.env.SITE_CONTENT_PATH || DEFAULT_PATH
}

function ensureDataDir(filePath: string) {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
}

export function getSiteContent(): SiteContent {
    const filePath = getContentPath()
    ensureDataDir(filePath)

    if (!fs.existsSync(filePath)) {
        const fallback = path.join(process.cwd(), "data", "site-content.json")
        if (fallback !== filePath && fs.existsSync(fallback)) {
            fs.copyFileSync(fallback, filePath)
        }
    }

    const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as LegacySiteContent
    return normalizeSiteContent(raw)
}

export function saveSiteContent(content: SiteContent): void {
    const filePath = getContentPath()
    ensureDataDir(filePath)
    const normalized = normalizeSiteContent(content)
    fs.writeFileSync(filePath, JSON.stringify(normalized, null, 2) + "\n", "utf8")
}
