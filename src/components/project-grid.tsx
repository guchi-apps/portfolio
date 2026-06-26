
"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Globe, ExternalLink, FileText, Youtube, Lock } from "lucide-react"
import type { Project } from "@/types/site-content"

function getLinkIcon(label: string) {
    const l = label.toLowerCase();
    if (l.includes('github') || l.includes('repo')) return Github;
    if (l.includes('video') || l.includes('youtube')) return Youtube;
    if (l.includes('docs') || l.includes('manual') || l.includes('仕様')) return FileText;
    if (l.includes('demo') || l.includes('live')) return Globe;
    return ExternalLink;
}

interface ProjectGridProps {
    projects: Project[]
    releaseVersions: Record<string, string>
}

export function ProjectGrid({ projects, releaseVersions }: ProjectGridProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                    <Card
                        key={project.id}
                        className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-none bg-blue-600 text-white dark:bg-slate-900 dark:border dark:border-slate-700 dark:text-slate-100 overflow-hidden relative"
                        onClick={() => setSelectedProject(project)}
                    >
                        {project.imageUrl && (
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={project.imageUrl}
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
                                            {project.period}
                                            {releaseVersions[project.id] && (
                                                <span className="ml-2 font-mono">
                                                    v{releaseVersions[project.id]}
                                                </span>
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

            <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <div>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                                {selectedProject?.title}
                            </DialogTitle>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1 block">
                                Development Period: {selectedProject?.period}
                                {selectedProject && releaseVersions[selectedProject.id] && (
                                    <span className="normal-case font-mono">
                                        {" · "}v{releaseVersions[selectedProject.id]}
                                    </span>
                                )}
                            </span>
                        </div>
                        <DialogDescription className="text-base pt-2">
                            {selectedProject?.description}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedProject?.imageUrl && (
                        <div className="w-full h-48 rounded-lg overflow-hidden my-2">
                            <img src={selectedProject.imageUrl} alt={selectedProject.title} className="w-full h-full object-cover" />
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
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border border-slate-200 text-slate-400 dark:border-slate-700 dark:text-slate-500">
                                    <Globe className="h-4 w-4" />
                                    アクセス不可
                                </span>
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
        </>
    )
}
