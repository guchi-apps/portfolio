import { createClient } from "@/lib/supabase/server"

function getAllowedEmails(): string[] {
    return (process.env.ALLOWED_GOOGLE_EMAILS ?? "")
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean)
}

export function isAllowedEmail(email: string | null | undefined): boolean {
    if (!email) return false
    return getAllowedEmails().includes(email)
}

export async function isAuthenticated(): Promise<boolean> {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    return isAllowedEmail(user?.email)
}
