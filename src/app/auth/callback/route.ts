import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAllowedEmail } from "@/lib/auth"
import { notifySignalyLogin } from "@/lib/signaly"
import { getRequestOrigin } from "@/lib/request-origin"

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code")
    const origin = getRequestOrigin(request)

    if (!code) {
        return NextResponse.redirect(`${origin}/edit?error=unauthorized_email`)
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !isAllowedEmail(data.user?.email)) {
        await supabase.auth.signOut()
        return NextResponse.redirect(`${origin}/edit?error=unauthorized_email`)
    }

    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip")
    await notifySignalyLogin(ip)

    return NextResponse.redirect(`${origin}/edit`)
}
