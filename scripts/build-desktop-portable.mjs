import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const electronExe = require("electron");
const runtimeDir = path.dirname(electronExe);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(rootDir, "release", "PetFit-Buding-win-portable");
const appDir = path.join(outDir, "resources", "app");

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.dirname(outDir), { recursive: true });
fs.cpSync(runtimeDir, outDir, { recursive: true });

fs.rmSync(path.join(outDir, "resources", "default_app.asar"), { force: true });
fs.mkdirSync(appDir, { recursive: true });
fs.cpSync(path.join(rootDir, "dist"), path.join(appDir, "dist"), { recursive: true });
fs.cpSync(path.join(rootDir, "electron"), path.join(appDir, "electron"), { recursive: true });
fs.writeFileSync(
  path.join(appDir, "package.json"),
  JSON.stringify(
    {
      name: "petfit-buding",
      version: "0.0.0",
      main: "electron/main.cjs",
      type: "module",
    },
    null,
    2,
  ),
);

fs.copyFileSync(path.join(outDir, "electron.exe"), path.join(outDir, "PetFit Buding.exe"));
console.log(`Desktop portable app written to ${outDir}`);
