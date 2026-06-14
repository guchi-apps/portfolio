export type ConnectIconName =
    | "Github"
    | "Code2"
    | "PenBox"
    | "Globe"
    | "Youtube"
    | "ExternalLink"

export type MonitorDisplayMode = "card" | "compact" | "badge"

export interface ConnectLink {
    name: string
    icon: ConnectIconName
    url: string
}

export interface MonitorSetting {
    monitorId: number
    visible: boolean
    customLabel?: string
    linkUrl?: string
}

export interface ProjectLink {
    label: string
    url: string
}

export interface Project {
    id: string
    title: string
    description: string
    techStack: string[]
    period: string
    githubUrl?: string | string[]
    demoUrl?: string
    links?: ProjectLink[]
    imageUrl?: string
}

export interface SiteContent {
    intro: string
    connectLinks: ConnectLink[]
    monitorDisplayMode: MonitorDisplayMode
    monitorSettings: MonitorSetting[]
    projects: Project[]
}
