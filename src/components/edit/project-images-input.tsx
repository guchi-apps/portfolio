"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"

type ProjectImagesInputProps = {
    value: string[] | undefined
    onChange: (images: string[] | undefined) => void
}

export function ProjectImagesInput({ value, onChange }: ProjectImagesInputProps) {
    const images = value ?? []
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const commit = (next: string[]) => {
        onChange(next.length ? next : undefined)
    }

    const removeAt = (index: number) => {
        commit(images.filter((_, i) => i !== index))
    }

    const moveImage = (index: number, direction: -1 | 1) => {
        const newIndex = index + direction
        if (newIndex < 0 || newIndex >= images.length) return
        const next = [...images]
        ;[next[index], next[newIndex]] = [next[newIndex], next[index]]
        commit(next)
    }

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return
        setUploading(true)
        setError("")

        const uploaded: string[] = []
        for (const file of Array.from(files)) {
            const formData = new FormData()
            formData.append("file", file)
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            })
            if (!res.ok) {
                const body = await res.json().catch(() => null)
                setError(body?.error ?? "アップロードに失敗しました")
                continue
            }
            const { url } = (await res.json()) as { url: string }
            uploaded.push(url)
        }

        commit([...images, ...uploaded])
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    return (
        <div className="space-y-2">
            {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {images.map((url, index) => (
                        <div key={url} className="relative group">
                            <img
                                src={url}
                                alt={`写真 ${index + 1}`}
                                className="w-full aspect-video object-cover rounded-md border border-slate-200 dark:border-slate-700"
                            />
                            <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 bg-black/40 rounded-md transition-opacity">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={index === 0}
                                    onClick={() => moveImage(index, -1)}
                                    aria-label="前に移動"
                                >
                                    ↑
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={index === images.length - 1}
                                    onClick={() => moveImage(index, 1)}
                                    aria-label="後に移動"
                                >
                                    ↓
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeAt(index)}
                                >
                                    削除
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                disabled={uploading}
                onChange={(e) => void handleFiles(e.target.files)}
                className="text-sm"
            />
            {uploading && <p className="text-xs text-slate-500">アップロード中...</p>}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}
