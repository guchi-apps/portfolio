"use client"

import { ProjectGrid } from "@/components/project-grid"
import type { Project } from "@/types/site-content"

interface DynamicProjectsProps {
    projects: Project[]
    releaseVersions: Record<string, string>
}

export function DynamicProjects({ projects, releaseVersions }: DynamicProjectsProps) {
    return <ProjectGrid projects={projects} releaseVersions={releaseVersions} />
}
