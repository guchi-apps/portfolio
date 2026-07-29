import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getRequestOrigin } from "@/lib/request-origin"

export async function GET(request: NextRequest) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${getRequestOrigin(request)}/auth/callback`,
        },
    })

    if (error || !data.url) {
        return NextResponse.json({ error: "Login failed" }, { status: 500 })
    }

    return NextResponse.redirect(data.url)
}
