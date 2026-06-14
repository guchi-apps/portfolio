import type { NextConfig } from "next";
import { readFileSync } from "fs";
import { join } from "path";

const packageJson = JSON.parse(
    readFileSync(join(__dirname, "package.json"), "utf8")
) as { version: string };

const nextConfig: NextConfig = {
    output: "standalone",
    images: {
        unoptimized: true,
    },
    env: {
        NEXT_PUBLIC_APP_VERSION: packageJson.version,
    },
};

export default nextConfig;
