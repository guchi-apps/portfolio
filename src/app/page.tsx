
import { DashboardCard } from "@/components/dashboard-card"
import { ExternalLinks } from "@/components/external-links"
import { DynamicStats } from "@/components/dynamic-stats"
import { GithubActivity } from "@/components/github-activity"
import { ProjectGrid } from "@/components/project-grid"
import { getStatsConfig } from "@/lib/site-config"
import { getUptimeRobotMonitors } from "@/lib/uptimerobot"

export default async function Home() {
    const stats = getStatsConfig()
    const monitors = await getUptimeRobotMonitors()

    return (
        <main className="min-h-screen p-4 md:p-8 space-y-6 max-w-7xl mx-auto pb-20">
            {/* Header Grid */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Profile Card */}
                <DashboardCard className="md:col-span-4 flex flex-col justify-between relative overflow-hidden min-h-[300px]">
                    <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                                GUCCHII<span className="text-blue-300">.COM</span>
                            </h1>

                            <p className="text-sm md:text-base text-blue-100 max-w-2xl font-light leading-relaxed">
                                2018年に大学祭のWEBサイト作成を担当。以降、大学祭のWEBサイト・団体管理システムの運用を担当。
                                2020年にはQRコードで接触履歴を追跡できるシステムを開発し、コロナ禍でも対面でのイベント開催を実現。
                                メーカー勤務の現在は、趣味でWebアプリを作成・運用。
                            </p>
                        </div>

                        <div className="mt-8">
                            <ExternalLinks noCard />
                        </div>
                    </div>
                </DashboardCard>
            </div>

            {/* Dynamic Stats Row */}
            <section>
                <DynamicStats initialStats={stats} monitors={monitors} />
            </section>

            {/* Github Activity */}
            <section className="grid grid-cols-1">
                <DashboardCard className="bg-blue-600 dark:bg-slate-950 border-none" live>
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-bold text-lg text-white dark:text-slate-100 uppercase tracking-wider text-sm opacity-80">Contribution Activity</h2>
                    </div>
                    <GithubActivity />
                </DashboardCard>
            </section>

            {/* Projects Section */}
            <section className="pt-8 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-1 bg-blue-600 rounded-full" />
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Featured Projects
                    </h2>
                </div>
                <ProjectGrid />
            </section>

            <footer className="text-center py-12 text-sm opacity-50 dark:text-slate-400 text-slate-600 border-t border-slate-200 dark:border-slate-800 mt-12">
                <p>© 2026 GUCCHII.COM. Next.js, Tailwind & shadcn/ui で構築。</p>
            </footer>
        </main>
    )
}
