# Implementation Plan: デプロイ不要な監視モニター管理の実現に向けて

現在の構成では、Next.jsを「Static Export（静的HTML）」としてビルドしているため、ビルド時にデータが固定化されてしまい、新しいデータを反映するには必ず再デプロイ（ビルド）が必要になります。

「デプロイ不要」かつ「簡単に登録・修正」を実現するための最適なアプローチとして、外部にDBを新しく用意するのではなく、**「UptimeRobot自体をDBとして扱い、フロントエンドから直接（クライアントサイド）最新データを取得する」** 方法を提案します。

## おすすめの解決案：Read-Only API Key ＋ Client-side Fetch

個別のモニターごとのAPIキー（`UPTIMEROBOT_MK_XXX`）ではなく、アカウント全体を読み取れる **Read-Only API Key（1つだけ）** を使用します。
さらに、Next.jsの画面表示時に直接UptimeRobotのAPI通信を行う（Client-side Fetch）ように変更します。

### メリット
1. **DBの構築が不要**：UptimeRobotのダッシュボードでモニターを追加・削除するだけで、サイトに自動反映されます。
2. **デプロイ設定の変更が不要**：APIキーは今後1つ（Read-Only）だけになるため、新しいアプリを作るたびにGitHub Secretsや `.env` を更新する必要がなくなります。
3. **リアルタイム性**：画面を開くたびに最新の情報を取りに行くので、デプロイなしで完全に情報が同期されます。

---

## Task List (必要な作業)

- [ ] 1. **UptimeRobot での Read-Only API Keyの発行** (ユーザー作業)
  - UptimeRobotの設定（My Settings）から「Read-Only API Key」を新たに発行し、値をコピーします。
- [ ] 2. **環境変数の整理と登録** (ユーザー作業)
  - `.env.local` の複数の `UPTIMEROBOT_MK_*` を消去し、代わりに `NEXT_PUBLIC_UPTIMEROBOT_READ_ONLY_KEY` として追加します。
  - 同様に、GitHub Secrets にも登録します。
  - ※ `NEXT_PUBLIC_` をつけることで、ブラウザから安全に（読み取り専用で）アクセスできるようになります。
- [ ] 3. **API取得ロジックの改修 (`src/lib/uptimerobot.ts`)**
  - Read-Only API Keyを使って、一括でアカウントの全モニターを取得するように書き直します。
- [ ] 4. **クライアントでの動的取得化 (`src/components/dynamic-stats.tsx` など)**
  - 現在ビルド時に処理（Server-side）しているものを、ページロード時に取得（Client-side / `useEffect` や `swr` など）するように変更します。

---

※「本当にDB（Supabase等）を使いたい」「バックエンド（Python等）を別で立てたい」という場合は、構成が少し複雑になりますが実装は可能です。

この**「Read-Onlyキーを使ったクライアント側での取得」**という方針で進めてもよろしいでしょうか？  
よろしければ、**「go」** とおっしゃってください（先に上記1, 2のキーの置換作業をお願いいたします）。
