"use client"

import { useState, type KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type TechStackInputProps = {
    value: string[]
    onChange: (value: string[]) => void
}

export function TechStackInput({ value, onChange }: TechStackInputProps) {
    const [draft, setDraft] = useState("")
    const [isComposing, setIsComposing] = useState(false)

    const commitDraft = (raw?: string) => {
        const trimmed = (raw ?? draft).trim()
        if (!trimmed) {
            setDraft("")
            return
        }
        onChange([...value, trimmed])
        setDraft("")
    }

    const removeAt = (index: number) => {
        onChange(value.filter((_, i) => i !== index))
    }

    const handleChange = (text: string) => {
        if (text.includes(",")) {
            const parts = text.split(",")
            let next = value
            for (const part of parts.slice(0, -1)) {
                const trimmed = part.trim()
                if (trimmed) {
                    next = [...next, trimmed]
                }
            }
            onChange(next)
            setDraft(parts[parts.length - 1] ?? "")
            return
        }
        setDraft(text)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (isComposing) return

        if (e.key === "," || e.key === "Enter") {
            e.preventDefault()
            commitDraft()
            return
        }

        if (e.key === "Backspace" && draft === "" && value.length > 0) {
            onChange(value.slice(0, -1))
        }
    }

    return (
        <div
            className={cn(
                "flex flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2",
                "focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500",
                "dark:border-slate-700 dark:bg-slate-900"
            )}
        >
            {value.map((tech, index) => (
                <Badge
                    key={`${tech}-${index}`}
                    className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 border-none px-3 py-1 gap-1"
                >
                    {tech}
                    <button
                        type="button"
                        onClick={() => removeAt(index)}
                        className="rounded-full hover:bg-blue-200/80 dark:hover:bg-blue-800/50"
                        aria-label={`${tech} を削除`}
                    >
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            ))}
            <input
                type="text"
                value={draft}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => commitDraft()}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                placeholder={value.length === 0 ? "技術名を入力（カンマで確定）" : ""}
                className="flex-1 min-w-[120px] bg-transparent text-sm outline-none dark:text-slate-100 placeholder:text-slate-400"
            />
        </div>
    )
}
