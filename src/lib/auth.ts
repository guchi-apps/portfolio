import crypto from "crypto"
import { cookies } from "next/headers"

const COOKIE_NAME = "admin_session"
const SESSION_MAX_AGE_SEC = 60 * 60 * 24

function getSessionSecret(): string {
    const secret = process.env.SESSION_SECRET
    if (!secret) {
        throw new Error("SESSION_SECRET is not configured")
    }
    return secret
}

function sign(payload: string): string {
    return crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("hex")
}

export function createSessionToken(): string {
    const payload = JSON.stringify({
        exp: Date.now() + SESSION_MAX_AGE_SEC * 1000,
    })
    const encoded = Buffer.from(payload).toString("base64url")
    return `${encoded}.${sign(encoded)}`
}

export function verifySessionToken(token: string | undefined): boolean {
    if (!token) return false

    const [encoded, signature] = token.split(".")
    if (!encoded || !signature) return false

    const expected = sign(encoded)
    const sigBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expected)
    if (sigBuffer.length !== expectedBuffer.length) return false
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return false

    try {
        const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as {
            exp: number
        }
        return payload.exp > Date.now()
    } catch {
        return false
    }
}

export async function setSessionCookie(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, createSessionToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE_SEC,
    })
}

export async function clearSessionCookie(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
}

export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies()
    return verifySessionToken(cookieStore.get(COOKIE_NAME)?.value)
}

export function verifyPassword(password: string): boolean {
    const expected = process.env.ADMIN_PASSWORD
    if (!expected) return false

    const a = Buffer.from(password)
    const b = Buffer.from(expected)
    if (a.length !== b.length) return false
    return crypto.timingSafeEqual(a, b)
}
