
"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"
import { MapPin, Sun, Loader2 } from "lucide-react"
import { DashboardCard } from "@/components/dashboard-card"
import { useStatsConfig } from "@/hooks/use-stats-config"
import { useWeather } from "@/hooks/use-weather"

function Counter({ value }: { value: number }) {
    const spring = useSpring(0, { bounce: 0, duration: 2000 })
    const display = useTransform(spring, (current) =>
        Math.round(current).toLocaleString()
    )

    useEffect(() => {
        spring.set(value)
    }, [value, spring])

    return <motion.span>{display}</motion.span>
}


export function DynamicStats() {
    const { stats, loading: statsLoading } = useStatsConfig()
    const { data: weather, loading: weatherLoading, error: weatherError } = useWeather(34.6937, 135.5023)
    const [uptime, setUptime] = useState<string>("")

    useEffect(() => {
        if (!stats?.launchDate) return

        const launchDate = new Date(stats.launchDate)
        const updateUptime = () => {
            const now = new Date()
            const diff = now.getTime() - launchDate.getTime()

            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            const formattedHours = hours.toString().padStart(2, '0')
            const formattedMinutes = minutes.toString().padStart(2, '0')
            const formattedSeconds = seconds.toString().padStart(2, '0')

            setUptime(`${days}d ${formattedHours}:${formattedMinutes}:${formattedSeconds}`)
        }

        updateUptime()
        const interval = setInterval(updateUptime, 1000) // Update every second
        return () => clearInterval(interval)
    }, [stats?.launchDate])

    if (statsLoading || !stats) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                ))}
            </div>
        )
    }

    const WeatherIcon = weather?.icon || Sun

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            {/* Assets */}
            <DashboardCard className="flex flex-col justify-center items-center text-center" live>
                <span className="text-xs opacity-70 uppercase tracking-widest mb-1">Total Assets</span>
                <div className="text-2xl font-bold font-mono">
                    ¥ <Counter value={stats.totalAssets} />
                </div>
            </DashboardCard>

            {/* Uptime */}
            <DashboardCard className="flex flex-col justify-center items-center text-center" live>
                <span className="text-xs opacity-70 uppercase tracking-widest mb-1">System Live Since</span>
                <div className="text-xl font-bold font-mono text-emerald-300 dark:text-emerald-400">
                    {uptime || "CALCULATING..."}
                </div>
            </DashboardCard>

            {/* Location */}
            <DashboardCard className="flex flex-col justify-center items-center text-center" live>
                <span className="text-xs opacity-70 uppercase tracking-widest mb-1">Location</span>
                <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-sm font-medium">
                        <MapPin className="h-4 w-4 text-red-300 dark:text-red-400" />
                        <span>{stats.location}</span>
                    </div>
                    <div className="w-px h-4 bg-white/20 mx-1" />
                    <div className="flex items-center gap-1 text-sm text-yellow-300 dark:text-yellow-400">
                        {weatherLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : weatherError ? (
                            <span className="text-xs text-red-400">Error</span>
                        ) : (
                            <>
                                <WeatherIcon className="h-4 w-4" />
                                <span>{Math.round(weather!.temperature)}°C</span>
                            </>
                        )}
                    </div>
                </div>
            </DashboardCard>
        </div>
    )
}
