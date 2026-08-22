# gucchii.com - System Dashboard Portfolio

システムダッシュボードのようなUIデザインを採用し、GitHubのコントリビューション活動やサーバーの稼働状況などを可視化しているポートフォリオサイトのリポジトリです。

## ✨ 特長

- **システムダッシュボード風デザイン**: グラスモーフィズムやアニメーションを取り入れたモダンなUI
- **Next.js App Router**: 最新のNext.js 16を採用
- **レスポンシブ対応**: デスクトップ、タブレット、モバイルに最適化
- **ダークモード対応**: システム設定に連動したテーマ切り替え
- **リアルタイムステータス**:
  - **GitHub Activity**: GitHubのコントリビューショングラフを表示 (`react-github-calendar`)
  - **System Status**: Uptime Kuma のステータスページからモニター状況を表示（`/edit` で表示/非表示を設定）。UptimeRobot とVPSステータスを含む管理ダッシュボードは [ops-dashboard](https://admin.gucchii.com) へ移設済み

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
# 値を編集（NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY / ALLOWED_GOOGLE_EMAILS など）
# NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY は 1Password共有アイテム「Supabase」の dev-project-url / dev-publishable-key を使用（開発用プロジェクト。本番用と誤って混同しないよう分離）
npm run dev
```

#### 2. 本番デプロイ・CI 用の値を 1Password に登録

**実行時（GitHub Actions）は 1Password を呼びません。** 値は GitHub の secret / variable から読み、1Password は「人が管理する唯一の正」として残します。以前は実行のたびに 1Password から読んでいましたが、サービスアカウントの日次レート制限（1Password アカウント全体で 1,000 リクエスト/日）を使い切ってデプロイが止まったためです（guchi-apps/issue-deck#1302 / #1307）。

どの値を GitHub のどこ（repository / organization、secret / variable）から取るかは [`.github/secrets-manifest.tsv`](.github/secrets-manifest.tsv) が正です。

`apps` ボールトに以下のアイテムを作成し、フィールドを登録してください。

| アイテム | フィールド名 | 説明 |
| :--- | :--- | :--- |
| `portfolio` | `uptimekuma-base-url` | Uptime Kuma のURL（Render等。サーバー専用でブラウザには渡さない） |
| `portfolio` | `uptimekuma-portfolio-slug` | Uptime Kuma のポートフォリオ用ステータスページのスラッグ（サーバー専用） |
| `portfolio` | `deploy-path` | アプリ本体の配置先（例: `/var/lib/portfolio`） |
| `portfolio` | `allowed-google-emails` | 管理画面へのログインを許可するGoogleアカウントのメールアドレス（複数指定はカンマ区切り） |
| `portfolio` | `ci-webhook-url` | CI / デプロイ / リリース通知用 Signaly Webhook URL |
| `portfolio` | `login-webhook-url` | ログイン通知用 Signaly Webhook URL |
| `Supabase`（複数アプリ共通） | `dev-project-url` | 開発用 Supabase プロジェクトの URL（`.env.local` に手動で設定） |
| `Supabase`（複数アプリ共通） | `dev-publishable-key` | 開発用 Supabase の Publishable key（`.env.local` に手動で設定） |

Supabase の本番用プロジェクト（`project-url` / `publishable-key`）と SSH 接続情報（`githubaction-sshkey` / `Server`）は、複数アプリで共有するため organization の共通値として GitHub 側に登録済みです。このリポジトリからは同期しません。

**値を変更したときだけ** GitHub へ同期します。同期はどちらか一方で行います。

```bash
# 手元から実行する場合（op は個人アカウントのセッションを使うため、サービスアカウントの枠を消費しない）
op signin
scripts/sync-github-secrets.sh --dry-run   # 差分の確認
scripts/sync-github-secrets.sh             # 実行
```

issue-deck の画面からは「Sync secrets」ボタン（[`.github/workflows/sync-secrets.yml`](.github/workflows/sync-secrets.yml) の `workflow_dispatch`）でも起こせます。

マニフェストに項目を足したときは、ワークフローの `env:` ブロックを [`scripts/generate-workflow-env-block.sh`](scripts/generate-workflow-env-block.sh) で生成し直して貼り替えてください。

#### 3. GitHub Actions（CI/CD）

このリポジトリに登録する repository の secret / variable は次の6件です。値は上記の同期スクリプトが 1Password から書き込みます。

| 名前 | 種別 | 用途 |
| :--- | :--- | :--- |
| `ALLOWED_GOOGLE_EMAILS` | secret | 管理画面のログインを許可するメールアドレス |
| `DEPLOY_PATH` | secret | サーバー上の配置先パス |
| `SIGNALY_LOGIN_WEBHOOK_URL` | secret | ログイン通知用 Webhook URL |
| `SIGNALY_WEBHOOK_URL` | secret | CI / デプロイ / リリース通知用 Webhook URL |
| `UPTIMEKUMA_BASE_URL` | variable | Uptime Kuma のURL |
| `UPTIMEKUMA_PORTFOLIO_SLUG` | variable | Uptime Kuma のステータスページのスラッグ |

残りの7件は organization の共通値をそのまま参照します（このリポジトリでは設定不要）。GitHub 側は中立的な名前のため、ワークフロー内の名前へ読み替えています。

| ワークフロー内の名前 | organization 側の名前 | 種別 |
| :--- | :--- | :--- |
| `CLAUDE_CODE_OAUTH_TOKEN` | `CLAUDE_CODE_OAUTH_TOKEN` | secret |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `SUPABASE_PUBLISHABLE_KEY` | variable |
| `NEXT_PUBLIC_SUPABASE_URL` | `SUPABASE_PROJECT_URL` | variable |
| `SSH_HOST` | `SERVER_HOST` | secret |
| `SSH_PORT` | `SERVER_SSH_PORT` | secret |
| `SSH_PRIVATE_KEY` | `SERVER_SSH_PRIVATE_KEY` | secret |
| `SSH_USERNAME` | `SERVER_USERNAME` | secret |

このほかに `OP_SERVICE_ACCOUNT_TOKEN`（1Password Service Account のトークン）が repository secret として残っていますが、デプロイでは使いません。全リポジトリの移行が完了した時点でまとめて削除します。

`main` ブランチへのプッシュで、ビルド → SSH デプロイが自動実行されます。デプロイに必要な SSH 情報や API キーはすべて GitHub の secret / variable から取得されます。

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

- **秘密情報**: GitHub の secret / variable から取得（1Password は人が管理する正で、実行時には呼ばない。詳細は「環境変数の設定」を参照）
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
| Uptime Kuma | ポートフォリオ/ダッシュボードそれぞれでの表示可否 |
| Featured Projects | プロジェクト一覧 |

- **URL**: `https://gucchii.com/edit`

### `/admin`（ダッシュボード）— ops-dashboard へ移設済み

VPSステータス・UptimeRobot・Uptime Kuma のダッシュボードは **[ops-dashboard](https://admin.gucchii.com)（`guchi-apps/ops-dashboard`）へ移設**しており、このリポジトリには実装がありません（`src/app/` に `admin` のページは無く、API も `/api/uptime-kuma/portfolio` だけです）。UptimeRobot の APIキーとダッシュボード用スラッグも ops-dashboard 側の1Passwordアイテムが持ちます。

### Uptime Kuma の表示内容

このリポジトリが使うのは**ポートフォリオ用のステータスページ**だけです（ダッシュボード用は ops-dashboard 側で使います）。

| ページ | 表示内容 |
| :--- | :--- |
| ポートフォリオ（`/`） | サイト名・URL・現在のステータス |

ステータスは Up（緑）/ Down（赤）/ Pending（オレンジ）/ Maintenance（青）の4種類で表示されます。

### Uptime Kuma の初回セットアップ

Uptime Kuma は UptimeRobot と異なり API キーは使いません。ステータスページ機能を使ってモニター一覧を取得します。

このリポジトリでは Uptime Kuma を [Render](https://render.com/) 上で運用している想定です。Render の Web Service には既定で `https://<サービス名>.onrender.com` の公開URLが割り当てられ、ポートフォリオのサーバーからはこのURLへインターネット経由でアクセスします。

1. Uptime Kuma の管理画面で「Status Pages」→ ポートフォリオ用の新規ステータスページを作成し、表示したいモニターを追加する（各モニターの「Send URL」を有効にすると URL も表示される）
2. 作成したステータスページの URL（例: `https://<サービス名>.onrender.com/status/<slug>`）から `<slug>` 部分を控える
3. Uptime Kuma にはステータスページ自体へのアクセス制限機能（パスワード保護など）がないため、URLを知っていれば誰でもステータスページ自体には到達できてしまう。**URLを公開・リンクしないことで実質的に非公開を保つ**（ポートフォリオ側の `/api/uptime-kuma/*` はこのURLをブラウザに一切渡さず、選択したモニター情報のみを中継する）
4. 環境変数に以下を設定する
   - ローカル: `.env.local` に `UPTIMEKUMA_BASE_URL`（例: `https://<サービス名>.onrender.com`）と `UPTIMEKUMA_PORTFOLIO_SLUG`（手順2の`<slug>`）を設定
   - 本番: 1Password の `apps/portfolio` アイテムに `uptimekuma-base-url` / `uptimekuma-portfolio-slug` を用意する（`.github/secrets-manifest.tsv` が正の在り処を持ち、GitHub の variable へ同期される）
5. `/edit` の「Uptime Kuma」セクションで表示/非表示を保存する

未設定の場合はエラーにならず、Uptime Kuma のセクションは何も表示されません。

### 共通

- **ログイン方式**: Supabase Auth 経由の Google ログイン。`ALLOWED_GOOGLE_EMAILS` に設定したメールアドレスのGoogleアカウントのみアクセスできる
- **ログイン時**: Signaly へ通知

ローカル開発時は `npm run dev` のあと `http://localhost:3000/edit` または `http://localhost:3000/admin` にアクセスしてください。

## 📄 ライセンス

[MIT License](LICENSE)

## CI/CD の既知の課題

> 2026-06-29 時点で確認された課題です。対応が完了したら削除または更新してください。

| 優先度 | 課題 | 対象ファイル |
|--------|------|-------------|
| 中 | **`release` ジョブがデプロイ完了を待たない** — 現状は `needs: tag` のみのため、デプロイ失敗時でも GitHub Release が作られてしまう。`needs: [tag, deploy]` に修正する（`car` / `myroom` の実装に合わせる） | `.github/workflows/deploy.yml` |
