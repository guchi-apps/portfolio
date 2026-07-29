import { createClient } from "@/lib/supabase/server"

export async function isAuthenticated(): Promise<boolean> {
    const allowedEmail = process.env.ADMIN_ALLOWED_EMAIL
    if (!allowedEmail) return false

    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    return user?.email === allowedEmail
}
