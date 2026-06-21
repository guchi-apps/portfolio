"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ProjectLink } from "@/types/site-content"

type ProjectLinksInputProps = {
    value: ProjectLink[] | undefined
    onChange: (links: ProjectLink[] | undefined) => void
}

function toDisplayLinks(links: ProjectLink[] | undefined): ProjectLink[] {
    return links?.length ? links.map((link) => ({ ...link })) : [{ label: "", url: "" }]
}

function toStoredLinks(links: ProjectLink[]): ProjectLink[] | undefined {
    const filled = links.filter((link) => link.label.trim() && link.url.trim())
    return filled.length ? filled : undefined
}

export function ProjectLinksInput({ value, onChange }: ProjectLinksInputProps) {
    const [links, setLinks] = useState(() => toDisplayLinks(value))

    const commit = (next: ProjectLink[]) => {
        const display = next.length === 0 ? [{ label: "", url: "" }] : next
        setLinks(display)
        onChange(toStoredLinks(next))
    }

    const updateLink = (index: number, patch: Partial<ProjectLink>) => {
        commit(links.map((link, i) => (i === index ? { ...link, ...patch } : link)))
    }

    const addLink = () => {
        commit([...links, { label: "", url: "" }])
    }

    const removeLink = (index: number) => {
        commit(links.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-2">
            {links.map((link, linkIndex) => (
                <div key={linkIndex} className="flex gap-2 items-start">
                    <Input
                        className="min-w-0 flex-1"
                        value={link.label}
                        placeholder="ラベル"
                        onChange={(e) => updateLink(linkIndex, { label: e.target.value })}
                    />
                    <Input
                        className="min-w-0 flex-[2]"
                        value={link.url}
                        placeholder="https://example.com"
                        onChange={(e) => updateLink(linkIndex, { url: e.target.value })}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => removeLink(linkIndex)}
                    >
                        削除
                    </Button>
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addLink}>
                リンクを追加
            </Button>
        </div>
    )
}
