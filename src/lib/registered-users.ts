import { execFile } from "node:child_process"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)

const DEFAULT_APP_IDS = [
    "asset-manager",
    "car-care",
    "meisai-lab",
    "clip-hive",
    "subscription-lists",
] as const

export type RegisteredUser = {
    id: string
    name: string | null
    email: string | null
    googleLinked: boolean
}

export type RegisteredUserAppResult = {
    id: string
    label: string
    users: RegisteredUser[]
    error?: string
}

type AppConfig = {
    id: string
    label: string
    databaseUrl: string
}

function toEnvKey(appId: string): string {
    return appId.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase()
}

function getConfiguredAppIds(): string[] {
    const configured = process.env.REGISTERED_USERS_APP_IDS
        ?.split(",")
        .map((value) => value.trim())
        .filter(Boolean)

    return configured && configured.length > 0 ? configured : [...DEFAULT_APP_IDS]
}

function getAppConfigs(): AppConfig[] {
    return getConfiguredAppIds().map((id) => {
        const envKey = toEnvKey(id)
        const databaseUrl = process.env[`REGISTERED_USERS_${envKey}_DATABASE_URL`]
        const label = process.env[`REGISTERED_USERS_${envKey}_LABEL`] || id

        if (!databaseUrl) {
            throw new Error(`${id}: database URL is not configured`)
        }

        return { id, label, databaseUrl }
    })
}

function parseDatabaseUrl(databaseUrl: string) {
    const url = new URL(databaseUrl)

    if (url.protocol !== "mysql:") {
        throw new Error("Only mysql:// database URLs are supported")
    }

    const database = url.pathname.replace(/^\//, "")
    if (!database) {
        throw new Error("Database name is missing")
    }

    return {
        host: url.hostname,
        port: url.port || "3306",
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: decodeURIComponent(database),
    }
}

async function fetchUsers(config: AppConfig): Promise<RegisteredUser[]> {
    const connection = parseDatabaseUrl(config.databaseUrl)
    const sql = `
        SELECT JSON_OBJECT(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'googleLinked', EXISTS (
                SELECT 1
                FROM Account a
                WHERE a.userId = u.id AND a.provider = 'google'
            )
        )
        FROM User u
        ORDER BY u.email IS NULL, u.email, u.name, u.id;
    `

    const { stdout } = await execFileAsync(
        "mysql",
        [
            "--batch",
            "--raw",
            "--skip-column-names",
            "--connect-timeout=5",
            `--host=${connection.host}`,
            `--port=${connection.port}`,
            `--user=${connection.user}`,
            connection.database,
            "--execute",
            sql,
        ],
        {
            env: {
                ...process.env,
                MYSQL_PWD: connection.password,
            },
            timeout: 10_000,
            maxBuffer: 1024 * 1024,
        },
    )

    return stdout
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const value = JSON.parse(line) as {
                id: string
                name: string | null
                email: string | null
                googleLinked: boolean | number
            }

            return {
                ...value,
                googleLinked: Boolean(value.googleLinked),
            }
        })
}

export async function getRegisteredUsers(): Promise<RegisteredUserAppResult[]> {
    let configs: AppConfig[]

    try {
        configs = getAppConfigs()
    } catch (error) {
        return [
            {
                id: "configuration",
                label: "設定",
                users: [],
                error: error instanceof Error ? error.message : "Invalid configuration",
            },
        ]
    }

    return Promise.all(
        configs.map(async (config) => {
            try {
                return {
                    id: config.id,
                    label: config.label,
                    users: await fetchUsers(config),
                }
            } catch (error) {
                console.error(`Failed to fetch registered users for ${config.id}`, error)
                return {
                    id: config.id,
                    label: config.label,
                    users: [],
                    error: "ユーザー情報を取得できませんでした",
                }
            }
        }),
    )
}
