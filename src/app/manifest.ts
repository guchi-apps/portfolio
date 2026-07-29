import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Gucchii Apps",
        short_name: "Gucchii Apps",
        description: "個人開発者のプロジェクト実績・稼働状況をまとめたポートフォリオダッシュボード「Gucchii Apps」",
        start_url: "/",
        display: "standalone",
        background_color: "#f8fafc",
        theme_color: "#0f172a",
        icons: [
            {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icons/icon-512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    }
}
