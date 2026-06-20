# 1Password secret references (safe to commit)
# Local: op run --env-file=.env.tpl -- npm run dev
# CI: loaded automatically via 1password/load-secrets-action
#
# 1Password の apps ボールトに各アイテムを作成し、以下のフィールドを登録してください。
# vault / item 名は環境に合わせて変更可能です。

UPTIMEROBOT_READ_ONLY_KEY=op://apps/portfolio/NEXT_PUBLIC_UPTIMEROBOT_READ_ONLY_KEY
ADMIN_PASSWORD=op://apps/portfolio/ADMIN_PASSWORD
SESSION_SECRET=op://apps/portfolio/SESSION_SECRET
DISCORD_WEBHOOK_URL=op://apps/portfolio/DISCORD_WEBHOOK_URL
SSH_HOST=op://apps/Server/host
SSH_USERNAME=op://apps/Server/username
SSH_PORT=op://apps/Server/ssh-port
DEPLOY_PATH=op://apps/portfolio/DEPLOY_PATH
SSH_PRIVATE_KEY=op://apps/githubaction-sshkey/PRIVATE_KEY
DISCORD_CI_WEBHOOK_URL=op://apps/discord_webhook/CI_URL
