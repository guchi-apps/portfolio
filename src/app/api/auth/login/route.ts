import { NextRequest, NextResponse } from "next/server"
import { setSessionCookie, verifyPassword } from "@/lib/auth"
import { notifyDiscordLogin } from "@/lib/discord"

export async function POST(request: NextRequest) {
    try {
        const { password } = (await request.json()) as { password?: string }
        if (!password || !verifyPassword(password)) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 })
        }

        await setSessionCookie()

        const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            request.headers.get("x-real-ip")

        await notifyDiscordLogin(ip)

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ error: "Login failed" }, { status: 500 })
    }
}
