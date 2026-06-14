import { NextResponse } from "next/server"
import { getSiteContent } from "@/lib/site-content"

export async function GET() {
    return NextResponse.json(getSiteContent())
}
