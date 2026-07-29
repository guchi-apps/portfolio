"use client"

export function MonitorCardGrid({ children, count }: { children: React.ReactNode; count: number }) {
    const gridCols =
        count === 1
            ? "grid-cols-1"
            : count === 2
              ? "md:grid-cols-2"
              : count === 3
                ? "md:grid-cols-3"
                : "md:grid-cols-2 lg:grid-cols-4"

    return <div className={`grid grid-cols-1 ${gridCols} gap-4 h-full`}>{children}</div>
}
