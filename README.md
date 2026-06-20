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
| `portfolio` | `DEPLOY_PATH` | アプリ本体の配置先（例: `/var/lib/portfolio`。**DocumentRoot と同じにしない**） |
| `portfolio` | `ADMIN_PASSWORD` | 管理画面のログインパスワード |
| `portfolio` | `SESSION_SECRET` | セッション署名用のランダム文字列 |
| `portfolio` | `DISCORD_WEBHOOK_URL` | ログイン通知用 Discord Webhook URL |
| `discord_webhook` | `CI_URL` | CI / デプロイ / リリース結果通知用 Discord Webhook URL |
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

CI / デプロイ / リリースの各ワークフロー完了時に、Discord へ成功・失敗・キャンセルの結果が通知されます（`DISCORD_CI_WEBHOOK_URL`）。

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
**ブラウザから見えるのは Apache のリバースプロキシ経由の応答だけ** にし、`DEPLOY_PATH` 内のファイルを直接公開しないでください。

`main` ブランチへのプッシュをトリガーとしてビルドとデプロイが行われます。

- **秘密情報**: 1Password から取得（詳細は「環境変数の設定（1Password）」を参照）
- **バージョン表示**: Git タグ（`v1.2.3` 形式）を正とし、フッターに表示されます。タグがない場合は `git describe` の結果、Git 外では `package.json` の `version` にフォールバックします
- **コンテンツデータ**: サーバー上の `data/site-content.json` に保存（デプロイ時も保持）

### リリース手順（develop → PR → タグ）

本番リリースは **PR マージ（デプロイ）** と **Git タグ push（GitHub Release）** の 2 段階です。PR マージだけでは GitHub Release は作成されず、フッターのバージョンも `git describe` 形式（例: `1.3.2-10-g2060c38`）になる場合があります。

#### 1. `develop` でバージョンを上げる

リリースに含める変更を `develop` にコミットしたうえで、`package.json` のバージョンを更新します。タグはこの時点では付けません（マージ後の `main` の先端に付けるため）。

```bash
git checkout develop
git pull origin develop

npm version patch --no-git-tag-version   # または minor / major
git add package.json
git commit -m "v1.4.0 に更新"
git push origin develop
```

#### 2. PR を作成して `main` にマージ

GitHub で `develop` → `main` の Pull Request を作成し、CI が通ったらマージします。

- **マージで起きること**: `deploy.yml` が走り、本番デプロイが実行される
- **マージだけでは起きないこと**: GitHub Release の作成、フッターへの正確なバージョン表示（例: `1.4.0`）

#### 3. `main` の merge コミットにタグを付ける

マージ直後に、**`main` の merge コミット**へ `v*` 形式のタグを push します。

**CLI:**

```bash
git checkout main
git pull origin main
git tag v1.4.0
git push origin v1.4.0
```

**GitHub UI:** [Releases](https://github.com/m-guchi/portfolio/releases) → 「Draft a new release」→ タグ `v1.4.0` を `main` の merge コミットに作成

- **タグ push で起きること**: `release.yml` が走り、GitHub Release が自動作成される（PR やコミットからリリースノートを生成）。Discord へリリース結果も通知される

#### タイミングの注意

フッターのバージョンは **デプロイ時のビルド** で Git タグから解決されます。デプロイ完了後にタグを付けた場合、フッターが `git describe` 形式のままになることがあります。その場合は GitHub Actions の Deploy ワークフローを **Re-run** してください。

#### ローカル確認

```bash
npm run version:resolve
```

`git describe` の結果、または `package.json` の `version` が表示されます。

### サーバー要件

- Node.js 20+
- [pm2](https://pm2.keymetrics.io/)（プロセス管理）

#### ディレクトリ配置（重要）

| パス | 用途 |
| :--- | :--- |
| `DEPLOY_PATH`（例: `/var/lib/portfolio`） | **アプリ本体**（`server.js`, `.env.production.local`, `data/` など） |
| Apache `DocumentRoot` | `DEPLOY_PATH` と**同じにしない** |

旧構成（静的 `out/` を `DocumentRoot` に置く）の名残で `DEPLOY_PATH` が `/var/www/html/...` になっていると、デプロイ後に **ディレクトリ一覧や `.env` が丸見え** になります。

推奨:

1. 1Password の `DEPLOY_PATH` を Web 公開ディレクトリ外に変更（例: `/var/lib/portfolio`）
2. pm2 で `DEPLOY_PATH/server.js` を起動
3. Apache は **プロキシのみ** 担当

#### Apache リバースプロキシ設定例

`ProxyPass /` で全リクエストを Next.js に転送すると、phpMyAdmin 用パスも Node 側に届き **Next.js の 404** になります。phpMyAdmin は **先にプロキシ対象から除外** してください（除外行は catch-all より上に書く）。

実際の phpMyAdmin パスは **GitHub に載せない** でください。サーバー上または 1Password などで管理し、ローカル用テンプレート [`deploy/apache-vhost.local.conf.example`](deploy/apache-vhost.local.conf.example) を `deploy/apache-vhost.local.conf` にコピーして `<PHPMYADMIN_PATH>` を置き換えて使います（`apache-vhost.local.conf` は gitignore 済み）。

公開用のプレースホルダー例は [`deploy/apache-vhost.example.conf`](deploy/apache-vhost.example.conf) を参照。

```apache
<VirtualHost *:443>
    ServerName gucchii.com

    ProxyPreserveHost On

    # phpMyAdmin（Next.js に渡さない）— <PHPMYADMIN_PATH> をサーバー固有の値に置換
    ProxyPass <PHPMYADMIN_PATH> !
    ProxyPassReverse <PHPMYADMIN_PATH> !

    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
</VirtualHost>
```

phpMyAdmin 本体の `Alias` や `Include` は別途サーバーに設定済みである前提です。設定変更後は `sudo systemctl reload apache2`（または `httpd`）で反映してください。

`DEPLOY_PATH` をどうしても DocumentRoot 配下に置く場合は、少なくとも `Options -Indexes` を有効にしてください。デプロイ時に `deploy/.htaccess` が `DEPLOY_PATH` へコピーされ、ディレクトリ一覧と機密ファイルへの直接アクセスを拒否します。

#### デプロイ後の確認

- `https://gucchii.com/` → サイトが表示される
- phpMyAdmin の URL（サーバー管理のパス）→ ログイン画面（Next.js の 404 ではないこと）
- `https://gucchii.com/.env.production.local` → **403**
- `DEPLOY_PATH` を URL で開いても **ファイル一覧が出ない**

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
