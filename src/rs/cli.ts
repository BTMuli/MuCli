/**
 * @file src/rs/cli.ts
 * @description rs 命令-入口文件
 * @since 1.4.0
 */

import { Command } from "commander";
import ora from "ora";

import { getLatestVersion, readCargoToml } from "./utils";
import { getSubVersion } from "../utils/getBaseInfo";

const rs = new Command("rs");
const version = getSubVersion("rs");

// base info
rs.name("rs")
  .description("A cli tool for rs")
  .version(version, "-sv, --subversion");

interface RsUpdateOptions {
  package: string | undefined;
}

interface RsUpdatePkg {
  name: string;
  version: string;
  stable: string;
  latest: string;
}

// command for update package
rs.command("update")
  .description("update package")
  .option("-p, --package <package>", "package name")
  .action(async (opt: RsUpdateOptions) => {
    const res = await readCargoToml();
    if (res === false) {
      console.log("No Cargo.toml file found or parse failed");
      return;
    }
    if (opt.package !== undefined) {
      // 检测依赖中是否存在该包
      if (Object.keys(res).includes(opt.package)) {
        const spinner = ora(`Checking dependency ${opt.package}`).start();
        const latest = await getLatestVersion(opt.package);
        spinner.succeed(`Check dependency ${opt.package} success`);
        console.table({
          name: opt.package,
          version: res[opt.package],
          stable: latest[0],
          latest: latest[1],
        });
      } else {
        console.log(`The package ${opt.package} is not in the dependencies`);
      }
      return;
    }
    const updatePkgs: RsUpdatePkg[] = [];
    const spinner = ora("Checking dependencies").start();
    for (const pkg in res) {
      spinner.text = `Checking ${pkg}`;
      const pkgRes = await getLatestVersion(pkg);
      updatePkgs.push({
        name: pkg,
        version: res[pkg],
        stable: pkgRes[0],
        latest: pkgRes[1],
      });
    }
    spinner.succeed("Check dependencies success");
    console.table(updatePkgs);
  });

export default rs;
