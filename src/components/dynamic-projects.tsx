"use client"

import { ProjectGrid } from "@/components/project-grid"
import type { ReleaseInfo } from "@/lib/project-releases"
import type { Project } from "@/types/site-content"

interface DynamicProjectsProps {
    projects: Project[]
    releaseVersions: Record<string, ReleaseInfo>
}

export function DynamicProjects({ projects, releaseVersions }: DynamicProjectsProps) {
    return <ProjectGrid projects={projects} releaseVersions={releaseVersions} />
}
