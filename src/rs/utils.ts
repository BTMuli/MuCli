/**
 * @file src/rs/utils.ts
 * @description rs 命令-工具函数
 * @since 1.5.0
 * @version 1.2.0
 */

import fs from "node:fs";

import * as toml from "toml";
import { getVersion } from "../utils/getBaseInfo";
import ora, { Ora } from "ora";
import chalk from "chalk";

/**
 * @description 读取 cargo.toml 文件，返回所有依赖及其版本号
 * @function readCargoToml
 * @since 1.4.2
 * @version 1.2.0
 * @returns {Promise<MUCLI.Rust.CargoToml | false>} 依赖及其版本号
 */
export async function readCargoToml(): Promise<MUCLI.Rust.CargoToml | false> {
  let path = `${process.cwd()}/Cargo.toml`;
  if (!fs.existsSync(path)) path = `${process.cwd()}/src/Cargo.toml`;
  if (!fs.existsSync(path)) path = `${process.cwd()}/src-tauri/Cargo.toml`;
  if (!fs.existsSync(path)) return false;
  try {
    const content = toml.parse(fs.readFileSync(path, "utf-8"));
    const res: MUCLI.Rust.CargoToml = { buildDeps: [], devDeps: [], deps: [] };
    const spDevBuild = ora("Checking buildDependencies").start();
    for (const key in content["build-dependencies"]) {
      spDevBuild.start(`Checking dependency ${key}`);
      const pkg = await getPackageInfo(key, content["build-dependencies"][key]);
      res.buildDeps.push(pkg);
    }
    if (res.buildDeps.length !== 0)
      spDevBuild.succeed("Check buildDependencies success");
    else spDevBuild.info("No buildDependencies found");
    const spDep = ora("Checking dependencies").start();
    for (const key in content.dependencies) {
      spDep.start(`Checking dependency ${key}`);
      const pkg = await getPackageInfo(key, content.dependencies[key]);
      res.deps.push(pkg);
    }
    if (res.deps.length !== 0) spDep.succeed("Check dependencies success");
    else spDep.info("No dependencies found");
    const spDepDev = ora("Checking devDependencies").start();
    for (const key in content.devDependencies) {
      spDepDev.start(`Checking dependency ${key}`);
      const pkg = await getPackageInfo(key, content.devDependencies[key]);
      res.devDeps.push(pkg);
    }
    if (res.devDeps.length !== 0)
      spDepDev.succeed("Check devDependencies success");
    else spDepDev.info("No devDependencies found");
    if (
      res.buildDeps.length === 0 &&
      res.devDeps.length === 0 &&
      res.deps.length === 0
    )
      return false;
    return res;
  } catch (error) {
    return false;
  }
}

/**
 * @description 根据包名返回package信息
 * @function getPackageInfo
 * @since 1.4.2
 * @version 1.2.0
 * @param {string} name - 包名
 * @param {MUCLI.Rust.PackageInfo} info - 包信息
 * @returns {Promise<MUCLI.Rust.Package>} 包信息
 */
async function getPackageInfo(
  name: string,
  info: MUCLI.Rust.PackageInfo,
): Promise<MUCLI.Rust.Package> {
  let version;
  if (typeof info === "string") version = info;
  else version = info.version;
  if (version === undefined)
    return { name: name, version: "", latest: "", needUpdate: false };
  const latestVersion = await getLatestVersion(name);
  if (latestVersion === false)
    return { name: name, version: version, latest: "", needUpdate: false };
  return {
    name: name,
    version: version,
    latest: latestVersion.max_stable_version,
    needUpdate: version !== latestVersion.max_stable_version,
  };
}

/**
 * @description 获取指定包最新版本号
 * @function getLatestVersion
 * @since 1.4.2
 * @version 1.2.0
 * @param {string} packageName - 包名
 * @returns {Promise<MUCLI.Rust.Crate|false>} 最稳定版本号和最新版本号
 */
export async function getLatestVersion(
  packageName: string,
): Promise<MUCLI.Rust.Crate | false> {
  const url = "https://crates.io/api/v1/crates/" + packageName;
  const muCliVersion = getVersion();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent": `MuCli/${muCliVersion}(BTMuli bt-muli@outlook.com)`,
      },
    });
    const resJson = await resp.json();
    const data = <MUCLI.Rust.CargoIoData>resJson;
    return {
      max_stable_version: data.crate.max_stable_version,
      max_version: data.crate.max_version,
    };
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * @description 根据包信息输出对应信息
 * @function printPackageInfo
 * @since 1.4.2
 * @version 1.2.0
 * @param {MUCLI.Rust.Package[]|MUCLI.Rust.Package} packages - 包信息
 * @param {boolean} update - 是否更新
 * @returns {string[]} 输出信息
 */
export function printPackageInfo(
  packages: MUCLI.Rust.Package[] | MUCLI.Rust.Package,
  update: boolean = true,
): string[] {
  if (Array.isArray(packages))
    return packages.map((i) => printPackageInfo(i, update)).flat();
  if (!update) return [chalk.green(`${packages.name}:${packages.version}`)];
  if (!packages.needUpdate)
    return [`${packages.name}:${chalk.green(packages.version)} is up to date`];
  return [
    `${chalk.yellow(packages.name)}:${chalk.red(packages.version)} → ${chalk.green(packages.latest)}`,
  ];
}
