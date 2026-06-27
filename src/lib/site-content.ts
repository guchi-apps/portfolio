import fs from "fs"
import path from "path"
import type { MonitorDisplayMode, MonitorSetting, SiteContent } from "@/types/site-content"

const DEFAULT_PATH = path.join(process.cwd(), "data", "site-content.json")
const TEMPLATE_PATH = path.join(process.cwd(), "data", "site-content.example.json")
const BUNDLED_TEMPLATE_PATH = path.join(process.cwd(), "data", "site-content.default.json")

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
        ({ monitorId, visible, customLabel, linkUrl, linkVisibility }) => ({
            monitorId,
            visible,
            ...(customLabel ? { customLabel } : {}),
            ...(linkUrl ? { linkUrl } : {}),
            ...(linkVisibility ? { linkVisibility } : {}),
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

function getTemplatePath(): string | null {
    for (const candidate of [TEMPLATE_PATH, BUNDLED_TEMPLATE_PATH]) {
        if (fs.existsSync(candidate)) {
            return candidate
        }
    }
    return null
}

function ensureContentFile(filePath: string) {
    if (fs.existsSync(filePath)) {
        return
    }

    ensureDataDir(filePath)

    const templatePath = getTemplatePath()
    if (!templatePath) {
        throw new Error(
            `Site content file not found: ${filePath}. Copy data/site-content.example.json to data/site-content.json.`
        )
    }

    fs.copyFileSync(templatePath, filePath)
}

export function getSiteContent(): SiteContent {
    const filePath = getContentPath()
    ensureContentFile(filePath)

    const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as LegacySiteContent
    return normalizeSiteContent(raw)
}

export function saveSiteContent(content: SiteContent): void {
    const filePath = getContentPath()
    ensureDataDir(filePath)
    const normalized = normalizeSiteContent(content)
    fs.writeFileSync(filePath, JSON.stringify(normalized, null, 2) + "\n", "utf8")
}
