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
cp data/site-content.example.json data/site-content.json
```

`data/site-content.json` はローカル専用のランタイムデータです（Git 管理外）。初回のみテンプレートからコピーしてください。未作成の場合は起動時に自動生成されます。

### 環境変数の設定

#### 1. ローカル開発（1Password は不要）

ローカル開発に必要な値は `.env.local` に平文で保存します（`.gitignore` 済みのためコミットされません）。1Password は本番デプロイ・CI にのみ使用します。

```bash
cp .env.local.example .env.local
# 値を編集（UPTIMEROBOT_READ_ONLY_KEY / ADMIN_PASSWORD / SESSION_SECRET など）
npm run dev
```

#### 2. 本番デプロイ・CI 用シークレットを 1Password に登録

リポジトリに含まれる `.env.tpl` に secret reference が定義されています。`apps` ボールトに以下のアイテムを作成し、フィールドを登録してください。

| アイテム | フィールド名 | 説明 |
| :--- | :--- | :--- |
| `portfolio` | `next-public-uptimerobot-read-only-key` | UptimeRobot Read-Only APIキー（サーバー専用） |
| `portfolio` | `deploy-path` | アプリ本体の配置先（例: `/var/lib/portfolio） |
| `portfolio` | `admin-password` | 管理画面のログインパスワード |
| `portfolio` | `session-secret` | セッション署名用のランダム文字列 |
| `portfolio` | `ci-webhook-url` | CI / デプロイ / リリース通知用 Signaly Webhook URL |
| `portfolio` | `login-webhook-url` | ログイン通知用 Signaly Webhook URL |
| `githubaction-sshkey` | `private_key` | SSH秘密鍵（デプロイ用） |
| `Server` | `host` | デプロイ先サーバーのホスト名またはIP |
| `Server` | `username` | SSH接続ユーザー名 |
| `Server` | `ssh-port` | SSHポート番号（例: `22`） |

