/** GitHub リポジトリのうち、プロジェクト取り込みに使う情報だけを抜き出したもの */
export interface GitHubRepoSummary {
    name: string
    fullName: string
    description: string | null
    htmlUrl: string
    homepage: string | null
    createdAt: string
    /** 使用バイト数の多い順（割合の小さい言語は除外済み） */
    languages: string[]
}
