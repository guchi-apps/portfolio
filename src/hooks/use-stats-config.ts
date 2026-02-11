
"use client"

import { useEffect, useState } from "react"


export interface StatsConfig {
    yearsDetail: string
    projectsDetail: string
    totalAssets: number
    launchDate: string
    location: string
}

export const useStatsConfig = () => {
    const [stats, setStats] = useState<StatsConfig | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/stats-config.json')
            .then(res => res.json())
            .then(data => {
                setStats(data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to load stats config:', err)
                setLoading(false)
            })
    }, [])

    return { stats, loading }
}
