import { execFile } from "node:child_process"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)

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
    database: string
}

type DatabaseConnection = {
    host: string
    port: string
    user: string
    password: string
}

function getRequiredEnv(name: string): string {
    const value = process.env[name]?.trim()
    if (!value) {
        throw new Error(`${name} is not configured`)
    }
    return value
}

function getDatabaseConnection(): DatabaseConnection {
    return {
        host: getRequiredEnv("REGISTERED_USERS_DB_HOST"),
        port: getRequiredEnv("REGISTERED_USERS_DB_PORT"),
        user: getRequiredEnv("REGISTERED_USERS_DB_USER"),
        password: getRequiredEnv("REGISTERED_USERS_DB_PASSWORD"),
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getAppConfigs(): AppConfig[] {
    const rawConfig = getRequiredEnv("REGISTERED_USERS_CONFIG")
    let parsed: unknown

    try {
        parsed = JSON.parse(rawConfig)
    } catch {
        throw new Error("REGISTERED_USERS_CONFIG must be valid JSON")
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("REGISTERED_USERS_CONFIG must be a non-empty array")
    }

    const ids = new Set<string>()

    return parsed.map((value, index) => {
        if (!isRecord(value)) {
            throw new Error(`REGISTERED_USERS_CONFIG[${index}] must be an object`)
        }

        const id = typeof value.id === "string" ? value.id.trim() : ""
        const database = typeof value.database === "string" ? value.database.trim() : ""
        const label = typeof value.label === "string" && value.label.trim() ? value.label.trim() : id

        if (!id) {
            throw new Error(`REGISTERED_USERS_CONFIG[${index}].id is required`)
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
            throw new Error(`${id}: id contains unsupported characters`)
        }
        if (!database) {
            throw new Error(`${id}: database is required`)
        }
        if (!/^[a-zA-Z0-9_$]+$/.test(database)) {
            throw new Error(`${id}: database contains unsupported characters`)
        }
        if (ids.has(id)) {
            throw new Error(`${id}: duplicate app id`)
        }

        ids.add(id)
        return { id, label, database }
    })
}

async function fetchUsers(
    config: AppConfig,
    connection: DatabaseConnection,
): Promise<RegisteredUser[]> {
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
            config.database,
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
    let connection: DatabaseConnection

    try {
        configs = getAppConfigs()
        connection = getDatabaseConnection()
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
                    users: await fetchUsers(config, connection),
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
