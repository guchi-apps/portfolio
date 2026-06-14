import {
    Github,
    Code2,
    PenBox,
    Globe,
    Youtube,
    ExternalLink,
    type LucideIcon,
} from "lucide-react"
import type { ConnectIconName } from "@/types/site-content"

const ICON_MAP: Record<ConnectIconName, LucideIcon> = {
    Github,
    Code2,
    PenBox,
    Globe,
    Youtube,
    ExternalLink,
}

export function getConnectIcon(name: ConnectIconName): LucideIcon {
    return ICON_MAP[name] ?? ExternalLink
}

export const CONNECT_ICON_OPTIONS: ConnectIconName[] = [
    "Github",
    "Code2",
    "PenBox",
    "Globe",
    "Youtube",
    "ExternalLink",
]
