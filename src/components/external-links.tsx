
"use client"

import Link from "next/link"
import { Github, Twitter, Chrome, Code2, PenBox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardCard } from "@/components/dashboard-card"

interface ExternalLinksProps {
    className?: string
    noCard?: boolean
}

export function ExternalLinks({ className, noCard = false }: ExternalLinksProps) {
    const links = [
        { name: "GitHub", icon: Github, url: "https://github.com/m-guchi" },
        { name: "Qiita", icon: Code2, url: "https://qiita.com/minagu" },
        { name: "Blog", icon: PenBox, url: "https://blog.gucchii.com" },
        // { name: "X (Twitter)", icon: Twitter, url: "https://twitter.com/minagu_work" },
    ]

    const Wrapper = noCard ? "div" : DashboardCard

    return (
        <Wrapper className={noCard ? className : `h-full flex flex-col justify-center ${className || ""}`}>
            <h3 className="text-sm font-medium opacity-70 mb-4 uppercase tracking-wider">Connect</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {links.map((link) => (
                    <Button
                        key={link.name}
                        variant="outline"
                        className="w-full justify-start gap-3 h-12 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white dark:border-border dark:bg-secondary/50 dark:text-secondary-foreground dark:hover:bg-secondary/80 transition-all"
                        asChild
                    >
                        <Link href={link.url} target="_blank" rel="noopener noreferrer">
                            <link.icon className="h-5 w-5" />
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    </Button>
                ))}
            </div>
        </Wrapper>
    )
}
