
import { DashboardCard } from "@/components/dashboard-card"
import { ExternalLinks } from "@/components/external-links"
import { DynamicStats } from "@/components/dynamic-stats"
import { GithubActivity } from "@/components/github-activity"
import { ProjectGrid } from "@/components/project-grid"
import { getStatsConfig } from "@/lib/site-config"
import { getSiteContent } from "@/lib/site-content"
import { appVersion } from "@/lib/version"

export default async function Home() {
    const stats = getStatsConfig()
    const content = getSiteContent()

    return (
        <main className="min-h-screen p-4 md:p-8 space-y-6 max-w-7xl mx-auto pb-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <DashboardCard className="md:col-span-4 w-full flex flex-col justify-between relative overflow-hidden min-h-[300px]">
                    <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                    <div className="relative z-10 w-full min-w-0 flex flex-col justify-between gap-8">
                        <div className="w-full min-w-0">
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                                GUCCHII<span className="text-blue-300">.COM</span>
                            </h1>

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
                        </div>

                        <div className="w-full min-w-0">
                            <ExternalLinks links={content.connectLinks} noCard />
                        </div>
                    </div>
                </DashboardCard>
            </div>

            <section>
                <DynamicStats
                    initialStats={stats}
                    monitorSettings={content.monitorSettings}
                    monitorDisplayMode={content.monitorDisplayMode}
                />
            </section>

            <section className="grid grid-cols-1">
                <DashboardCard className="bg-blue-600 dark:bg-slate-950 border-none">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-bold text-lg text-white dark:text-slate-100 uppercase tracking-wider text-sm opacity-80">Contribution Activity</h2>
                    </div>
                    <GithubActivity />
                </DashboardCard>
            </section>

            <section className="pt-8 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-1 bg-blue-600 rounded-full" />
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Featured Projects
                    </h2>
                </div>
                <ProjectGrid projects={content.projects} />
            </section>

            <footer className="text-center py-12 text-sm opacity-50 dark:text-slate-400 text-slate-600 border-t border-slate-200 dark:border-slate-800 mt-12">
                <p className="font-mono text-xs">© 2026 GUCCHII.com v{appVersion}</p>
            </footer>
        </main>
    )
}
