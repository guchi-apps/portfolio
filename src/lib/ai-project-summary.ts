import type { GitHubRepoSummary } from "@/types/github"

const ANTHROPIC_API = "https://api.anthropic.com"
const ANTHROPIC_VERSION = "2023-06-01"
const OAUTH_BETA = "oauth-2025-04-20"

/** 生成に使うモデル。プラン枠消費を抑えるため軽量なモデルを使う。 */
const MODEL = "claude-haiku-4-5"

/** READMEをそのまま渡すと長すぎるため、先頭からこの文字数だけを入力に使う */
export const README_MAX_CHARS = 6000

/** 技術スタックとして生成させる最大件数 */
const MAX_TECH_STACK = 6

export interface GeneratedProjectSummary {
    description: string
    techStack: string[]
}

function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return `${text.slice(0, maxLength)}...(省略)`
}

/** リポジトリ情報とREADMEから、説明文・技術スタック生成用のプロンプトを組み立てる */
export function buildProjectSummaryPrompt(
    repo: GitHubRepoSummary,
    readme: string | null,
): string {
    return `以下は個人開発者のGitHubリポジトリの情報です。この内容から、ポートフォリオサイトに掲載する「プロジェクト説明」と「技術スタック」を作成してください。

出力は前置きや説明・コードフェンスを一切付けず、以下の形式のJSONのみを出力してください。
{"description": "プロジェクト説明", "techStack": ["技術名1", "技術名2"]}

# プロジェクト説明の条件
- 日本語で2〜3文。何ができるアプリか、どんな課題を解決するかを、開発者以外にも伝わる言葉で書く
- 「このリポジトリは」「本プロジェクトでは」といった前置きは書かず、内容から始める
- READMEに書かれていない機能を推測して書かない。情報が乏しい場合は分かる範囲で短くまとめる
- インストール手順、ライセンス、コントリビューション方法などの運用情報は含めない

# 技術スタックの条件
- 実際に使われている主要な技術・フレームワーク・サービス名を最大${MAX_TECH_STACK}件
- 表記は一般的な公式名称に揃える（例: Next.js、TypeScript、Tailwind CSS、PostgreSQL）
- ビルド設定やCI、汎用的すぎるもの（Shell、Makefile など）は含めない

# リポジトリ情報
- 名前: ${repo.name}
- GitHubの説明: ${repo.description ?? "(未設定)"}
- 使用言語: ${repo.languages.join(", ") || "(不明)"}
- 公開URL: ${repo.homepage ?? "(未設定)"}

# README
${readme ? truncate(readme, README_MAX_CHARS) : "(取得できませんでした)"}`
}

type AnthropicMessageResponse = {
    content?: { type: string; text?: string }[]
}

function extractJsonText(text: string): string {
    const trimmed = text.trim()
    const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/)
    return fenced ? fenced[1].trim() : trimmed
}

/**
 * リポジトリ情報とREADMEから、プロジェクトの説明文と技術スタックをClaudeに生成させる。
 *
 * issue-deck と同様、`CLAUDE_CODE_OAUTH_TOKEN`（`user:inference`スコープ）で
 * `/v1/messages`を直接呼び出す。呼び出しごとにプラン枠を消費するため、
 * 呼び出し元でボタン操作等の明示的なトリガーに限定すること。
 */
export async function generateProjectSummary(
    token: string,
    repo: GitHubRepoSummary,
    readme: string | null,
): Promise<GeneratedProjectSummary> {
    const res = await fetch(`${ANTHROPIC_API}/v1/messages`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "anthropic-beta": OAUTH_BETA,
            "anthropic-version": ANTHROPIC_VERSION,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            model: MODEL,
            max_tokens: 1024,
            messages: [{ role: "user", content: buildProjectSummaryPrompt(repo, readme) }],
        }),
        cache: "no-store",
    })

    if (!res.ok) {
        throw new Error(`Claudeでの生成に失敗しました (${res.status})`)
    }

    const json = (await res.json()) as AnthropicMessageResponse
    const text = json.content?.find((block) => block.type === "text")?.text?.trim()
    if (!text) {
        throw new Error("Claudeの応答からテキストを取得できませんでした")
    }

    let parsed: unknown
    try {
        parsed = JSON.parse(extractJsonText(text))
    } catch {
        throw new Error("Claudeの応答をJSONとして解析できませんでした")
    }

    if (
        typeof parsed !== "object" ||
        parsed === null ||
        typeof (parsed as { description?: unknown }).description !== "string" ||
        !Array.isArray((parsed as { techStack?: unknown }).techStack)
    ) {
        throw new Error("Claudeの応答の形式が不正です")
    }

    const { description, techStack } = parsed as { description: string; techStack: unknown[] }

    return {
        description: description.trim(),
        techStack: techStack
            .filter((item): item is string => typeof item === "string")
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, MAX_TECH_STACK),
    }
}
