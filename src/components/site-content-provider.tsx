"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { SiteContent } from "@/types/site-content"

const SiteContentContext = createContext<SiteContent | null>(null)

interface SiteContentProviderProps {
    initialContent: SiteContent
    children: ReactNode
}

export function SiteContentProvider({ initialContent, children }: SiteContentProviderProps) {
    const [content, setContent] = useState(initialContent)

    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                const res = await fetch("/api/content", { cache: "no-store" })
                if (!res.ok) return

                const data = (await res.json()) as SiteContent
                if (!cancelled) {
                    setContent(data)
                }
            } catch {
                // Keep SSR fallback when the client fetch fails.
            }
        }

        void load()
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>
    )
}

export function useSiteContent(): SiteContent {
    const content = useContext(SiteContentContext)
    if (!content) {
        throw new Error("useSiteContent must be used within SiteContentProvider")
    }
    return content
}
