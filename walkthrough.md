# Walkthrough: README.mdへの変更反映

## 修正内容
`README.md` を今回の実装（UptimeRobot APIクライアントサイド化）にあわせて最新化しました。

1. **環境変数の説明修正**
   変更前：
   ```env
   UPTIMEROBOT_API_KEY=xxx
   UPTIMEROBOT_MK_PORTFOLIO=xxx
   ...
   ```
   変更後：
   ```env
   NEXT_PUBLIC_UPTIMEROBOT_READ_ONLY_KEY=your_read_only_api_key_here
   ```
   というように、今後は複数のキーではなく1つの Read-Only キーのみを `.env.local` に記載する手順に更新しました。

2. **GitHub Secrets の説明修正**
   デプロイを機能させるための「必須のSecrets」の表の内容を更新しました。
   不要になったこれまでの `UPTIMEROBOT_MK_*` を削除し、新たに登録が必要な `NEXT_PUBLIC_UPTIMEROBOT_READ_ONLY_KEY` について追加しています。

## 検証
- Markdownの構文として正しく表示されること。
- 新しいアーキテクチャへの設定変更の導線が正しく示されていることを確認しました。
