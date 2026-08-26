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

    // 接続元IP・User-Agent は notifySignalyLogin がリクエストヘッダーから拾う
    await notifySignalyLogin({
        email: data.user?.email ?? null,
        name:
            (data.user?.user_metadata?.full_name as string | undefined) ??
            (data.user?.user_metadata?.name as string | undefined) ??
            null,
        provider: data.user?.app_metadata?.provider ?? null,
    })

    return NextResponse.redirect(`${origin}/edit`)
}
