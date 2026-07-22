import { execFile } from "node:child_process"
import { promisify } from "node:util"
import {
    getRegisteredUsersDatabaseConnection,
    listRegisteredApps,
    type DatabaseConnection,
    type RegisteredApp,
} from "@/lib/registered-apps"

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

async function fetchUsers(app: RegisteredApp, connection: DatabaseConnection): Promise<RegisteredUser[]> {
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
            app.database,
            "--execute",
            sql,
        ],
        {
            env: { ...process.env, MYSQL_PWD: connection.password },
            timeout: 10_000,
            maxBuffer: 1024 * 1024,
        },
    )

    return stdout.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
        const value = JSON.parse(line) as {
            id: string
            name: string | null
            email: string | null
            googleLinked: boolean | number
        }
        return { ...value, googleLinked: Boolean(value.googleLinked) }
    })
}

export async function getRegisteredUsers(): Promise<RegisteredUserAppResult[]> {
    let apps: RegisteredApp[]
    let connection: DatabaseConnection

    try {
        apps = await listRegisteredApps(true)
        connection = getRegisteredUsersDatabaseConnection()
    } catch (error) {
        return [{
            id: "configuration",
            label: "設定",
            users: [],
            error: error instanceof Error ? error.message : "Invalid configuration",
        }]
    }

    return Promise.all(apps.map(async (app) => {
        try {
            return { id: app.id, label: app.label, users: await fetchUsers(app, connection) }
        } catch (error) {
            console.error(`Failed to fetch registered users for ${app.id}`, error)
            return { id: app.id, label: app.label, users: [], error: "ユーザー情報を取得できませんでした" }
        }
    }))
}
