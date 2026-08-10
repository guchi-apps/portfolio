import Anthropic from "@anthropic-ai/sdk"
import type { GitHubRepoSummary } from "@/types/github"

const MODEL = "claude-opus-5"

/** READMEをそのまま渡すと長すぎるため、先頭からこの文字数だけを入力に使う */
export const README_MAX_CHARS = 8000

/** 技術スタックとして生成させる最大件数 */
const MAX_TECH_STACK = 6

export interface GeneratedProjectSummary {
    description: string
    techStack: string[]
}

const SUMMARY_SCHEMA = {
    type: "object",
    properties: {
        description: {
            type: "string",
            description: "ポートフォリオに載せるプロジェクト説明（日本語、2〜3文）",
        },
        techStack: {
            type: "array",
            items: { type: "string" },
            description: `主要な技術・フレームワーク名の配列（最大${MAX_TECH_STACK}件）`,
        },
    },
    required: ["description", "techStack"],
    additionalProperties: false,
} as const

const SYSTEM_PROMPT = `あなたは個人開発者のポートフォリオサイトの編集を手伝うアシスタントです。
GitHubリポジトリの情報から、ポートフォリオの「プロジェクト説明」と「技術スタック」を作成してください。

説明の書き方:
- 日本語で、2〜3文。何ができるアプリか、どんな課題を解決するかを、開発者以外にも伝わる言葉で書く
- 「このリポジトリは」「本プロジェクトでは」といった前置きは書かず、内容から始める
- READMEに書かれていない機能を推測して書かない。情報が乏しい場合は分かる範囲で短くまとめる
- インストール手順、ライセンス、コントリビューション方法などの運用情報は含めない

技術スタックの書き方:
- 実際に使われている主要な技術・フレームワーク・サービス名を最大${MAX_TECH_STACK}件
- 表記は一般的な公式名称に揃える（例: Next.js、TypeScript、Tailwind CSS、PostgreSQL）
- ビルド設定やCI、汎用的すぎるもの（Shell、Makefile など）は含めない`

function buildUserPrompt(repo: GitHubRepoSummary, readme: string | null): string {
    const lines = [
        `リポジトリ名: ${repo.name}`,
        `GitHubの説明: ${repo.description ?? "（未設定）"}`,
        `使用言語: ${repo.languages.join(", ") || "（不明）"}`,
        `公開URL: ${repo.homepage ?? "（未設定）"}`,
    ]

    lines.push("", readme ? `README:\n${readme}` : "README: （取得できませんでした）")

    return lines.join("\n")
}

function parseSummary(raw: string): GeneratedProjectSummary | null {
    try {
        const parsed = JSON.parse(raw) as Partial<GeneratedProjectSummary>
        if (typeof parsed.description !== "string" || !Array.isArray(parsed.techStack)) {
            return null
        }

        return {
            description: parsed.description.trim(),
            techStack: parsed.techStack
                .filter((item): item is string => typeof item === "string")
                .map((item) => item.trim())
                .filter(Boolean)
                .slice(0, MAX_TECH_STACK),
        }
    } catch {
        return null
    }
}

/**
 * リポジトリ情報とREADMEから、プロジェクトの説明文と技術スタックを生成する。
 * 生成できなかった場合は null を返す。
 */
export async function generateProjectSummary(
    repo: GitHubRepoSummary,
    readme: string | null,
): Promise<GeneratedProjectSummary | null> {
    const client = new Anthropic()

    const response = await client.beta.messages.create({
        model: MODEL,
        max_tokens: 16000,
        // 安全性分類器に断られた場合、サーバー側で推奨モデルへ自動フォールバックする
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        system: SYSTEM_PROMPT,
        output_config: {
            effort: "low",
            format: { type: "json_schema", schema: SUMMARY_SCHEMA },
        },
        messages: [{ role: "user", content: buildUserPrompt(repo, readme) }],
    })

    if (response.stop_reason === "refusal") {
        return null
    }

    const text = response.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("")

    return text ? parseSummary(text) : null
}
