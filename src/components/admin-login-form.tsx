import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AdminLoginForm({ error }: { error?: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>管理画面ログイン</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                    <Button className="w-full" asChild>
                        <a href="/api/auth/login">Googleでログインする</a>
                    </Button>
                    <p className="mt-4 text-center text-sm text-slate-500">
                        <Link href="/" className="hover:underline">
                            サイトに戻る
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
