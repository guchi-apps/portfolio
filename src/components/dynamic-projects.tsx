"use client"

import { ProjectGrid } from "@/components/project-grid"
import type { Project } from "@/types/site-content"

interface DynamicProjectsProps {
    projects: Project[]
}

export function DynamicProjects({ projects }: DynamicProjectsProps) {
    return <ProjectGrid projects={projects} />
}
