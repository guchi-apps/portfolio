# 1Password secret references (safe to commit)
# Local: op run --env-file=.env.tpl -- npm run dev
# CI: loaded automatically via 1password/load-secrets-action
#
# 1Password に「portfolio-deploy」アイテムを作成し、以下のフィールドを登録してください。
# vault / item 名は環境に合わせて変更可能です。

NEXT_PUBLIC_UPTIMEROBOT_READ_ONLY_KEY=op://Portfolio/portfolio-deploy/NEXT_PUBLIC_UPTIMEROBOT_READ_ONLY_KEY
SSH_HOST=op://Portfolio/portfolio-deploy/SSH_HOST
SSH_USERNAME=op://Portfolio/portfolio-deploy/SSH_USERNAME
SSH_PORT=op://Portfolio/portfolio-deploy/SSH_PORT
DEPLOY_PATH=op://Portfolio/portfolio-deploy/DEPLOY_PATH
