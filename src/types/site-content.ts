export type ConnectIconName =
    | "Github"
    | "Gitlab"
    | "Code2"
    | "Terminal"
    | "PenBox"
    | "BookOpen"
    | "FileText"
    | "Globe"
    | "Home"
    | "Link"
    | "ExternalLink"
    | "Mail"
    | "Send"
    | "Phone"
    | "MessageCircle"
    | "AtSign"
    | "MapPin"
    | "Youtube"
    | "Video"
    | "Music"
    | "Mic"
    | "Camera"
    | "Rss"
    | "X"
    | "Linkedin"
    | "Instagram"
    | "Facebook"
    | "Twitch"
    | "Slack"
    | "Figma"
    | "Dribbble"
    | "Briefcase"
    | "Bookmark"
    | "Heart"
    | "Star"
    | "Cloud"
    | "Smartphone"

export interface ConnectLink {
    name: string
    icon: ConnectIconName
    url: string
}

export interface UptimeKumaSettings {
    portfolioVisible: boolean
    portfolioShowLink: boolean
    dashboardVisible: boolean
    dashboardShowLink: boolean
    linkUrl?: string
}

export type AppAccessibility = "public" | "registration-required" | "inaccessible"

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
    appUrl?: string
    appAccessibility?: AppAccessibility
    links?: ProjectLink[]
    images?: string[]
}

export interface SiteContent {
    intro: string
    connectLinks: ConnectLink[]
    uptimeKumaSettings: UptimeKumaSettings
    projects: Project[]
}
