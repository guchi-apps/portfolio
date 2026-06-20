import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function stripLeadingV(tag) {
    return tag.startsWith("v") ? tag.slice(1) : tag;
}

function readPackageVersion() {
    const packageJson = JSON.parse(
        readFileSync(join(root, "package.json"), "utf8"),
    );
    return packageJson.version;
}

function runGit(command) {
    try {
        return execSync(command, {
            cwd: root,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
        }).trim();
    } catch {
        return null;
    }
}

function isGitRepository() {
    return runGit("git rev-parse --is-inside-work-tree") === "true";
}

function resolveFromGit() {
    const exactTag = runGit("git describe --tags --exact-match HEAD");
    if (exactTag) {
        return stripLeadingV(exactTag);
    }

    const described = runGit("git describe --tags --always");
    if (described) {
        return stripLeadingV(described);
    }

    return null;
}

const version = isGitRepository() ? resolveFromGit() : null;
process.stdout.write(version ?? readPackageVersion());
