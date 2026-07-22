# 1Password secret references (safe to commit)
# Local: op run --env-file=.env.tpl -- npm run dev
# CI: loaded automatically via 1password/load-secrets-action
#
# 1Password の apps ボールトに portfolio / DB アイテムを作成し、以下のフィールドを登録してください。
# vault / item 名は環境に合わせて変更可能です。

UPTIMEROBOT_READ_ONLY_KEY=op://apps/portfolio/next-public-uptimerobot-read-only-key
UPTIMEKUMA_BASE_URL=op://apps/portfolio/uptimekuma-base-url
UPTIMEKUMA_PORTFOLIO_SLUG=op://apps/portfolio/uptimekuma-portfolio-slug
UPTIMEKUMA_DASHBOARD_SLUG=op://apps/portfolio/uptimekuma-dashboard-slug
ADMIN_PASSWORD=op://apps/portfolio/admin-password
SESSION_SECRET=op://apps/portfolio/session-secret

# 各アプリのUser / Account参照用（SELECT専用）
REGISTERED_USERS_DB_HOST=op://apps/DB/db-host
REGISTERED_USERS_DB_PORT=op://apps/DB/db-port
REGISTERED_USERS_DB_USER=op://apps/DB/read-user
REGISTERED_USERS_DB_PASSWORD=op://apps/DB/read-password

# app_portfolio.RegisteredAppの参照・追加・編集・削除用
REGISTERED_USERS_SETTINGS_DB_USER=op://apps/DB/db-user
REGISTERED_USERS_SETTINGS_DB_PASSWORD=op://apps/DB/db-password
REGISTERED_USERS_SETTINGS_DATABASE=op://apps/portfolio/registered-users-settings-database

# app_portfolio.RegisteredAppの初回作成・将来のスキーマ変更用
REGISTERED_USERS_MIGRATE_DB_USER=op://apps/DB/migrate-user
REGISTERED_USERS_MIGRATE_DB_PASSWORD=op://apps/DB/migrate-password

SSH_HOST=op://apps/Server/host
SSH_USERNAME=op://apps/Server/username
SSH_PORT=op://apps/Server/ssh-port
DEPLOY_PATH=op://apps/portfolio/deploy-path
SSH_PRIVATE_KEY=op://apps/githubaction-sshkey/private_key
SIGNALY_WEBHOOK_URL=op://apps/portfolio/ci-webhook-url
SIGNALY_LOGIN_WEBHOOK_URL=op://apps/portfolio/login-webhook-url
