import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { notifySignalyLogin } from "@/lib/signaly"

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code")
    const origin = request.nextUrl.origin

    if (!code) {
        return NextResponse.redirect(`${origin}/edit?error=unauthorized_email`)
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || data.user?.email !== process.env.ADMIN_ALLOWED_EMAIL) {
        await supabase.auth.signOut()
        return NextResponse.redirect(`${origin}/edit?error=unauthorized_email`)
    }

    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip")
    await notifySignalyLogin(ip)

    return NextResponse.redirect(`${origin}/edit`)
}
