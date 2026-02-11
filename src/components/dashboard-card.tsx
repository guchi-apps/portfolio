
import { cn } from "@/lib/utils"
import { LiveIndicator } from "@/components/live-indicator"

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    noPadding?: boolean
    live?: boolean
}

export function DashboardCard({ children, className, noPadding = false, live = false, ...props }: DashboardCardProps) {
    return (
        <div
            className={cn(



                "rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md relative group",
                "bg-blue-600 text-white border-none", // Light mode specific
                "dark:bg-slate-900 dark:border dark:border-slate-700 dark:text-slate-100", // Dark mode specific
                noPadding ? "p-0" : "p-6",
                className
            )}
            {...props}
        >
            {live && (
                <div className="absolute top-4 right-4 z-10">
                    <LiveIndicator />
                </div>
            )}
            {children}
        </div>
    )
}
