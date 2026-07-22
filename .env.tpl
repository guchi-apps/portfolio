# 1Password secret references (safe to commit)
# Local: op run --env-file=.env.tpl -- npm run dev
# CI: loaded automatically via 1password/load-secrets-action
#
# 1Password の apps ボールトに portfolio アイテムを作成し、以下のフィールドを登録してください。
# vault / item 名は環境に合わせて変更可能です。

UPTIMEROBOT_READ_ONLY_KEY=op://apps/portfolio/next-public-uptimerobot-read-only-key
UPTIMEKUMA_BASE_URL=op://apps/portfolio/uptimekuma-base-url
UPTIMEKUMA_PORTFOLIO_SLUG=op://apps/portfolio/uptimekuma-portfolio-slug
UPTIMEKUMA_DASHBOARD_SLUG=op://apps/portfolio/uptimekuma-dashboard-slug
ADMIN_PASSWORD=op://apps/portfolio/admin-password
SESSION_SECRET=op://apps/portfolio/session-secret

# 管理画面に表示するNextAuthアプリ
# DB接続情報はすべて portfolio アイテム内の個別フィールドとしてまとめて管理する。
# 新しいアプリを追加する場合はIDを追加し、portfolioアイテムに対応するフィールドを追加する。
REGISTERED_USERS_APP_IDS=asset-manager,car-care,meisai-lab,clip-hive,subscription-lists
REGISTERED_USERS_ASSET_MANAGER_DATABASE_URL=op://apps/portfolio/registered-users-asset-manager-database-url
REGISTERED_USERS_CAR_CARE_DATABASE_URL=op://apps/portfolio/registered-users-car-care-database-url
REGISTERED_USERS_MEISAI_LAB_DATABASE_URL=op://apps/portfolio/registered-users-meisai-lab-database-url
REGISTERED_USERS_CLIP_HIVE_DATABASE_URL=op://apps/portfolio/registered-users-clip-hive-database-url
REGISTERED_USERS_SUBSCRIPTION_LISTS_DATABASE_URL=op://apps/portfolio/registered-users-subscription-lists-database-url

# 表示名は秘密情報ではないため、必要な場合のみここで指定する。
REGISTERED_USERS_ASSET_MANAGER_LABEL=asset-manager
REGISTERED_USERS_CAR_CARE_LABEL=car-care
REGISTERED_USERS_MEISAI_LAB_LABEL=meisai-lab
REGISTERED_USERS_CLIP_HIVE_LABEL=clip-hive
REGISTERED_USERS_SUBSCRIPTION_LISTS_LABEL=subscription-lists

SSH_HOST=op://apps/Server/host
SSH_USERNAME=op://apps/Server/username
SSH_PORT=op://apps/Server/ssh-port
DEPLOY_PATH=op://apps/portfolio/deploy-path
SSH_PRIVATE_KEY=op://apps/githubaction-sshkey/private_key
SIGNALY_WEBHOOK_URL=op://apps/portfolio/ci-webhook-url
SIGNALY_LOGIN_WEBHOOK_URL=op://apps/portfolio/login-webhook-url
