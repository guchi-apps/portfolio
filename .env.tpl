# 1Password secret references (safe to commit)
# Local: op run --env-file=.env.tpl -- npm run dev
# CI: loaded automatically via 1password/load-secrets-action
#
# 1Password の apps ボールトに各アイテムを作成し、以下のフィールドを登録してください。
# vault / item 名は環境に合わせて変更可能です。

NEXT_PUBLIC_UPTIMEROBOT_READ_ONLY_KEY=op://apps/portfolio/NEXT_PUBLIC_UPTIMEROBOT_READ_ONLY_KEY
SSH_HOST=op://apps/Server/host
SSH_USERNAME=op://apps/Server/username
SSH_PORT=op://apps/Server/ssh-port
DEPLOY_PATH=op://apps/portfolio/DEPLOY_PATH
