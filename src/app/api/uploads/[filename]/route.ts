import fs from "fs"
import path from "path"
import { NextRequest, NextResponse } from "next/server"
import { getUploadsDir } from "@/lib/site-content"

const CONTENT_TYPES: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
}

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params
    const safeName = path.basename(filename)
    const contentType = CONTENT_TYPES[path.extname(safeName).toLowerCase()]

    if (!contentType || safeName !== filename) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const filePath = path.join(getUploadsDir(), safeName)
    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const body = new Uint8Array(fs.readFileSync(filePath))
    return new NextResponse(body, {
        headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    })
}
