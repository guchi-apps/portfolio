# gucchii.com - System Dashboard Portfolio

システムダッシュボードのようなUIデザインを採用し、GitHubのコントリビューション活動やサーバーの稼働状況などを可視化しているポートフォリオサイトのリポジトリです。

## ✨ 特長

- **システムダッシュボード風デザイン**: グラスモーフィズムやアニメーションを取り入れたモダンなUI
- **Next.js App Router**: 最新のNext.js 16を採用
- **レスポンシブ対応**: デスクトップ、タブレット、モバイルに最適化
- **ダークモード対応**: システム設定に連動したテーマ切り替え
- **リアルタイムステータス**:
  - **GitHub Activity**: GitHubのコントリビューショングラフを表示 (`react-github-calendar`)
  - **System Status**: UptimeRobot APIを利用してサーバーの稼働状況を表示

## 🛠 技術スタック

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**:
  - [shadcn/ui](https://ui.shadcn.com/) (Radix UI based)
  - [Lucide Icons](https://lucide.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

## 🚀 セットアップ

### 必要要件

- Node.js 18以上
- npm

### インストール

プロジェクトをクローンし、依存関係をインストールします。

```bash
git clone https://github.com/m-guchi/portfolio.git
cd portfolio
npm install
```

### 環境変数の設定（1Password）

秘密情報は `.env.local` ではなく **1Password** から取得します。リポジトリに含まれる `.env.tpl` に secret reference が定義されています。

#### 1. 1Password にシークレットを登録

`apps` ボールトに以下のアイテムを作成し、フィールドを登録してください。

| アイテム | フィールド名 | 説明 |
| :--- | :--- | :--- |
| `portfolio` | `UPTIMEROBOT_READ_ONLY_KEY` | UptimeRobot Read-Only APIキー（サーバー専用） |
| `portfolio` | `DEPLOY_PATH` | 公開ディレクトリのフルパス（例: `/var/www/html/portfolio`） |
| `portfolio` | `ADMIN_PASSWORD` | 管理画面のログインパスワード |
| `portfolio` | `SESSION_SECRET` | セッション署名用のランダム文字列 |
| `portfolio` | `DISCORD_WEBHOOK_URL` | ログイン通知用 Discord Webhook URL |
| `githubaction-sshkey` | `PRIVATE_KEY` | SSH秘密鍵（デプロイ用） |
| `Server` | `host` | デプロイ先サーバーのホスト名またはIP |
| `Server` | `username` | SSH接続ユーザー名 |
| `Server` | `ssh-port` | SSHポート番号（例: `22`） |

ボールト名やアイテム名を変更した場合は、`.env.tpl` 内の `op://` 参照を合わせて更新してください。

#### 2. ローカル開発

[1Password CLI](https://developer.1password.com/docs/cli/) をインストールし、サインインしたうえで以下を実行します。

```bash
npm run dev
```

`npm run dev` は内部で `op run --env-file=.env.tpl` を使い、1Password から環境変数を注入します。ローカルビルドは `npm run build:local` を使用してください。

#### 3. GitHub Actions（CI/CD）

GitHub リポジトリには **1つだけ** シークレットを登録します。

| Secret Name | 説明 |
| :--- | :--- |
| `OP_SERVICE_ACCOUNT_TOKEN` | 1Password Service Account のトークン（`apps` ボールトへのアクセス権限を付与） |

`main` ブランチへのプッシュで、ビルド → SSH デプロイが自動実行されます。デプロイに必要な SSH 情報や API キーはすべて 1Password から取得されます。

### 開発サーバーの起動

開発サーバーを起動します。

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

### ビルド

以下のコマンドで静的ファイル (`out/`) が生成されます。

```bash
npm run build
```

## 🌿 ブランチ運用

| ブランチ | 用途 |
| :--- | :--- |
| `develop` | 日常の開発ブランチ（ここで作業する） |
| `main` | 本番ブランチ（`develop` から PR をマージ） |

### 開発フロー

```bash
git checkout develop
git pull origin develop
# 機能開発・修正
git commit -m "変更内容"
git push origin develop
# GitHub で develop → main の PR を作成・マージ
```

`main` へのマージ後、GitHub Actions により自動デプロイが実行されます。

### PR 時の検証（CI）

`main` / `develop` 向けの Pull Request では、GitHub Actions で以下を自動実行します。

- `npm run lint`
- `npm run build`

デプロイは行わず、ビルドが通るかどうかの検証のみです。

## 📦 デプロイとバージョン表示

このプロジェクトは **Next.js standalone** モードでビルドし、サーバー上で Node.js（pm2）として稼働します。
Apache などのリバースプロキシから `http://127.0.0.1:3000` へ転送してください。

`main` ブランチへのプッシュをトリガーとしてビルドとデプロイが行われます。

- **秘密情報**: 1Password から取得（詳細は「環境変数の設定（1Password）」を参照）
- **バージョン表示**: `package.json` の `version` がフッターに表示されます（現在: `1.3.0`）
- **コンテンツデータ**: サーバー上の `data/site-content.json` に保存（デプロイ時も保持）

### サーバー要件

- Node.js 20+
- [pm2](https://pm2.keymetrics.io/)（プロセス管理）
- Apache 等でのリバースプロキシ設定例:

```apache
ProxyPass / http://127.0.0.1:3000/
ProxyPassReverse / http://127.0.0.1:3000/
```

## 🔧 管理画面

`/admin` でサイトコンテンツを編集できます（要ログイン）。

| 編集項目 | 説明 |
| :--- | :--- |
| 自己紹介 | トップページのプロフィール文 |
| Connect リンク | 名前・アイコン・URL |
| UptimeRobot | モニターごとの表示/非表示・表示方法（カード/コンパクト/バッジ） |
| Featured Projects | プロジェクト一覧 |

- **URL**: `https://gucchii.com/admin`
- **パスワード**: 1Password の `ADMIN_PASSWORD`
- **ログイン時**: Discord Webhook へ通知

ローカル開発時は `npm run dev` のあと `http://localhost:3000/admin` にアクセスしてください。

## 📄 ライセンス

[MIT License](LICENSE)
