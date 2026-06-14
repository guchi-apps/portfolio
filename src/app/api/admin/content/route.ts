import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getSiteContent, saveSiteContent } from "@/lib/site-content"
import type { SiteContent } from "@/types/site-content"

export async function GET() {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(getSiteContent())
}

export async function PUT(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const content = (await request.json()) as SiteContent
        saveSiteContent(content)
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("Save content error:", error)
        return NextResponse.json({ error: "Failed to save" }, { status: 500 })
    }
}
