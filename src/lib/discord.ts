export async function notifyDiscordLogin(ip: string | null): Promise<void> {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (!webhookUrl) return

    const timestamp = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    const content = [
        "🔐 **Portfolio 管理画面にログイン**",
        `時刻: ${timestamp}`,
        ip ? `IP: ${ip}` : null,
    ]
        .filter(Boolean)
        .join("\n")

    try {
        await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
        })
    } catch (error) {
        console.error("Discord notification failed:", error)
    }
}
