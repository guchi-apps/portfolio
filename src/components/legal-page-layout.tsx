import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface LegalPageLayoutProps {
    title: string
    updatedAt: string
    children: React.ReactNode
}

export function LegalPageLayout({ title, updatedAt, children }: LegalPageLayoutProps) {
    return (
        <main className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto pb-20">
            <div className="mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                    <ArrowLeft className="size-4" aria-hidden />
                    サイトに戻る
                </Link>
            </div>

            <article className="space-y-8">
                <header className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        {title}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">最終改定日: {updatedAt}</p>
                </header>

                <div
                    className={[
                        "space-y-8 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300",
                        "[&_h2]:text-lg [&_h2]:md:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:mb-3",
                        "[&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:mb-1",
                        "[&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:hover:underline",
                    ].join(" ")}
                >
                    {children}
                </div>
            </article>

            <footer className="text-center py-12 text-sm opacity-50 dark:text-slate-400 text-slate-600 border-t border-slate-200 dark:border-slate-800 mt-12">
                <p className="font-mono text-xs">© 2026 GUCCHII.com</p>
            </footer>
        </main>
    )
}
