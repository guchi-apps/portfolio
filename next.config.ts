import type { NextConfig } from "next";
import { execSync } from "child_process";

function resolveAppVersion(): string {
    if (process.env.NEXT_PUBLIC_APP_VERSION) {
        return process.env.NEXT_PUBLIC_APP_VERSION;
    }

    try {
        return execSync("node scripts/resolve-version.mjs", {
            cwd: __dirname,
            encoding: "utf8",
        }).trim();
    } catch {
        return "dev";
    }
}

const devAllowedOrigins =
    process.env.DEV_ALLOWED_ORIGINS?.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean) ?? [];

const nextConfig: NextConfig = {
    output: "standalone",
    images: {
        unoptimized: true,
    },
    env: {
        NEXT_PUBLIC_APP_VERSION: resolveAppVersion(),
    },
    allowedDevOrigins: devAllowedOrigins,
};

export default nextConfig;
