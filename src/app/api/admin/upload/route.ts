import crypto from "crypto"
import fs from "fs"
import path from "path"
import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getUploadsDir } from "@/lib/site-content"

const MAX_FILE_SIZE = 5 * 1024 * 1024

const ALLOWED_TYPES: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
}

export async function POST(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
        return NextResponse.json({ error: "file is required" }, { status: 400 })
    }

    const ext = ALLOWED_TYPES[file.type]
    if (!ext) {
        return NextResponse.json({ error: "対応していない画像形式です" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "画像サイズは5MB以下にしてください" }, { status: 400 })
    }

    const filename = `${crypto.randomUUID()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(path.join(getUploadsDir(), filename), buffer)

    return NextResponse.json({ url: `/api/uploads/${filename}` })
}
