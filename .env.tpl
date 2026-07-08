# 1Password secret references (safe to commit)
# Local: op run --env-file=.env.tpl -- npm run dev
# CI: loaded automatically via 1password/load-secrets-action
#
# 1Password の apps ボールトに各アイテムを作成し、以下のフィールドを登録してください。
# vault / item 名は環境に合わせて変更可能です。

UPTIMEROBOT_READ_ONLY_KEY=op://apps/portfolio/next-public-uptimerobot-read-only-key
UPTIMEKUMA_BASE_URL=op://apps/portfolio/uptimekuma-base-url
UPTIMEKUMA_STATUS_SLUG=op://apps/portfolio/uptimekuma-status-slug
ADMIN_PASSWORD=op://apps/portfolio/admin-password
SESSION_SECRET=op://apps/portfolio/session-secret
SSH_HOST=op://apps/Server/host
SSH_USERNAME=op://apps/Server/username
SSH_PORT=op://apps/Server/ssh-port
DEPLOY_PATH=op://apps/portfolio/deploy-path
SSH_PRIVATE_KEY=op://apps/githubaction-sshkey/private_key
SIGNALY_WEBHOOK_URL=op://apps/portfolio/ci-webhook-url
SIGNALY_LOGIN_WEBHOOK_URL=op://apps/portfolio/login-webhook-url
