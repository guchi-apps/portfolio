# portfolio の撤去手順

**このアプリは廃止する。** 本書は停止・撤去の順序と実機コマンドの正本。起点は #200。
共通の順序と落とし穴は guchi-apps/issue-deck の `docs/app-shutdown.md` を参照する。

リポジトリはアーカイブして残すため、アーカイブ後もこの文書は読める。途中で中断したときは、
下の「完了の確認」でどこまで進んだかを判定できる。

## なぜ削除してよいと判断したか（2026-10-17時点の調査）

#172 でポートフォリオ本体（トップ・編集画面）を廃止しており、最後まで残っていた役割は
全アプリ共通の法的ページ（`/privacy-policy`・`/terms-of-service`）の配信だけだった。

| 依存元 | 実態 | 削除の影響 |
|---|---|---|
| 各アプリのログイン（Google OAuth 同意画面など）・IssueDeck の GitHub App | 法的ページの URL が登録されうる（リポジトリ外の設定のため未確認） | なし。guchi-apps/vps#296 で Apache の静的ファイルへ移管し、URL は不変 |
| `guchi-apps/vps` の `gucchii.com` vhost | `ProxyPass / http://127.0.0.1:3105/` で全パスをこのアプリへ転送していた | なし。vps#296 で転送を外し、法的ページ以外は Apache の404 |
| `/healthz`・`/internal/*`・phpMyAdmin | Apache が直接応答・別の宛先へ転送しており、このアプリを経由しない | なし |
| 他アプリのコード（guchi-apps の公開・非公開リポジトリを横断検索） | このアプリの API・ホスト名を呼ぶコードは無い。`aide`・`status-hub`・`yoteiflow` の言及は廃止済み機能のコメント・テストデータだけ | なし |
| stockly・work-relay の Supabase Site URL（`https://gucchii.com`） | 認証のリダイレクトが一致しないときのフォールバック先。廃止前から `/` は404 | 変化なし（今も404） |

## このアプリ固有の事情

- **DB を持たない。** DB のダンプ・削除は不要
- **独立した Apache vhost・証明書・DNS を持たない。** `gucchii.com` のルートを使っていたため、
  vhost・証明書・A レコードは vps 側で引き続き使う（`certbot delete`・DNS 削除はしない）
- **pm2 のプロセス名は `portfolio`、ポートは 3105。** 3105 は vps の README で空きへ戻した
- **シークレットは `DEPLOY_PATH` だけ**（`SSH_*`・`SIGNALY_WEBHOOK_URL` は organization の共通値）。
  1Password は `op://apps/portfolio/deploy-path`。`guchi-apps/docs` の `inventory/1password-apps.md`
  には「issue-deck も使用」とあり、issue-deck の `docs/multi-agent/generic-launcher.md` に例として
  載っているため、アイテムを消す前に issue-deck 側の参照が例示だけであることを確かめる

## 撤去の順序

1. 法的ページの移管（guchi-apps/vps#296）— **済**
2. VPS 上の pm2 から外す（`pm2 delete portfolio && pm2 save`）— **済**
3. デプロイ先ディレクトリを消す（下記）と同時に、本番デプロイの起動トリガーを外す（#200 の PR）
4. GitHub Secret `DEPLOY_PATH` の削除、1Password `apps/portfolio` のアーカイブ
5. 台帳の更新（issue-deck・`guchi-apps/docs`。リポジトリごとに Issue を分ける）
6. #197・#185 を閉じ、リポジトリをアーカイブする（**最後**）。issue-deck の画面で「リポジトリを再同期」を押す

### デプロイ先ディレクトリの削除（VPS・`github-user`。sudo 不要）

`<DEPLOY_PATH>` は GitHub Secret `DEPLOY_PATH` の値に読み替える。消す前に、portfolio の
standalone 出力（`server.js`・`ecosystem.config.js`）であることを確かめる。

```bash
ls "<DEPLOY_PATH>"/server.js "<DEPLOY_PATH>"/ecosystem.config.js && rm -rf "<DEPLOY_PATH>"
```

### シークレットの後片付け

```bash
gh secret delete DEPLOY_PATH --repo guchi-apps/portfolio
op item delete portfolio --vault apps --archive
```

## 完了の確認

```bash
# 本番デプロイに起動できるトリガーが無いこと（`workflow_call:` だけが出れば完了）
sed -n '/^on:/,/^$/p' .github/workflows/deploy.yml

# 法的ページが Apache から返ること（200・200・404）
for p in privacy-policy terms-of-service ""; do curl -sS -o /dev/null -w "/$p %{http_code}\n" "https://gucchii.com/$p"; done

# PM2 に残っていないこと（VPS上で実行）
pm2 describe portfolio >/dev/null 2>&1 && echo "まだ残っている" || echo "ok"

# 3105 番で何も待ち受けていないこと（VPS上で実行。何も出なければ完了）
ss -ltn 'sport = :3105' | tail -n +2
```
