import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getRegisteredUsers } from "@/lib/registered-users"

export const dynamic = "force-dynamic"

export async function GET() {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apps = await getRegisteredUsers()
    return NextResponse.json({ apps })
}
