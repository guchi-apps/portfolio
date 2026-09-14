# gucchii.com

`gucchii.com` で公開している Next.js アプリのリポジトリです。

以前はポートフォリオサイト（トップページ・編集画面 `/edit`）でしたが、参照されていなかったため #172 で廃止しました。現在は、全アプリ（Gucchii Apps）共通の法的ページだけを配信しています。

| パス | 内容 |
| :--- | :--- |
| `/privacy-policy` | プライバシーポリシー |
| `/terms-of-service` | 利用規約 |
| `/`（それ以外のパスも含む） | 404 |

法的ページは各アプリのログイン（Google OAuth 同意画面など）から参照されうるため、URL を変えないでください。

VPS の管理ダッシュボードは [ops-dashboard](https://admin.gucchii.com)（`guchi-apps/ops-dashboard`）にあります。

`gucchii.com` 配下のうち `/healthz`・`/internal/*`・`/shopping-list/`・phpMyAdmin は、Apache（`guchi-apps/vps` の `apache/sites-available/gucchii-le-ssl.conf`）が別の宛先へ振り分けており、このアプリには届きません。

## 🛠 技術スタック

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)

## 🚀 セットアップ

```bash
git clone https://github.com/guchi-apps/portfolio.git
cd portfolio
npm install
npm run dev
```

ローカルの開発サーバーでは `/privacy-policy` と `/terms-of-service` を確認できます（ポートは `scripts/dev.sh` と `.env.local` の設定に従います）。

### 検証

```bash
npm run lint
npm run build   # 型チェックを含む
```

`main` / `develop` 向けの Pull Request では、GitHub Actions が同じ2つを実行します。

## 🔐 デプロイ用の値

**実行時（GitHub Actions）は 1Password を呼びません。** 値は GitHub の secret / variable から読み、1Password は「人が管理する唯一の正」として残します（guchi-apps/issue-deck#1302 / #1307）。どの値を GitHub のどこから取るかは [`.github/secrets-manifest.tsv`](.github/secrets-manifest.tsv) が正です。

**値を変更したときだけ** `scripts/sync-github-secrets.sh`（または `sync-secrets.yml` の workflow_dispatch）で GitHub へ同期します。

現在のアプリはシークレットを読みません。デプロイに使うのはサーバーへの接続情報（`SSH_*`・`DEPLOY_PATH`）と通知先（`SIGNALY_WEBHOOK_URL`）だけです（#173 で廃止したページ用の値を外しました）。

## 📦 デプロイ

**Next.js standalone** モードでビルドし、サーバー上で pm2（プロセス名 `portfolio`、ポート 3105）として稼働します。ブラウザから見えるのは Apache のリバースプロキシ経由の応答だけにし、`DEPLOY_PATH` 内のファイルを直接公開しないでください。

`main` へのマージで、`deploy.yml` が Git タグ作成 → ビルド・デプロイ → GitHub Release 作成を自動で行います。`package.json` のバージョンと同名のタグが別コミットに既に存在すると tag ジョブが止まるため、リリース前にバージョンを上げてください。

デプロイ後のヘルスチェックは `http://127.0.0.1:3105/privacy-policy` に対して行います（トップは 404 を返すため）。

### デプロイ後の確認

- `https://gucchii.com/privacy-policy`・`https://gucchii.com/terms-of-service` → 表示される
- `https://gucchii.com/` → 404
- `https://gucchii.com/healthz` → 200（Apache が直接応答）
- phpMyAdmin の URL（サーバー管理のパス）→ ログイン画面

### Apache リバースプロキシ

設定は `guchi-apps/vps` の `apache/sites-available/gucchii*.conf` で管理しています（このリポジトリには雛形を置きません）。phpMyAdmin のパスは catch-all の `ProxyPass / http://127.0.0.1:3105/` より先に除外する必要があります（実際のパスは GitHub に載せない）。

`DEPLOY_PATH` をどうしても DocumentRoot 配下に置く場合は、少なくとも `Options -Indexes` を有効にしてください。デプロイ時に `deploy/.htaccess` が `DEPLOY_PATH` へコピーされ、ディレクトリ一覧と機密ファイルへの直接アクセスを拒否します。

## 🌿 ブランチ運用

| ブランチ | 用途 |
| :--- | :--- |
| `develop` | 日常の開発ブランチ（デフォルトブランチ） |
| `main` | 本番ブランチ（`develop` からの PR でのみ更新） |

## 📄 ライセンス

[MIT License](LICENSE)
