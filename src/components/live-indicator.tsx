
"use client"

export function LiveIndicator() {
    return (
        <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-xs font-mono font-bold text-red-500 tracking-wider">LIVE</span>
        </div>
    )
}
