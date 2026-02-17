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

### 環境変数の設定

プロジェクトのルートに `.env.local` ファイルを作成し、以下の環境変数を設定してください。
UptimeRobotのAPIキーは、サーバーの稼働状況を表示するために必要です。設定しない場合、ステータス表示はスキップされます。

```env
# UptimeRobot API Key (Single Monitor or All Monitors)
UPTIMEROBOT_API_KEY=your_uptimerobot_api_key

# または、複数のモニターキーを指定する場合
UPTIMEROBOT_MK_PORTFOLIO=monitor_specific_key_portfolio
UPTIMEROBOT_MK_BLOG=monitor_specific_key_blog
UPTIMEROBOT_MK_ASSET=monitor_specific_key_asset
```

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

## 📦 デプロイとGitHub Secrets

このプロジェクトは GitHub Actions による自動デプロイに対応しています。
`main` ブランチへのプッシュをトリガーとしてビルドとデプロイが行われます。

自動デプロイを有効にするには、リポジトリの **Settings > Secrets and variables > Actions** に以下の変数を設定してください。

### 必須のSecrets

| Secret Name | 説明 |
| :--- | :--- |
| `SSH_HOST` | デプロイ先サーバーのホスト名またはIPアドレス |
| `SSH_USERNAME` | SSH接続に使用するユーザー名 |
| `SSH_PORT` | SSH接続に使用するポート番号 (例: `22`) |
| `SSH_PRIVATE_KEY` | SSH秘密鍵の内容 (改行コードを含めてコピー) |
| `DEPLOY_PATH` | 公開ディレクトリのフルパス (例: `/var/www/html/portfolio`) |
| `UPTIMEROBOT_MK_PORTFOLIO` | ポートフォリオサイト監視用のUptimeRobot APIキー |
| `UPTIMEROBOT_MK_BLOG` | ブログ監視用のUptimeRobot APIキー |
| `UPTIMEROBOT_MK_ASSET` | 資産管理アプリ監視用のUptimeRobot APIキー |

※ UptimeRobotのキーは `.github/workflows/deploy.yml` 内で使用されています。必要に応じてワークフローファイル内のキー名も変更してください。

## 📄 ライセンス

[MIT License](LICENSE)
