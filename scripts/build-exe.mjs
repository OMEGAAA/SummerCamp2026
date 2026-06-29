import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(".");
const releaseDir = resolve(root, "release");
const tempOutput = mkdtempSync(join(tmpdir(), "agk-summer-exe-"));
const builderCli = resolve(root, "node_modules/electron-builder/out/cli/cli.js");

try {
  const result = spawnSync(
    process.execPath,
    [
      builderCli,
      "--win",
      "portable",
      "--x64",
      `--config.directories.output=${tempOutput}`,
    ],
    {
      cwd: root,
      env: {
        ...process.env,
        CSC_IDENTITY_AUTO_DISCOVERY: "false",
      },
      stdio: "inherit",
    },
  );

  if (result.status !== 0) {
    process.exitCode = result.status || 1;
  } else {
    const artifacts = readdirSync(tempOutput)
      .filter((name) => name.toLowerCase().endsWith(".exe"));

    if (artifacts.length !== 1) {
      throw new Error(`ポータブルEXEは1件である必要があります（検出: ${artifacts.length}件）`);
    }

    mkdirSync(releaseDir, { recursive: true });
    for (const name of readdirSync(releaseDir)) {
      if (name.toLowerCase().endsWith(".exe")) {
        rmSync(resolve(releaseDir, name), { force: true });
      }
    }

    const source = resolve(tempOutput, artifacts[0]);
    const destination = resolve(releaseDir, basename(source));
    copyFileSync(source, destination);
    console.log(`portable exe written: ${destination}`);
  }
} finally {
  if (existsSync(tempOutput)) {
    rmSync(tempOutput, { recursive: true, force: true });
  }
}
