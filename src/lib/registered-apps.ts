import { execFile } from "node:child_process"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)

export type RegisteredApp = {
    id: string
    label: string
    database: string
    enabled: boolean
    sortOrder: number
}

export type DatabaseConnection = {
    host: string
    port: string
    user: string
    password: string
}

function getRequiredEnv(name: string): string {
    const value = process.env[name]?.trim()
    if (!value) throw new Error(`${name} is not configured`)
    return value
}

function getConnection(userEnv: string, passwordEnv: string): DatabaseConnection {
    return {
        host: getRequiredEnv("REGISTERED_USERS_DB_HOST"),
        port: getRequiredEnv("REGISTERED_USERS_DB_PORT"),
        user: getRequiredEnv(userEnv),
        password: getRequiredEnv(passwordEnv),
    }
}

export function getRegisteredUsersDatabaseConnection(): DatabaseConnection {
    return getConnection("REGISTERED_USERS_DB_USER", "REGISTERED_USERS_DB_PASSWORD")
}

function getSettingsDatabaseConnection(): DatabaseConnection {
    return getConnection("REGISTERED_USERS_SETTINGS_DB_USER", "REGISTERED_USERS_SETTINGS_DB_PASSWORD")
}

function getMigrateDatabaseConnection(): DatabaseConnection {
    return getConnection("REGISTERED_USERS_MIGRATE_DB_USER", "REGISTERED_USERS_MIGRATE_DB_PASSWORD")
}

function getSettingsDatabase(): string {
    const database = getRequiredEnv("REGISTERED_USERS_SETTINGS_DATABASE")
    if (!/^[a-zA-Z0-9_$-]+$/.test(database)) {
        throw new Error("REGISTERED_USERS_SETTINGS_DATABASE is invalid")
    }
    return database
}

function escapeSql(value: string): string {
    return value.replace(/\\/g, "\\\\").replace(/'/g, "''")
}

async function executeSql(
    connection: DatabaseConnection,
    database: string,
    sql: string,
): Promise<string> {
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
            database,
            "--execute",
            sql,
        ],
        {
            env: { ...process.env, MYSQL_PWD: connection.password },
            timeout: 10_000,
            maxBuffer: 1024 * 1024,
        },
    )
    return stdout
}

let settingsInitialized = false

async function ensureSettingsTable(): Promise<void> {
    if (settingsInitialized) return

    await executeSql(getMigrateDatabaseConnection(), getSettingsDatabase(), `
        CREATE TABLE IF NOT EXISTS RegisteredApp (
            app_id VARCHAR(100) NOT NULL PRIMARY KEY,
            display_name VARCHAR(150) NOT NULL,
            database_name VARCHAR(150) NOT NULL,
            enabled BOOLEAN NOT NULL DEFAULT TRUE,
            sort_order INT NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        INSERT IGNORE INTO RegisteredApp (app_id, display_name, database_name, enabled, sort_order) VALUES
            ('asset-manager', 'Asset Manager', 'AssetManager', TRUE, 10),
            ('car-care', 'Car Care', 'Car', TRUE, 20),
            ('meisai-lab', 'Meisai Lab', 'meisai-lab', TRUE, 30),
            ('clip-hive', 'Clip Hive', 'clip-hive', TRUE, 40),
            ('subscription-lists', 'Subscription Lists', 'subscribe-lists', TRUE, 50);
    `)

    settingsInitialized = true
}

async function executeSettingsSql(sql: string): Promise<string> {
    await ensureSettingsTable()
    return executeSql(getSettingsDatabaseConnection(), getSettingsDatabase(), sql)
}

function validateApp(input: RegisteredApp): RegisteredApp {
    const id = input.id.trim()
    const label = input.label.trim() || id
    const database = input.database.trim()
    const sortOrder = Number.isFinite(input.sortOrder) ? Math.trunc(input.sortOrder) : 0

    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) throw new Error("アプリIDが不正です")
    if (!database || !/^[a-zA-Z0-9_$-]+$/.test(database)) throw new Error("データベース名が不正です")

    return { id, label, database, enabled: Boolean(input.enabled), sortOrder }
}

export async function listRegisteredApps(enabledOnly = false): Promise<RegisteredApp[]> {
    const where = enabledOnly ? "WHERE enabled = 1" : ""
    const stdout = await executeSettingsSql(`
        SELECT JSON_OBJECT(
            'id', app_id,
            'label', display_name,
            'database', database_name,
            'enabled', enabled,
            'sortOrder', sort_order
        )
        FROM RegisteredApp
        ${where}
        ORDER BY sort_order, app_id;
    `)

    return stdout.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
        const value = JSON.parse(line) as RegisteredApp & { enabled: boolean | number }
        return { ...value, enabled: Boolean(value.enabled), sortOrder: Number(value.sortOrder) }
    })
}

export async function createRegisteredApp(input: RegisteredApp): Promise<void> {
    const app = validateApp(input)
    await executeSettingsSql(`
        INSERT INTO RegisteredApp (app_id, display_name, database_name, enabled, sort_order)
        VALUES ('${escapeSql(app.id)}', '${escapeSql(app.label)}', '${escapeSql(app.database)}', ${app.enabled ? 1 : 0}, ${app.sortOrder});
    `)
}

export async function updateRegisteredApp(originalId: string, input: RegisteredApp): Promise<void> {
    const app = validateApp(input)
    await executeSettingsSql(`
        UPDATE RegisteredApp
        SET app_id = '${escapeSql(app.id)}',
            display_name = '${escapeSql(app.label)}',
            database_name = '${escapeSql(app.database)}',
            enabled = ${app.enabled ? 1 : 0},
            sort_order = ${app.sortOrder}
        WHERE app_id = '${escapeSql(originalId)}';
    `)
}

export async function deleteRegisteredApp(id: string): Promise<void> {
    await executeSettingsSql(`DELETE FROM RegisteredApp WHERE app_id = '${escapeSql(id)}';`)
}
