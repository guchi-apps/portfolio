"use client"

import { useEffect, useState } from "react"

export function useAdminSession() {
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        const checkSession = async () => {
            try {
                const res = await fetch("/api/auth/session", { cache: "no-store" })
                const data = (await res.json()) as { authenticated: boolean }
                if (!cancelled) {
                    setIsAdmin(data.authenticated)
                    setLoading(false)
                }
            } catch {
                if (!cancelled) {
                    setIsAdmin(false)
                    setLoading(false)
                }
            }
        }

        void checkSession()

        return () => {
            cancelled = true
        }
    }, [])

    return { isAdmin, loading }
}