ボールト名やアイテム名を変更した場合は、`.env.tpl` 内の `op://` 参照を合わせて更新してください。本番相当の値でローカルビルドを確認したい場合は、[1Password CLI](https://developer.1password.com/docs/cli/) をインストール・サインインのうえ `npm run build:local` を使用してください。

#### 3. GitHub Actions（CI/CD）

GitHub リポジトリには **1つだけ** シークレットを登録します。

| Secret Name | 説明 |
| :--- | :--- |
| `OP_SERVICE_ACCOUNT_TOKEN` | 1Password Service Account のトークン（`apps` ボールトへのアクセス権限を付与） |

`main` ブランチへのプッシュで、ビルド → SSH デプロイが自動実行されます。デプロイに必要な SSH 情報や API キーはすべて 1Password から取得されます。

CI / デプロイ / リリースの各ワークフロー完了時に Signaly へ通知されます（`SIGNALY_WEBHOOK_URL`）。

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
- **コンテンツデータ**: サーバー上の `data/site-content.json` に保存（デプロイ時も保持）。リポジトリには `data/site-content.example.json` のみ含め、実データは Git 管理しない

### リリース手順（develop → PR マージ）

`main` へのマージで **デプロイ・Git タグ・GitHub Release がすべて自動** 実行されます。手動でタグを付ける必要はありません。

#### 1. `develop` でバージョンを上げる

リリースに含める変更を `develop` にコミットしたうえで、`package.json` のバージョンを更新します。

```bash
git checkout develop
git pull origin develop

npm version patch --no-git-tag-version   # バグ修正など（例: 2.3.1 → 2.3.2）
# npm version minor --no-git-tag-version  # 機能追加など（例: 2.3.1 → 2.4.0）
# npm version major --no-git-tag-version  # 破壊的変更など（例: 2.3.1 → 3.0.0）

git add package.json
git commit -m "v2.3.2 に更新する"
git push origin develop
```

`--no-git-tag-version` を付けることで、`npm version` がタグを自動作成しないようにしています（タグは `main` マージ後に GitHub Actions が作成します）。実行後に表示される `v2.3.2` などの文字列が新しいバージョン番号です。

#### 2. PR を作成して `main` にマージ

GitHub で `develop` → `main` の Pull Request を作成し、CI が通ったらマージします。

マージ後、GitHub Actions が次の順で自動実行されます。

| 順序 | ワークフロー | 内容 |
| :--- | :--- | :--- |
| 1 | `deploy.yml`（tag ジョブ） | `package.json` のバージョンから `v1.4.0` 形式の Git タグを作成・push |
| 2 | `deploy.yml`（release ジョブ） | GitHub Release を自動作成（リリースノート生成・Signaly 通知） |
| 3 | `deploy.yml`（deploy ジョブ） | タグを参照してビルドし、本番デプロイ |

※ Actions の `GITHUB_TOKEN` で push したタグは別ワークフローを起動しないため、Release も `deploy.yml` 内で実行します。手動でタグ push した場合のみ `release.yml` が走ります。

`package.json` のバージョンと同名のタグが **別コミットに既に存在する** 場合、tag ジョブはエラーで止まります。リリース前に必ずバージョンを上げてください。

#### ローカル確認

```bash
npm run version:resolve
```

`git describe` の結果、または `package.json` の `version` が表示されます。

### サーバー要件

- Node.js 20+
- [pm2](https://pm2.keymetrics.io/)（プロセス管理）

#### ディレクトリ配置

| パス | 用途 |
| :--- | :--- |
| `deploy-path`（例: `/var/lib/portfolio`） | **アプリ本体**（`server.js`, `.env.production.local`, `data/` など） |


推奨:

1. 1Password の `deploy-path` を Web 公開ディレクトリ外に変更（例: `/var/lib/portfolio`）
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

    ProxyPass / http://127.0.0.1:3105/
    ProxyPassReverse / http://127.0.0.1:3105/
</VirtualHost>
```

phpMyAdmin 本体の `Alias` や `Include` は別途サーバーに設定済みである前提です。設定変更後は `sudo systemctl reload apache2`（または `httpd`）で反映してください。

`DEPLOY_PATH` をどうしても DocumentRoot 配下に置く場合は、少なくとも `Options -Indexes` を有効にしてください。デプロイ時に `deploy/.htaccess` が `DEPLOY_PATH` へコピーされ、ディレクトリ一覧と機密ファイルへの直接アクセスを拒否します。

#### デプロイ後の確認

- `https://gucchii.com/` → サイトが表示される
- phpMyAdmin の URL（サーバー管理のパス）→ ログイン画面（Next.js の 404 ではないこと）
- `DEPLOY_PATH` を URL で開いても **ファイル一覧が出ない**

## 🔧 管理画面・ダッシュボード

管理者向けの画面は用途ごとに分かれています（いずれも要ログイン）。

| パス | 用途 |
| :--- | :--- |
| `/edit` | サイトコンテンツの編集 |
| `/admin` | ダッシュボード（VPS の稼働状況などを確認） |

### `/edit`（サイトコンテンツの編集）

| 編集項目 | 説明 |
| :--- | :--- |
| 自己紹介 | トップページのプロフィール文 |
| Connect リンク | 名前・アイコン・URL |
| UptimeRobot | モニターごとの表示/非表示・表示方法（カード/コンパクト/バッジ） |
| Featured Projects | プロジェクト一覧 |

- **URL**: `https://gucchii.com/edit`

### `/admin`（ダッシュボード）

- **URL**: `https://gucchii.com/admin`
- CPU / メモリ / ディスク / ロードアベレージ / 稼働時間などの VPS ステータスを表示

### 共通

- **パスワード**: 1Password の `ADMIN_PASSWORD`
- **ログイン時**: Signaly へ通知

ローカル開発時は `npm run dev` のあと `http://localhost:3000/edit` または `http://localhost:3000/admin` にアクセスしてください。

## 📄 ライセンス

[MIT License](LICENSE)

## CI/CD の既知の課題

> 2026-06-29 時点で確認された課題です。対応が完了したら削除または更新してください。

| 優先度 | 課題 | 対象ファイル |
|--------|------|-------------|
| 中 | **`release` ジョブがデプロイ完了を待たない** — 現状は `needs: tag` のみのため、デプロイ失敗時でも GitHub Release が作られてしまう。`needs: [tag, deploy]` に修正する（`car` / `myroom` の実装に合わせる） | `.github/workflows/deploy.yml` |
