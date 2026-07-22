import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import {
    createRegisteredApp,
    deleteRegisteredApp,
    listRegisteredApps,
    updateRegisteredApp,
    type RegisteredApp,
} from "@/lib/registered-apps"

export const dynamic = "force-dynamic"

async function unauthorized() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

function errorResponse(error: unknown) {
    const message = error instanceof Error ? error.message : "設定の更新に失敗しました"
    return NextResponse.json({ error: message }, { status: 400 })
}

export async function GET() {
    if (!(await isAuthenticated())) return unauthorized()
    try {
        return NextResponse.json({ apps: await listRegisteredApps() })
    } catch (error) {
        return errorResponse(error)
    }
}

export async function POST(request: NextRequest) {
    if (!(await isAuthenticated())) return unauthorized()
    try {
        const app = await request.json() as RegisteredApp
        await createRegisteredApp(app)
        return NextResponse.json({ ok: true })
    } catch (error) {
        return errorResponse(error)
    }
}

export async function PUT(request: NextRequest) {
    if (!(await isAuthenticated())) return unauthorized()
    try {
        const body = await request.json() as { originalId: string; app: RegisteredApp }
        await updateRegisteredApp(body.originalId, body.app)
        return NextResponse.json({ ok: true })
    } catch (error) {
        return errorResponse(error)
    }
}

export async function DELETE(request: NextRequest) {
    if (!(await isAuthenticated())) return unauthorized()
    try {
        const id = new URL(request.url).searchParams.get("id")
        if (!id) throw new Error("アプリIDが必要です")
        await deleteRegisteredApp(id)
        return NextResponse.json({ ok: true })
    } catch (error) {
        return errorResponse(error)
    }
}
