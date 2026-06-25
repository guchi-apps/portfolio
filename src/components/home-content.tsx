"use client"

import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { AdminModeBanner } from "@/components/admin-mode-banner"
import { DashboardCard } from "@/components/dashboard-card"
import { DynamicProjects } from "@/components/dynamic-projects"
import { DynamicStats } from "@/components/dynamic-stats"
import { ExternalLinks } from "@/components/external-links"
import { GithubActivity } from "@/components/github-activity"
import { SectionHeading } from "@/components/section-heading"
import { ServerStats } from "@/components/server-stats"
import { Button } from "@/components/ui/button"
import { useSiteContent } from "@/components/site-content-provider"
import { useAdminSession } from "@/hooks/use-admin-session"
import type { StatsConfig } from "@/lib/site-config"
import { appVersion } from "@/lib/version"

interface HomeContentProps {
    initialStats: StatsConfig | null
    projectReleaseVersions: Record<string, string>
}

export function HomeContent({ initialStats, projectReleaseVersions }: HomeContentProps) {
    const content = useSiteContent()
    const { isAdmin } = useAdminSession()
    const [showIntroInAdmin, setShowIntroInAdmin] = useState(false)
    const showIntro = !isAdmin || showIntroInAdmin

    return (
        <main className="min-h-screen p-4 md:p-8 space-y-6 max-w-7xl mx-auto pb-20">
            <AdminModeBanner />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <DashboardCard
                    className={`md:col-span-4 w-full flex flex-col justify-between relative overflow-hidden ${showIntro ? "min-h-[300px]" : "min-h-[180px]"}`}
                >
                    <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                    <div className="relative z-10 w-full min-w-0 flex flex-col justify-between gap-8">
                        <div className="w-full min-w-0">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                                <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                                    GUCCHII<span className="text-blue-300">.COM</span>
                                </h1>
                                {isAdmin && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="bg-white/10 border-white/20 text-blue-100 hover:bg-white/20 hover:text-white"
                                        onClick={() => setShowIntroInAdmin((visible) => !visible)}
                                        aria-expanded={showIntroInAdmin}
                                    >
                                        {showIntroInAdmin ? (
                                            <EyeOff aria-hidden />
                                        ) : (
                                            <Eye aria-hidden />
                                        )}
                                        自己紹介を{showIntroInAdmin ? "隠す" : "表示"}
                                    </Button>
                                )}
                            </div>

                            {showIntro && (
                                <div className="w-full min-w-0 space-y-3">
                                    {content.intro.split("\n").map((paragraph, index) => (
                                        <p
                                            key={index}
                                            className="text-sm md:text-base text-blue-100 w-full max-w-none font-light leading-relaxed"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="w-full min-w-0">
                            <ExternalLinks links={content.connectLinks} noCard />
                        </div>
                    </div>
                </DashboardCard>
            </div>

            <section>
                <DynamicStats
                    initialStats={initialStats}
                    monitorSettings={content.monitorSettings}
                    monitorDisplayMode={content.monitorDisplayMode}
                />
            </section>

            <ServerStats />

            <section className="space-y-4">
                <SectionHeading title="Contribution Activity" />
                <DashboardCard className="bg-blue-600 dark:bg-slate-950 border-none">
                    <GithubActivity />
                </DashboardCard>
            </section>

            <section className="space-y-6">
                <SectionHeading title="Projects" />
                <DynamicProjects
                    projects={content.projects}
                    releaseVersions={projectReleaseVersions}
                />
            </section>

            <footer className="text-center py-12 text-sm opacity-50 dark:text-slate-400 text-slate-600 border-t border-slate-200 dark:border-slate-800 mt-12">
                <p className="font-mono text-xs">
                    © 2026 GUCCHII.com{" "}
                    <Link
                        href="/admin"
                        className="text-inherit no-underline cursor-default hover:cursor-pointer"
                        aria-label="管理画面"
                    >
                        v{appVersion}
                    </Link>
                </p>
            </footer>
        </main>
    )
}
