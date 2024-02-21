/**
 * @file src/rs/utils.ts
 * @description rs 命令-工具函数
 * @since 1.2.0
 */

import fs from "node:fs";

import * as toml from "toml";

/**
 * @description 读取 cargo.toml 文件，返回所有依赖及其版本号
 * @function readCargoToml
 * @since 1.2.0
 * @returns {Promise<Record<string, string>>} 依赖及其版本号
 */
export async function readCargoToml(): Promise<Record<string, string> | false> {
  const path = process.cwd() + "\\Cargo.toml";
  if (!fs.existsSync(path)) return false;
  try {
    const content = fs.readFileSync(path, "utf-8");
    const res = toml.parse(content)?.dependencies;
    if (res === undefined) return false;
    for (const key in res) {
      if (typeof res[key] === "object") {
        res[key] = res[key].version;
      }
    }
    return res;
  } catch (error) {
    return false;
  }
}

interface CargoIoData {
  crate: {
    max_stable_version: string;
    max_version: string;
  };
}

/**
 * @description 获取指定包最新版本号
 * @function getLatestVersion
 * @since 1.2.0
 * @param {string} packageName - 包名
 * @returns {Promise<[string, string]>} 最稳定版本号和最新版本号
 */
export async function getLatestVersion(
  packageName: string,
): Promise<[string, string]> {
  const url = "https://crates.io/api/v1/crates/" + packageName;
  const res = await (await fetch(url)).json();
  const data = <CargoIoData>res;
  return [data.crate.max_stable_version, data.crate.max_version];
}
