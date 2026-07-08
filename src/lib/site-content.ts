import fs from "fs"
import path from "path"
import type { SiteContent, UptimeKumaSettings } from "@/types/site-content"

const DEFAULT_PATH = path.join(process.cwd(), "data", "site-content.json")
const TEMPLATE_PATH = path.join(process.cwd(), "data", "site-content.example.json")
const BUNDLED_TEMPLATE_PATH = path.join(process.cwd(), "data", "site-content.default.json")

type LegacySiteContent = Omit<SiteContent, "uptimeKumaSettings"> & {
    uptimeKumaSettings?: Partial<UptimeKumaSettings>
}

function normalizeSiteContent(raw: LegacySiteContent): SiteContent {
    const uptimeKuma = raw.uptimeKumaSettings

    return {
        intro: raw.intro,
        connectLinks: raw.connectLinks,
        uptimeKumaSettings: {
            portfolioVisible: uptimeKuma?.portfolioVisible ?? false,
            dashboardVisible: uptimeKuma?.dashboardVisible ?? true,
        },
        projects: raw.projects,
    }
}

function getContentPath(): string {
    return process.env.SITE_CONTENT_PATH || DEFAULT_PATH
}

export function getUploadsDir(): string {
    const dir = path.join(path.dirname(getContentPath()), "uploads")
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
    return dir
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
