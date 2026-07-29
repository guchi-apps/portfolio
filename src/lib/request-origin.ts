import type { NextRequest } from "next/server"

/**
 * `request.nextUrl.origin` は `next dev -H 0.0.0.0` 時にHostヘッダーではなく
 * bindアドレス（0.0.0.0）を返してしまうため、ヘッダーから直接組み立てる。
 */
export function getRequestOrigin(request: NextRequest): string {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
    const protocol =
        request.headers.get("x-forwarded-proto") ??
        (process.env.NODE_ENV === "production" ? "https" : "http")
    return `${protocol}://${host}`
}
