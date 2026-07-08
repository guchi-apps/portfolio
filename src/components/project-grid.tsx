
"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Globe, ExternalLink, FileText, Youtube, Lock, ChevronLeft, ChevronRight, X } from "lucide-react"
import type { ReleaseInfo } from "@/lib/project-releases"
import { formatProjectPeriod } from "@/lib/project-period"
import { useAdminSession } from "@/hooks/use-admin-session"
import type { Project } from "@/types/site-content"

function getLinkIcon(label: string) {
    const l = label.toLowerCase();
    if (l.includes('github') || l.includes('repo')) return Github;
    if (l.includes('video') || l.includes('youtube')) return Youtube;
    if (l.includes('docs') || l.includes('manual') || l.includes('仕様')) return FileText;
    if (l.includes('demo') || l.includes('live')) return Globe;
    return ExternalLink;
}

function formatPublishedAt(iso: string): string {
    const d = new Date(iso)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}.${m}.${day}`
}

interface ProjectGridProps {
    projects: Project[]
    releaseVersions: Record<string, ReleaseInfo>
}

const SWIPE_THRESHOLD = 50

export function ProjectGrid({ projects, releaseVersions }: ProjectGridProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const { isAdmin } = useAdminSession()
    const touchStartX = useRef<number | null>(null)

    const lightboxImages = selectedProject?.images ?? []

    const closeLightbox = () => setLightboxIndex(null)
    const goToPrev = () =>
        setLightboxIndex((i) =>
            i === null ? null : (i - 1 + lightboxImages.length) % lightboxImages.length
        )
    const goToNext = () =>
        setLightboxIndex((i) => (i === null ? null : (i + 1) % lightboxImages.length))

    useEffect(() => {
        if (lightboxIndex === null) return
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") goToPrev()
            if (e.key === "ArrowRight") goToNext()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lightboxIndex, lightboxImages.length])

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return
        const delta = e.changedTouches[0].clientX - touchStartX.current
        touchStartX.current = null
        if (Math.abs(delta) < SWIPE_THRESHOLD) return
        if (delta < 0) goToNext()
        else goToPrev()
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                    <Card
                        key={project.id}
                        className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-none bg-blue-600 text-white dark:bg-slate-900 dark:border dark:border-slate-700 dark:text-slate-100 overflow-hidden relative"
                        onClick={() => setSelectedProject(project)}
                    >
                        {project.images?.[0] && (
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={project.images[0]}
                                    alt={project.title}
                                    className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-blue-600/80 to-transparent" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />

                        <div className="relative z-20">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-white dark:text-slate-100">
                                            {project.title}
                                        </CardTitle>
                                        <span className="text-xs text-blue-200 dark:text-slate-400 font-medium">
                                            {releaseVersions[project.id] ? (
                                                <>
                                                    <span className="font-mono">v{releaseVersions[project.id].version}</span>
                                                    {releaseVersions[project.id].publishedAt && (
                                                        <span className="ml-2">
                                                            {formatPublishedAt(releaseVersions[project.id].publishedAt!)}
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                formatProjectPeriod(project.period)
                                            )}
                                        </span>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink className="h-5 w-5 text-blue-200" />
                                    </div>
                                </div>
                                <CardDescription className="line-clamp-2 text-blue-100 dark:text-slate-400">
                                    {project.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.slice(0, 3).map((tech) => (
                                        <Badge key={tech} className="bg-blue-700/50 text-blue-100 hover:bg-blue-600/50 border-blue-400/30 dark:bg-slate-800 dark:text-blue-300">
                                            {tech}
                                        </Badge>
                                    ))}
                                    {project.techStack.length > 3 && (
                                        <Badge className="bg-blue-700/50 text-blue-100 hover:bg-blue-600/50 border-blue-400/30 dark:bg-slate-800 dark:text-blue-300">
                                            +{project.techStack.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                ))}
            </div>

            <Dialog
                open={!!selectedProject}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedProject(null)
                        closeLightbox()
                    }
                }}
            >
                <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto overflow-x-hidden">
                    <DialogHeader>
                        <div>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                                {selectedProject?.title}
                            </DialogTitle>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1 flex flex-wrap items-baseline">
                                {selectedProject && releaseVersions[selectedProject.id] ? (
                                    <>
                                        <span className="normal-case font-mono whitespace-nowrap">
                                            v{releaseVersions[selectedProject.id].version}
                                        </span>
                                        <span className="whitespace-nowrap before:content-['_'] sm:before:content-['_·_']">
                                            <span className="font-normal text-[10px]">Start Project:</span>{" "}
                                            {formatProjectPeriod(selectedProject.period)}
                                            {releaseVersions[selectedProject.id].publishedAt && (
                                                <>{" ~ "}<span className="font-normal text-[10px]">Last Updated:</span>{" "}{formatPublishedAt(releaseVersions[selectedProject.id].publishedAt!)}</>
                                            )}
                                        </span>
                                    </>
                                ) : (
                                    <span className="whitespace-nowrap">
                                        <span className="font-normal text-[10px]">Start Project:</span>{" "}
                                        {formatProjectPeriod(selectedProject?.period ?? "")}
                                    </span>
                                )}
                            </span>
                        </div>
                        <DialogDescription className="text-base pt-2">
                            {selectedProject?.description}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedProject?.images && selectedProject.images.length > 0 && (
                        <div className="min-w-0 flex overflow-x-auto snap-x snap-mandatory gap-2 my-2 -mx-6 px-6">
                            {selectedProject.images.map((url, i) => (
                                <button
                                    key={url}
                                    type="button"
                                    className="flex-none h-64 sm:h-80 rounded-lg overflow-hidden cursor-zoom-in snap-center bg-slate-100 dark:bg-slate-800"
                                    onClick={() => setLightboxIndex(i)}
                                    aria-label={`${selectedProject.title} 写真 ${i + 1} を拡大表示`}
                                >
                                    <img
                                        src={url}
                                        alt={`${selectedProject.title} ${i + 1}`}
                                        className="h-full w-auto object-contain hover:scale-105 transition-transform duration-300"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="space-y-6 pt-4">
                        <div>
                            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Tech Stack</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedProject?.techStack.map((tech) => (
                                    <Badge key={tech} className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 border-none px-3 py-1">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-2">
                            {selectedProject?.githubUrl && (
                                <>
                                    {Array.isArray(selectedProject.githubUrl) ? (
                                        selectedProject.githubUrl.map((url, i) => (
                                            <Button key={i} asChild variant="outline" className="gap-2">
                                                <a href={url} target="_blank" rel="noopener noreferrer">
                                                    <Github className="h-4 w-4" />
                                                    GitHub {selectedProject.githubUrl?.length && selectedProject.githubUrl.length > 1 ? i + 1 : ''}
                                                </a>
                                            </Button>
                                        ))
                                    ) : (
                                        <Button asChild variant="outline" className="gap-2">
                                            <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                                                <Github className="h-4 w-4" />
                                                GitHub
                                            </a>
                                        </Button>
                                    )}
                                </>
                            )}
                            {selectedProject?.appUrl && selectedProject.appAccessibility !== "inaccessible" && (
                                <Button asChild className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                                    <a href={selectedProject.appUrl} target="_blank" rel="noopener noreferrer">
                                        {selectedProject.appAccessibility === "registration-required" ? (
                                            <><Lock className="h-4 w-4" />アプリ（要登録）</>
                                        ) : (
                                            <><Globe className="h-4 w-4" />アプリ</>
                                        )}
                                    </a>
                                </Button>
                            )}
                            {selectedProject?.appUrl && selectedProject.appAccessibility === "inaccessible" && (
                                isAdmin ? (
                                    <Button asChild variant="outline" className="gap-2">
                                        <a
                                            href={selectedProject.appUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Globe className="h-4 w-4" />
                                            アプリ（アクセス不可）
                                        </a>
                                    </Button>
                                ) : (
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border border-slate-200 text-slate-400 dark:border-slate-700 dark:text-slate-500">
                                        <Globe className="h-4 w-4" />
                                        アクセス不可
                                    </span>
                                )
                            )}
                            {selectedProject?.demoUrl && (
                                <Button asChild className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                                    <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer">
                                        <Globe className="h-4 w-4" />
                                        Live Demo
                                    </a>
                                </Button>
                            )}
                            {selectedProject?.links?.map((link, idx) => {
                                const Icon = getLinkIcon(link.label);
                                return (
                                    <Button
                                        key={idx}
                                        asChild
                                        variant="secondary"
                                        className="gap-2"
                                    >
                                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                                            <Icon className="h-4 w-4" />
                                            {link.label}
                                        </a>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && closeLightbox()}>
                <DialogContent
                    className="top-0 left-0 translate-x-0 translate-y-0 w-screen h-screen max-w-none max-h-none rounded-none border-none p-0 bg-black/95 overflow-hidden"
                    showCloseButton={false}
                >
                    <DialogTitle className="sr-only">
                        {selectedProject?.title} 写真 {lightboxIndex !== null ? lightboxIndex + 1 : ""}
                    </DialogTitle>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="absolute top-4 right-4 z-10 rounded-full bg-black/40 border-white/20 text-white hover:bg-black/60 hover:text-white"
                            aria-label="閉じる"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </DialogClose>
                    {lightboxIndex !== null && lightboxImages[lightboxIndex] && (
                        <div
                            className="relative flex items-center justify-center w-full h-full p-4 sm:p-10"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            <img
                                src={lightboxImages[lightboxIndex]}
                                alt={`${selectedProject?.title} 写真 ${lightboxIndex + 1}`}
                                className="max-w-full max-h-full object-contain select-none"
                                draggable={false}
                            />
                            {lightboxImages.length > 1 && (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 border-white/20 text-white hover:bg-black/60 hover:text-white"
                                        onClick={goToPrev}
                                        aria-label="前の写真"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 border-white/20 text-white hover:bg-black/60 hover:text-white"
                                        onClick={goToNext}
                                        aria-label="次の写真"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/80 bg-black/40 rounded-full px-2 py-1">
                                        {lightboxIndex + 1} / {lightboxImages.length}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
