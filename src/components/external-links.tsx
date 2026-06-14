
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DashboardCard } from "@/components/dashboard-card"
import { cn } from "@/lib/utils"
import { getConnectIcon } from "@/lib/connect-icons"
import type { ConnectLink } from "@/types/site-content"

interface ExternalLinksProps {
    links: ConnectLink[]
    className?: string
    noCard?: boolean
}

export function ExternalLinks({ links, className, noCard = false }: ExternalLinksProps) {
    const Wrapper = noCard ? "div" : DashboardCard

    return (
        <Wrapper className={cn(noCard ? "w-full" : "h-full flex flex-col justify-center", className)}>
            <h3 className="text-sm font-medium opacity-70 mb-4 uppercase tracking-wider">Connect</h3>
            <div className="grid w-full grid-cols-2 md:grid-cols-3 gap-3">
                {links.map((link) => {
                    const Icon = getConnectIcon(link.icon)
                    return (
                        <Button
                            key={`${link.name}-${link.url}`}
                            variant="outline"
                            className="w-full justify-start gap-3 h-12 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white dark:border-border dark:bg-secondary/50 dark:text-secondary-foreground dark:hover:bg-secondary/80 transition-all"
                            asChild
                        >
                            <Link href={link.url} target="_blank" rel="noopener noreferrer">
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        </Button>
                    )
                })}
            </div>
        </Wrapper>
    )
}
